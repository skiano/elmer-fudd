const { test, assert, mockFn } = require('elmer-fudd');

// test({
//   name: 'mocks can return',
//   spec: () => {
//     const mock = mockFn();

//     mock.returns('abc');
//     const result = mock('123');
//     assert.ok(mock.calledWith('123'));
//     assert.equal(result, 'abc');
//   }
// });

test({
  name: 'mockFn.returns',
  spec: () => {
    const mock = mockFn();
    mock.returns('abc');
    assert.equal(mock(), 'abc');
  }
});

test({
  name: 'mockFn.calledWith',
  spec: () => {
    const mock = mockFn();
    mock(345, 567)
    mock(123);
    mock([1, 2]);
    assert.ok(mock.calledWith(123));
    assert.ok(mock.calledWith(345, 567));
    assert.ok(mock.calledWith([1, 2]));
    assert.equal(mock.calledWith(1000), false);
  }
});

test({
  name: 'mockFn.throws',
  spec: () => {
    const mock = mockFn();
    mock.throws(new Error('poo'));
    assert.throws(mock, new Error('poo'));
  }
});

test({
  name: 'mockFn.rejects',
  spec: async () => {
    const mock = mockFn();
    mock.rejects(new Error('poo'));
    await assert.rejects(mock, new Error('poo'));
  }
});

test({
  name: 'mockFn.resolves',
  spec: async () => {
    const mock = mockFn();
    mock.resolves(123);
    const v = await mock();
    assert.equal(v, 123);
  }
});