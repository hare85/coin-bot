import apisauce from 'apisauce';
import crypto from 'crypto';
import logger from '../utils/logger';

const create = (AccessToken = '', SecretKey = '', baseURL = 'https://api.coinone.co.kr/') => {
  let payload = {
    access_token: AccessToken,
    nonce: Date.now(),
  };
  payload = new Buffer(JSON.stringify(payload)).toString('base64');

  const signature = crypto
    .createHmac('sha512', SecretKey.toUpperCase())
    .update(payload)
    .digest('hex');

  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'X-COINONE-PAYLOAD': payload,
      'X-COINONE-SIGNATURE': signature,
    },
    timeout: 10000,
  });
  api.addRequestTransform((request) => {
    logger.info(`Public api request - data: ${request.data}, method: ${request.method}, url: ${request.url}, params: ${request.params}`);
  });
  api.addResponseTransform((response) => {
    logger.info(`Public api response - duration: ${response.duration}, problem: ${response.problem}, ok: ${response.ok}, status: ${response.status}`);
  });

  const trades = (currency = 'btc', period = 'hour') => api.get(`trades?currency=${currency}&period=${period}&format=json`);

  return {
    trades,
  };
};

export default create;
