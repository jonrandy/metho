# Metho - A new method for methods

A small library to allow you to safely add 'dynamic properties' to objects, with the help of Symbols. This is useful for 'monkey patching' native JavaScript types to give them new capabilities. Some examples:

```js
import * as Metho from 'metho'

const asHex = Metho.add(
  Number.prototype,
  function() { return this.toString(16) }
)

console.log(65534[asHex])  // fffe

const upper = Metho.add(
  String.prototype,
  function() { return this.toUpperCase() }
)
const chunk = Metho.add(
  String.prototype,
  function(length) {
    return this.match(new RegExp('.{1,' + length + '}', 'g'))
  }
)

console.log("Hello World!"[upper][chunk(2)])  // ['HE', 'LL', 'O ', 'WO', 'RL', 'D!']
```

## How to use

Metho is fairly simple, and offers 4 basic functions for adding these 'dynamic properties' to your target object(s). All functions will return either a Symbol, or a function that returns a Symbol. These Symbols are the property 'names'.

### `add(targetOrTargets, function, [options={}])`
This is probably the function you'll need most often. It will use from `addWithParams` or `addSimple` based on the arity of the passed function - an arity of 0 will cause `addSimple` to be used, anything else will cause `addWithParams` or `addProperty` to be used - based upon the state of `outerSyntax`. When added with option `outerSyntax` set to `true` - the syntax for your property will be that of a more regular function call:
```js
// options.outerSyntax = false
object[property(x)]

// options.outerSyntax = true
object[property](x)
```
There is a slight performance hit when not using `outerSyntax` - hence the reason for the switch. To specify more than one target for the function, you should pass an array of targets.

### `addWithParams(targetOrTargets, function, [options={}])`
Adds a 'dynamic property` that can accept parameters
```js
console.log(object[property(param1, param2)]
```

### `addSimple(targetOrTargets, function, [options={}])`
Adds a 'dynamic property` that has no parameters
```js
console.log(object[property])
```

### `addProperty(targetOrTargets, propertyValue, [options={}])`
Adds a regular property to the target(s) (will not be automatically called if it is a function)
```js
console.log(object[property])
```
