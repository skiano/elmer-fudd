const { test, assert, mockFn } = require('elmer-fudd');

test({
  name: 'injects a unit (relative)',
  unit: '../stubs/foo',
  spec: (foo) => {
    assert.deepEqual(foo(10), { value: 10, bar: { value: 20, baz: { value: 60 } } });
  }
});

test({
  name: 'injects a unit (alias)',
  unit: '@stubs/foo',
  spec: (foo) => {
    assert.deepEqual(foo(10), { value: 10, bar: { value: 20, baz: { value: 60 } } });
  }
});

test({
  name: 'mocks a child',
  unit: '@stubs/foo',
  mock: [
    ['@stubs/bar', () => 2],
  ],
  spec: (foo) => {
    assert.deepEqual(foo(10), { value: 10, bar: 2 });
  }
});

test({
  name: 'mocks a grandchild',
  unit: '@stubs/foo',
  mock: [
    ['@stubs/baz', () => 10],
  ],
  spec: (foo) => {
    assert.deepEqual(foo(10), { value: 10, bar: { value: 20, baz: 10 } });
  }
});

test({
  name: 'mocks using a fake',
  unit: '@stubs/foo',
  mock: [
    ['@stubs/bar', mockFn()],
  ],
  spec: (foo, [bar]) => {
    bar.returns(5);
    assert.deepEqual(foo(10), { value: 10, bar: 5 });
  }
});