const operator = require('./operator');
module.exports = (...args) => args.reduce(operator);
