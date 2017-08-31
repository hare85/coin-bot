'use strict';

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dateformat from 'dateformat';

_winston2.default.emitErrs = true;

// winston default log level { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var logLevel = process.env.LOGLEVEL || 'debug';

var logger = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.Console({
    // timestamp: () => { return dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss') },
    // timestamp: () => { return dateformat(new Date(), 'UTC:yyyy-mm-dd HH:MM:ss') },
    // timestamp: () => { return dateformat(new Date(), 'isoUtcDateTime') },
    // => 2007-06-09T22:46:21Z
    timestamp: true, // => 2017-04-21T05:12:23.169Z
    level: logLevel,
    handleExceptions: true,
    colorize: true
  })],
  exitOnError: false
});

module.exports = logger;
module.exports.logLevel = logLevel;
module.exports.stream = {
  write: function write(message) {
    logger.info(message.slice(0, -1));
  }
};