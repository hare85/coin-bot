import R from 'ramda';
import dateFormat from 'dateformat';
import CoinoneErrCodeMap from '../common/coinoneErrCode';
import { publicApi, lineApi, getData } from '../service';
import logger from '../utils/logger';

const lineNoti = lineApi().notify;

const allowedCurrency = ['btc', 'bch', 'eth', 'etc', 'xrp', 'qtum'];
const allowedPeriod = ['hour', 'day'];
const LastTimeMap = {
  btc: 0,
  bch: 0,
  eth: 0,
  etc: 0,
  xrp: 0,
  qtum: 0,
};

async function getTrades(currency = 'btc', period = 'hour') {
  if (!R.contains(currency, allowedCurrency)) {
    logger.error(`getChart - Not allowed currency: currency: ${currency}`);
    return null;
  }

  if (!R.contains(period, allowedPeriod)) {
    logger.error(`getChart - Not allowed period: period: ${period}`);
    return null;
  }

  const api = publicApi();
  const response = await api.trades(currency, period);
  const { error, data } = getData(response);
  if (error !== null) return null;

  if (data.result !== 'success') {
    logger.error(`getTrades not succeed- ErrCode: ${data.errorCode}, ErrMsg: ${data.errorMessage}, ErrCodeMap: ${CoinoneErrCodeMap[data.errorCode]}`);
    return null;
  }

  return data;
}

function print(v, st, order, currency, variation) {
  const timeInterval = order.timestamp - st;
  const hours = Math.floor(timeInterval / 60 / 60);
  const mins = Math.floor((timeInterval - (hours * 60 * 60)) / 60);
  const seconds = Math.floor((timeInterval - (hours * 60 * 60)) - (mins * 60));
  const startDate = dateFormat(new Date(st * 1000), 'yy-mm-dd HH:MM:ss');
  const endDate = dateFormat(new Date(order.timestamp * 1000), 'yy-mm-dd HH:MM:ss');
  let message = '';
  if (v < 0) {
    if (v < -variation) {
      message = `
      --- ${currency} ---
      ${startDate} 부터
      ${endDate},
      ${hours % 24}:${mins}:${seconds} 간
      ${v.toFixed(3)} 감소`;
      logger.debug(message);
      // lineNoti(message);
    }
  } else if (v > variation) {
    message = `
    --- ${currency} ---
    ${startDate} 부터
    ${endDate},
    ${hours % 24}:${mins}:${seconds} 간
    ${v.toFixed(3)} 증가`;
    logger.debug(message);
    // lineNoti(message);
  }
}

async function variationAlarm(currency = 'xrp', variation = 2.5, timeRange = 300) {
  const trades = await getTrades(currency);
  if (trades === null) return;

  let completeOrders = trades.completeOrders;

  completeOrders = completeOrders.map((completeOrder, i) => {
    const { timestamp, price } = completeOrder;

    let v = 0;
    if (i !== 0) {
      const beforePrice = completeOrders[i - 1].price;
      v = ((price / beforePrice) * 100) - 100;
    }

    return {
      timestamp,
      price,
      variation: v,
    };
  });

  completeOrders = R.filter(v => v.timestamp > LastTimeMap[currency])(completeOrders);

  let variationSum;
  const isUp = true;
  let startTimestamp = completeOrders[0].timestamp;

  R.forEach((completeOrder) => {
    if ((completeOrder.timestamp - startTimestamp) > timeRange) {
      print(variationSum, startTimestamp, completeOrder, currency, variation);
      variationSum = 0;
      startTimestamp = completeOrder.timestamp;
    }

    variationSum += completeOrder.variation;


    // if (completeOrder.variation < 0) {
    //   if (isUp === true) {
    //     print(variationSum, startTimestamp, completeOrder, currency, variation);
    //     startTimestamp = completeOrder.timestamp;
    //     variationSum = 0;
    //     isUp = false;
    //   }
    //   if (variationSum >= variation) {
    //     print(variationSum, startTimestamp, completeOrder, currency, variation);
    //   }
    // } else if (isUp === false) {
    //   print(variationSum, startTimestamp, completeOrder, currency, variation);
    //   startTimestamp = completeOrder.timestamp;
    //   variationSum = 0;
    //   isUp = true;
    // }
    // logger.debug(variationSum, completeOrder.variation);
    // variationSum += completeOrder.variation;
    // if (isUp === false && variationSum <= -variation) {
    //   print(variationSum, startTimestamp, completeOrder, currency, variation);
    // }
  }, completeOrders);
  LastTimeMap[currency] = startTimestamp;
}

export default variationAlarm;
