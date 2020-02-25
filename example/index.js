require('./setup.test'); // allows fake require

const path = require('path');
const { run } = require('../lib');

run({
  ext: '.test.js',
  root: path.join(__dirname, 'tests'),
  alias: {
    '@src': path.join(__dirname, 'src'),
  },
});
