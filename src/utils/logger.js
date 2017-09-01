import winston from 'winston';
// import dateformat from 'dateformat';

winston.emitErrs = true;

// winston default log level { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const logLevel = process.env.LOGLEVEL || 'debug';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      // timestamp: () => { return dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss') },
      // timestamp: () => { return dateformat(new Date(), 'UTC:yyyy-mm-dd HH:MM:ss') },
      // timestamp: () => { return dateformat(new Date(), 'isoUtcDateTime') },
      // => 2007-06-09T22:46:21Z
      timestamp: true, // => 2017-04-21T05:12:23.169Z
      level: logLevel,
      handleExceptions: true,
      colorize: true,
      prettyPrint: true,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
module.exports.logLevel = logLevel;
module.exports.stream = {
  write: (message) => {
    logger.info(message.slice(0, -1));
  },
};
