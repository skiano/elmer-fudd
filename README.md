# elmer-fudd

A test runner for smallish node projects with an opinionated take on mocking and _very_ few dependencies. It helps you hunt for Bugs... get it?

<details><summary><strong>Dependencies</strong></summary><div>
  
|Package|Why|
|:------|:--|
|`pirates`| for patching require |
|`stack-trace`| for identifying call sites |

</div></details>

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

`test()` takes a “test object” as an input, which allows you to specify a name, the unit you wish to test, any mocks you want to provide for dependencies, and a “spec” that runs assertions. Below are a few examples to get you started:

_TODO examples that build..._

### assert

`assert` wraps node’s core `assert.strict` library so that failures can be grouped with tests. For detailed information [see the docs](https://nodejs.org/api/assert.html). Here are a few examples to give you some ideas:

_TODO examples that build..._

### mockFn

`mockFn` is a helper for creating simple spies. It is not as comprehensive as `jest.fn()`, but if you need something more robust there is no reason you cannot use something like [sinon](https://sinonjs.org/) instead.
