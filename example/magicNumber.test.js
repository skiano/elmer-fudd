const assert = require('assert');
const { test } = require('..');

test('should equal 42', {
  unit: './magicNumber',
}, async (number) => {
  assert.equal(number, 42, 'should equal 42');
});
