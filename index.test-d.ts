import { expectType, expectError, expectNotType } from 'tsd'
import { add, addProperty, addWithParams, addSimple } from '.'

// Test invalid `this`
// Arrow function are not allowed
// `this` for arrow functions cannot be changed

{
    add(Number.prototype, () => expectError<Number>(this))
    add(Number.prototype, () => expectNotType<Number>(this))
    addProperty(Number.prototype, () => expectError<Number>(this))
    addProperty(Number.prototype, () => expectNotType<Number>(this))
    addWithParams(Number.prototype, () => expectError<Number>(this))
    addWithParams(Number.prototype, () => expectNotType<Number>(this))
    addSimple(Number.prototype, () => expectError<Number>(this))
    addSimple(Number.prototype, () => expectNotType<Number>(this))
}

// Test valid `this`

{
    addProperty(Number.prototype, function () { expectType<Number>(this) })
    class Class {}
    addProperty(Class.prototype, function () { expectType<Class>(this) })
    class SubClass extends Class {}
    addProperty(SubClass.prototype, function () { expectType<Class>(this) })
}
{
    addWithParams(Number.prototype, function () { expectType<Number>(this) })
    class Class {}
    addWithParams(Class.prototype, function () { expectType<Class>(this) })
    class SubClass extends Class {}
    addWithParams(SubClass.prototype, function () { expectType<Class>(this) })
}
{
    addSimple(Number.prototype, function () { expectType<Number>(this) })
    class Class {}
    addSimple(Class.prototype, function () { expectType<Class>(this) })
    class SubClass extends Class {}
    addSimple(SubClass.prototype, function () { expectType<Class>(this) })
}

// Test return type

{
    expectType<symbol>(add(Number.prototype, function() {}))
    expectType<symbol>(add(Number.prototype, function(arg: string) {}, true))
    expectType<(arg: string) => symbol>(add(Number.prototype, function(arg: string) {}))
    expectType<(arg: string) => symbol>(add(Number.prototype, function(arg: string) {}, false))
    expectType<symbol>(addProperty(Number.prototype, function() {}))
    expectType<(arg: string) => symbol>(addWithParams(Number.prototype, function(arg: string) {}))
    expectType<symbol>(addSimple(Number.prototype, function() {}))
}

// Test symbol call

const toString = addSimple(Number.prototype, function (): string { return this.toString() })

declare global {
    interface Number {
        // I think here we hit a TypeScript limitation
        // Added manually so the test won't fail
        // But basically one when will create such symbols
        // Can also manually declare the types for his prototypes
        [key: typeof toString]: string
    }
}

expectType<string>(1[toString])