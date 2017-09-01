import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import cron from 'node-cron';

import logger from './utils/logger';
import routes from './routes';
import config from './config';

import variationAlarm from './coinone/variationAlarm';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
} else {
  const corsOptions = {
    origin: [
      /^https?:\/\/localhost(:[0-9]+)?\/?$/,
      /^https?:\/\/127.0.0.1(:[0-9]+)?\/?$/,
    ],
  };
  logger.info('Cors option is required');
  app.use(cors(corsOptions));
}

app.set('port', config.port);
app.use(morgan('tiny', { stream: logger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  res.status(500).send({ error: 'invalid data' });
  next(err);
});

app.use('/', routes);

cron.schedule('0 5 * * * *', variationAlarm('btc', 2.5));
cron.schedule('0 5 * * * *', variationAlarm('bch', 2.5));
cron.schedule('0 5 * * * *', variationAlarm('eth', 2.5));
cron.schedule('0 5 * * * *', variationAlarm('etc', 2.5));
cron.schedule('0 5 * * * *', variationAlarm('xrp', 2.5));
cron.schedule('0 5 * * * *', variationAlarm('qtum', 2.5));

app.listen(app.get('port'), () => {
  logger.info('Server log level is', logger.logLevel);
  logger.info(`Express server listening on port ${app.get('port')}`);
});

