import create from '../service/accountApi';
import logger from '../utils/logger';
import CoinoneErrCodeMap from '../common/coinoneErrCode';

function getData(res) {
  if (res.ok !== true) {
    logger.error(`Account response is not ok - status: ${res.status}, problem: ${res.problem}`);
    return { error: 'response status is not ok', data: null };
  }
  return { error: null, data: res.data };
}

export default class Account {
  constructor(AccessTocken, SecretKey) {
    this.token = AccessTocken;
    this.key = SecretKey;
  }

  async info() {
    logger.debug(`Account - token: ${this.token}, key: ${this.key}`);
    const api = create(this.token, this.key);
    const response = await api.info();
    const { error, data } = getData(response);
    if (error !== null) return null;

    if (data.result !== 'success') {
      logger.error(`Account info - ErrCode: ${data.errorCode}, ErrMsg: ${data.errorMessage}, ErrCodeMap: ${CoinoneErrCodeMap[data.errorCode]}`);
      return null;
    }
    return data.userInfo;
  }
}
