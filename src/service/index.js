import accountApi from './accountApi';
import publicApi from './publicApi';
import lineApi from './lineNotifyApi';
import logger from '../utils/logger';

function getData(res) {
  if (res.ok !== true) {
    logger.error(`response is not ok - status: ${res.status}, problem: ${res.problem}`, res);
    return { error: 'response status is not ok', data: null };
  }
  return { error: null, data: res.data };
}

module.exports = {
  accountApi,
  publicApi,
  lineApi,
  getData,
};
