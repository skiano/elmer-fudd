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

```javascript
const assert = require('assert');
const { test } = require('elmer-fudd');

test('I’m hunting wabbits!', {
  unit: './Gun',
  mock: {
    './Bullet': function FakeBullet() {
      this.isFake = true;
    }
  }
}, (Gun) => {
  const gun = new Gun();
  assert.ok(gun.bullets[0].isFake, 'uses mock bullet!');
});
```

