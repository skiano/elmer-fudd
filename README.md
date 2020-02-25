# elmer-fudd

_Hunt for Bugs!_

### What is it?

A test runner for smallish node projects with an opinionated take on mocking (and _very_ few dependencies).

### Dependencies

|Package|Why|
|:------|:--|
|`pirates`| for patching require |
|`stack-trace`| for identifying call sites |

### Example

Assuming you have a project structured like so:

```
package.json
src/
  double.js
test/
  double.test.js
```

In your package json you could add:

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

```javascript
const { test, assert } = require('elmer-fudd');

test({
  name: 'My super minimal example test',
  spec: () => {
    assert.ok(true);
  }
});

test({
  name: 'My unit test without any mocks',
  unit: '@src/lib/unit',
  spec: (unit) => {
    assert.ok(unit);
  }
});

test({
  name: 'My first unit test with mocking',
  unit: '@src/lib/unit',
  mock: [
    ['@src/lib/dep', { fake: true }]
  ],
  spec: (unit, [dep]) => {
    assert.ok(unit);
    assert.ok(dep.fake);
  },
});
```
