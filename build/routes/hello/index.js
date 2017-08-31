'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _expressWrapAsync = require('express-wrap-async');

var _expressWrapAsync2 = _interopRequireDefault(_expressWrapAsync);

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _hello = require('./hello');

var _hello2 = _interopRequireDefault(_hello);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

router.get('/', function (req, res) {
  return res.send('hello');
});
router.get('/world', (0, _expressWrapAsync2.default)(_hello2.default));

// error handling
router.use(function (err, req, res, next) {
  _logger2.default.error('/hello -', err);
  res.status(500);
  res.json({
    Error: err.message
  });
  next();
});
exports.default = router;