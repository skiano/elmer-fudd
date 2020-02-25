# elmer-fudd

_Hunt for Bugs!_

### What is it?

A test runner for smallish node projects with an opinionated take on mocking (and _very_ few dependencies).

### Dependencies

|Package|Why|
|:------|:--|
|`pirates`| for patching require |
|`stack-trace`| for identifying call sites |

### Example Project

Assuming you have a project structured like so:

```
package.json
src/
  multiply.js
  scale.js
test/
  multiply.test.js
  scale.test.js
```

Your code could look like the following:

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
