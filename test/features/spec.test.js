const { test } = require('elmer-fudd');

test({
  name: 'test.spec can be an object',
  unit: '@stubs/sum',
  spec: {
    given: [1, 2, 3],
    expect: 6,
  }
});

test({
  name: 'test.spec can be an array of objects',
  unit: '@stubs/sum',
  spec: [
    { given: [1, 2, 3], expect: 6 },
    { given: [10, 20], expect: 30 },
  ]
});

test({
  name: 'test.spec works with deep results',
  unit: '@stubs/sum',
  mock: [
    ['@stubs/operator', (a, b) => [...a, ...b]],
  ],
  spec: [
    { given: [[1, 2], [3, 4]], expect: [1, 2, 3, 4] },
  ]
});
