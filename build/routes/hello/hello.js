'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function hello(req, res) {
  _logger2.default.debug('hello entered');

  res.json({
    Hello: 'world'
  });
}

// curl -H "Content-Type: application/json" -X POST -d '{}' localhost:5000/bw/list

exports.default = hello;