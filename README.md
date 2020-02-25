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

<details><summary><strong>package.json</strong></summary><div>
  
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

<details><summary><strong>src/multiply.js</strong></summary><div>
  
```javascript
const scale = require('./scale');
module.exports = (value) => value * scale;
```

</div></details>

<details><summary><strong>src/scale.js</strong></summary><div>
  
```javascript
module.exports = 10;
```

</div></details>

</div></details>

<details><summary><strong>test/multiply.test.js</strong></summary><div>
  
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
