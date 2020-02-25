const { test, assert, mockFn } = require('elmer-fudd');

test({
  name: 'mockFn.returns',
  spec: () => {
    const mock = mockFn();
    mock.returns('abc');
    assert.equal(mock(), 'abc');
  }
});

test({
  name: 'mockFn.implementation',
  spec: () => {
    const mock = mockFn();
    mock.implementation((a, b) => a + b);
    assert.equal(mock(1, 2), 3);
  }
});

test({
  name: 'mockFn.calledWith',
  spec: () => {
    const mock = mockFn();
    mock(345, 567);
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

test({
  name: 'mockFn.calls',
  spec: () => {
    const mock = mockFn();
    mock(1);
    mock(2, 3);
    assert.deepEqual(mock.calls, [[1], [2, 3]]);
  }
});

test({
  name: 'mockFn.count',
  spec: () => {
    const mock = mockFn();
    mock(1);
    mock(2, 3);
    assert.equal(mock.count, 2);
  }
});

test({
  name: 'mockFn.reset',
  spec: () => {
    const mock = mockFn();
    mock.returns('abc');
    mock(1);
    mock.reset();
    assert.equal(mock(2), undefined);
    assert.equal(mock.count, 1);
    assert.deepEqual(mock.calls, [[2]]);
  }
});