import apisauce from 'apisauce';
import logger from '../utils/logger';
import config from '../config';

const create = (baseURL = 'https://notify-api.line.me/api/notify/') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${config.LINE_NOTI_TOKEN}`,
    },
    timeout: 10000,
  });
  api.addRequestTransform((request) => {
    const params = Object.keys(request.data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(request.data[key])}`).join('&');
    request.data = params;

    logger.info(`Line norify api request - data: ${request.data}, method: ${request.method}, url: ${request.url}, params: ${request.params}`);
  });
  api.addResponseTransform((response) => {
    logger.info(`Line norify api response - duration: ${response.duration}, problem: ${response.problem}, ok: ${response.ok}, status: ${response.status}`);
    if (response.ok !== true) {
      logger.error('Line norify has error - response:', response);
    }
  });

  const notify = (message) => {
    api.post('', { message });
  };

  return {
    notify,
  };
};

export default create;
