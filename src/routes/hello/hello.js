import logger from '../../utils/logger';

async function hello(req, res) {
  logger.debug('hello entered');

  res.json({
    Hello: 'world',
  });
}

// curl -H "Content-Type: application/json" -X POST -d '{}' localhost:5000/bw/list

export default hello;
