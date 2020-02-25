const { test, assert, mockFn } = require('elmer-fudd');

test({
  name: 'example fake functions',
  spec: () => {
    const mock = mockFn();

    mock.returns('abc');

    const result = mock('123');

    assert.ok(mock.calledWith('123'));
    assert.equal(result, 'abc');
  }
})