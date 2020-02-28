# elmer-fudd

<!-- ![Elmer Fudd hunting](https://media.giphy.com/media/3oFzmpOB6IYecRY5eo/giphy.gif) -->

A test runner for smallish node projects with an opinionated take on mocking and _very_ few dependencies. It helps you hunt for Bugs... get it?

<details><summary><strong>Dependencies</strong></summary><div>

|Package|Why|
|:------|:--|
|`pirates`| for patching require |
|`stack-trace`| for identifying call sites |

</div></details>

## Installation

```
$ npm install elmer-fudd
```

## Minimal Example Project

```
package.json
src/
  multiply.js
  scale.js
test/
  multiply.test.js
```

<details><summary>package.json</summary><div>

```json
{
  "elmer-fudd": {
    "ext": "test.js",
    "root": "test",
    "alias": {
      "@src": "src"
    }
  },
  "scripts": {
    "test": "elmer-fudd"
  },
}
```

</div></details>

<details><summary>src/multiply.js</summary><div>

```javascript
const scale = require('./scale');
module.exports = (value) => value * scale;
```

</div></details>

<details><summary>src/scale.js</summary><div>

```javascript
module.exports = 10;
```

</div></details>

</div></details>

<details><summary>test/multiply.test.js</summary><div>

```javascript
const { test, assert } = require('elmer-fudd');

test({
  name: 'Multiply without mocking',
  unit: '@src/multiply',
  spec: (multiply) => {
    assert.equal(multiply(5), 50);
  }
});

test({
  name: 'Multiply with mocked scale',
  unit: '@src/multiply',
  mock: [
    ['@src/scale', 2]
  ],
  spec: (multiply) => {
    assert.equal(multiply(5), 10);
  }
});

```

</div></details>

## Testing Api

### test

`test` takes a “test object” as an input, which allows you to specify a name, the unit you wish to test, any mocks you want to provide for dependencies, and a “spec” that runs assertions. Below are a few examples to get you started:

<details><summary>Test with just a spec</summary><div>

```javascript
const { test, assert } = require('elmer-fudd');

test({
  name: 'Test with just a spec',
  spec: () => {
    assert.ok(true);
  }
});
```
</div></details>

<details><summary>Unit testing a module</summary><div>

```javascript
const { test, assert } = require('elmer-fudd');

test({
  name: 'Unit testing a module',
  unit: './path/to/double.js'
  spec: (double) => {
    assert.equal(double(2), 4);
  }
});
```
</div></details>

<details><summary>Unit testing a module with mocked dependencies</summary><div>

```javascript
const { test, assert } = require('elmer-fudd');

test({
  name: 'Unit testing a module',
  unit: './path/to/unit.js',
  mock: [
    ['.path', { fake: true }],
  ],
  spec: (double) => {
    assert.equal(double(2), 4);
  }
});
```
</div></details>

<details><summary>Unit testing a module with a spec object</summary><div>

```javascript
const { test, assert } = require('elmer-fudd');

test({
  name: 'Using a spec object',
  unit: './path/to/sum.js',
  spec: [
    { given: [1, 2], expect: 3 },
    { given: [1, 2, 3], expect: 6 },
  ]
});
```
</div></details>

### assert

`assert` wraps node’s core `assert.strict` library so that failures can be grouped with tests. For detailed information [see the docs](https://nodejs.org/api/assert.html). Here are a few examples to give you some ideas:

_TODO examples that build..._

### mockFn

`mockFn` returns a mock function you can use in your specs. Here is how you might use a mock function.

```javascript
const { mockFn } = require('elmer-fudd');

const fn = mockFn();

fn.returns(2);

fn(); // returns 2
```

It is not a comprehensive solution, but if you need something more robust there is no reason you cannot use something like [sinon](https://sinonjs.org/) instead. Mock functions have the following methods and properties:

* `fn.returns(value)` makes the mock return a specific value
* `fn.implementation(fn)` adds an implementation to the mock
* `fn.calledWith(...args)` returns true if the mock has been called with these args
* `fn.throws(err)` when the mock is called, this error is thrown
* `fn.resolves(value)` the mock returns a promise that resolves this value
* `fn.rejects(err)` the mock returns a promise that rejects with this err
* `fn.reset()` resets the mock function
* `fn.calls` a getter that returns all the calls
* `fn.count` a getter that returns how many times the mock has been called
