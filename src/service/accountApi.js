import apisauce from 'apisauce';
import logger from '../utils/logger';

const create = (baseURL = 'https://api.coinone.co.kr/v2/') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
  api.addRequestTransform((request) => {
    logger.info(`Account api request - data: ${request.data}, method: ${request.method}, url: ${request.url}, params: ${request.params}`);
  });
  api.addResponseTransform((response) => {
    logger.info(`Account api response - duration: ${response.duration}, problem: ${response.problem}, ok: ${response.ok}, status: ${response.status}`);
  });

  const info = () => api.post('account/user_info');

  return {
    info,
  };
};

export default create;
