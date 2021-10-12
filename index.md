# Metho

## TL;DR
[Metho](https://github.com/jonrandy/metho) allows you to easily and safely add methods in the form of dynamic properties to any object. Sounds boring, but if used to extend native types, it allows for the construction of JS expressions with a somewhat unique syntax:
```js
// Add a range syntax to numbers
1[to(9)]  // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Give numbers properties
13[isOdd]  // true
99[isEven]  // false
45.3[floor]  // 45
254[hex]  // 'fe'

// Repeat stuff
5[times(myFunction)]  // run myFunction 5 times

// Go nuts!
'hello!'[titleCase][reverse][chunk(2)]  // ['!o', 'll', 'eH']
```


## Motivation/Inspiration

I recently read a similar post about creating a '[Built-in-like Range in JavaScript](https://dev.to/didof/built-in-like-range-in-javascript-4ckj)'. Whilst it had some interesting ideas, it used a syntax that didn't read very well and was kind of unsafe (monkey patching native objects). I had a few ideas for some other possible syntaxes, but wasn't sure if they would work - or even be possible. I did some experimenting, and as it turns out, they *did* work and could be implemented in a safe way. The techniques used could also be generalised into a flexible tool that could make many interesting syntax constructs possible.

## What the... ? How on earth does this work?

Admittedly, the examples above don't even look like valid JavaScript - but they are! Numbers, Strings, and other types in JS are essentially just objects, and objects have prototypes, methods etc. that can be modified just like any other. Native types can be given new capabilities.

However, it's generally accepted that modifying these native types is not a good idea as there is no guarantee your changes will not conflict with other libraries, or future changes to JS itself. So, how do we go about building something that will have the capability to add functionality to native types using the proposed syntax, but in a safe manner?

### Step 1: 'Safe' monkey patching

What if you could add a method to an object in such a way that it wouldn't conflict with any existing methods, or with future methods that might be added? Well, you can - using `Symbol`s. These are a relatively new addition to JS, but are extremely useful. Essentially, a `Symbol` is a totally unique value - nothing else is equal to it, or can be ever equal to it. They are created like this:
```js
const mySymbol = Symbol('My symbol description')
```
That's it! You've created a totally unique value. The description given to the symbol is totally optional, but can be useful in debugging.

How does this benefit us? Well, `Symbol`s can be used as object keys - giving us the ability to create methods with 'names' that are completely unique. This is how we can 'safely' monkey patch.

### Step 2: 'Calling' a method without using parentheses

In the initial examples - you probably noticed that the parentheses you'd normally expect to be involved when calling methods are missing, but values are still being returned:
```js
13[isEven]  // false
```
How is this achieved? Using property getters.

We can use [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) to define properties on an object that are not inert, but will return the result of a 'getter' function. So, to 'call' one of our unique methods without using parentheses we can define a property that is named using the `Symbol` and has a 'getter'  function that is our method.

### Step 3: Passing parameters

Unfortunately, by using a property getter we've just created a problem for ourselves. The syntax we are intending to allow:
```js
1[to(8)]  // [1, 2, 3, 4, 5, 6, 7, 8]
```
has a function call in the place where we previously had a `Symbol`. We effectively want to pass parameters into a 'getter' function - something we can't do.

I almost gave up at this point, but then I thought:
> “What if `to` was a function that returned a symbol that was the 'name' of a method that had been dynamically created as  a property getter on the target object by `to`, for our purposes? Then, this getter would immediately be called automatically because the returned symbol appears as the key in a bracket notation property-access of the object”

(Yes, I'm a hoot at parties)

Bingo! It worked. We 'simply' 😛 wrap a dynamically created function (that has the parameters already passed in) with another function that stores it as the 'getter' for a new `Symbol` property on the target object, and then return the `Symbol`. The dynamically created method also deletes itself when called to prevent the object filling up with these 'single-use' methods. The wrapper function then becomes our `to` 'method'.

Phew! If you understood that then you're probably interested in the code from Metho that does it:
```js
function addWithParams(target, method) {
  return(function(...args) {
    const s = Symbol()
    Object.defineProperty(target, s, {
      configurable: true,
      get: function() {
        delete target[s]
        return method.apply(this, args)
      }
    })
    return s
  })
}
```
This obviously creates an additional overhead when calling methods that use this syntax, so if performance is an issue it may be better to sacrifice the nice syntax for a method stored as a regular property (something that is also possible with Metho). In the case of `to` - you would end up with:
```js
1[to](3)  // [1, 2, 3]
```

## Using Metho
I wrote Metho to abstract away the mechanisms described above, and make it easy to focus on writing the method code. The 'range' example could be implemented as follows:
```js
import * as Metho from 'metho'

const to = Metho.add(
  Number.prototype,
  function(end, {step} = {step: this<=end?1:-1}) {
    let arr = [], i, d = end>this
    for (i=+this; d?(i<=end):(i>=end); i+=step) arr.push(i)
    return arr
  }
)

console.log(1[to(3)])  // [1, 2, 3]
console.log(7[to(4)])  // [7, 6, 5, 4]
console.log(2[to(10), {step: 2})  // [2, 4, 6, 8, 10]
```
This is a quick and dirty example - and probably not the best implementation of the range function, but you get the idea.

Similarly, a simple 'hex' property for numbers could be implemented thus:
```js
const hex = Metho.add(
  Number.prototype,
  function() { return this.toString(16) }
)

console.log(65535[hex]) // 'ffff'
```


## What's next?

The next logical step here is to build some libraries of useful extensions for the native JavaScript types. I'm trying to compile a list of functionality that would be great to have...

Ideas welcome! 🚀
