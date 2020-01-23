const assert = require('assert');
const { test } = require('..');

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test('should equal 42', {
  unit: './magicNumber',
}, async (number) => {
  assert.equal(number, 42, 'should equal 42');
});
