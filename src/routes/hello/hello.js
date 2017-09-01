import logger from '../../utils/logger';
import Account from '../../coinone/account';
import config from '../../config';

async function hello(req, res) {
  logger.debug('hello entered');

  const account = new Account(config.ACCESS_TOKEN, config.SECRET_KEY);
  const accountInfo = await account.info();

  console.log('hello', accountInfo);

  res.json({
    Hello: 'world',
  });
}

// curl -H "Content-Type: application/json" -X POST -d '{}' localhost:5000/bw/list

export default hello;
