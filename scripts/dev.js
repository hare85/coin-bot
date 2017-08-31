const nodemon = require('nodemon'); // eslint-disable-line import/no-extraneous-dependencies

process.env.NODE_ENV = 'development';

nodemon('--exec babel-node ./src/index.js --watch ./src');

nodemon.on('start', () => {
  console.log('[nodemon] App has started');
}).on('quit', () => {
  console.log('[nodemon] App has quit');
  process.exit(1);
}).on('restart', (files) => {
  console.log('[nodemon] App restarted due to:', files);
});
