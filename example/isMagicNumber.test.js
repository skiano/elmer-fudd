const assert = require('assert');
const { test } = require('..');

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test('should equal 14', {
  unit: './isMagicNumber',
  mock: {
    './magicNumber': 14,
  }
}, async (isMagicNumber) => {
  console.log(require('./magicNumber'));
  await pause(500);
  console.log(require('./magicNumber'));
  assert.ok(isMagicNumber(14));
});

test('should equal 12', {
  unit: './isMagicNumber',
  mock: {
    './magicNumber': 12,
  }
}, async (isMagicNumber) => {
  console.log(require('./magicNumber'));
  await pause(500);
  console.log(require('./magicNumber'));
  assert.ok(isMagicNumber(12));
});

test('should be real', {
  unit: './isMagicNumber',
}, async (isMagicNumber) => {
  console.log(require('./magicNumber'));
  await pause(500);
  console.log(require('./magicNumber'));
  assert.ok(isMagicNumber(42));
});
