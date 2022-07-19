
# Metho - A new method for methods

<img align="right" height=100 src="https://user-images.githubusercontent.com/1510194/173243187-08fdcc0f-204d-43c0-b07e-5b7bcb2713a4.png">A small library to allow you to safely add 'dynamic properties' to objects, with the help of Symbols. This is useful (among other things) for 'monkey patching' native JavaScript types to give them new capabilities (see [metho-number](https://github.com/jonrandy/metho-number), [metho-set](https://github.com/jonrandy/metho-set), [metho-function](https://github.com/jonrandy/metho-function), [metho-array](https://github.com/jonrandy/metho-array), and [metho-string](https://github.com/jonrandy/metho-string)).

Some examples of what is possible:

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
This is probably the function you'll need most often. It will use either `addWithParams` or `addSimple` based on the number of arguments the passed function expects - 0 will cause `addSimple` to be used, anything else will cause `addWithParams` or `addProperty` to be used - based upon the state of the `outerSyntax` option. When added with `outerSyntax` set to `true` - the syntax for your property will be that of a more regular function call:
```js
// options.outerSyntax = false
object[property(x)]

// options.outerSyntax = true
object[property](x)
```
There is a slight performance hit when not using `outerSyntax` - hence the reason for the switch. To specify more than one target for the function, you should pass an array of targets.

**Important note** - it has been pointed out that functions with a default argument(s) that start from the first argument do not seem to work correctly with the `add` method. Whilst they do *seem* to behave oddly, they are actually behaving correctly as they do not actually *expect* any arguments (for a clearer explanation, see the information about [`function.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length) on MDN). If you want to add such methods you should use the `addWithParams` method directly.

### `addWithParams(targetOrTargets, function, [options={}])`
Adds a 'dynamic property` that can accept parameters. If you wish to pass **no** parameters when calling it, you can simply omit the parentheses - this is particularly useful in the case of functions where all parameters have defaults or are entirely optional.
```js
console.log(object[property(param1, param2)]  // call the dynamic property and pass parameters
console.log(object[propertyWithDefaultParams])  // equivalent to object[propertyWithDefaultParams()]

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

## Advanced usage and `options`

Most, if not all of the below were added to facilitate the ability to have Metho 'methods' that can be shared between different targets in different libraries (e.g. the 'method' would acquire more capabilities when a second library is imported that uses it). For an example of this in action, please refer to the [metho-string](https://github.com/jonrandy/metho-string) and [metho-array](https://github.com/jonrandy/metho-array) libraries - where this functionality is used to create shared 'methods' such as `reverse` and `chunk`.

### Option `symbolName`
This is used to give a name to the generated Symbol (i.e. when it is created with `new Symbol(symbolName`)

### Option `register`
Used to internally register the created/used `Symbol` (or function) in an internal registry within Metho - used in conjunction `symbolName` which will become the 'key' in the registry

### Option `useSymbol`
This allows an existing Symbol to be used instead of a new one being created. This is available only for `addProperty` and `addSimple` - meaning that it can also be passed to `add`

### `data`
This is a symbol created by Metho for the intended purpose of being a key to store arbitary 'data' on a target object
```js
myTarget[Metho.data] = "Arbitrary value"
```

### `getRegistered(name)`
This will return the Symbol or function stored in the registry with the given name as key

### `addWithSharedSymbolName(target, function, symbolName)`
A convenience function to assist when adding new 'methods' to new targets, where the 'method' may already be in existence. This is best understood in conjunction with `metho-string` and `metho-array` mentioned above
