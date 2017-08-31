'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _logger = require('./utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

if (process.env.NODE_ENV !== 'production') {
  app.use((0, _cors2.default)());
} else {
  var corsOptions = {
    origin: [/^https?:\/\/localhost(:[0-9]+)?\/?$/, /^https?:\/\/127.0.0.1(:[0-9]+)?\/?$/]
  };
  _logger2.default.info('Cors option is required');
  app.use((0, _cors2.default)(corsOptions));
}

app.set('port', _config2.default.port);
app.use((0, _morgan2.default)('tiny', { stream: _logger2.default.stream }));

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(function (err, req, res, next) {
  res.status(500).send({ error: 'invalid data' });
  next(err);
});

app.use('/', _routes2.default);

app.listen(app.get('port'), function () {
  _logger2.default.info('Server log level is', _logger2.default.logLevel);
  _logger2.default.info('Express server listening on port ' + app.get('port'));
});