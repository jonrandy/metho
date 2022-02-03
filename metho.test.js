import * as Metho from './metho.js'

describe("metho library", () => {
  it("should export a data Symbol", () => {
    expect(Metho.data).not.toBeUndefined()
  })

  it("should augment multiple prototypes", () => {
    const multiFunc = function (t) {
      return this[Metho.data] + ' --- ' + t
    }
    const multi = Metho.add(
      [Array.prototype, String.prototype],
      multiFunc,
      { symbolName: "kumquat" },
    )

    Array.prototype[Metho.data] = "array"
    String.prototype[Metho.data] = "string"

    expect("Jon"[multi(111)]).toBe("string --- 111")
    expect([][multi(222)]).toBe("array --- 222")

    expect(multi.targets.map((target) => target.constructor.name).sort())
      .toEqual(["Array", "String"])
  })

  describe("add", () => {
    it("should augment a single prototype (named)", () => {
      const asHex = Metho.add(
        Number.prototype,
        function toHex () { return this.toString(16) }
      )

      expect(65534[asHex]).toBe("fffe")
    })

    it("should augment a single prototype (unnamed)", () => {
      const asHex = Metho.add(
        Number.prototype,
        function () { return this.toString(16) }
      )

      expect(65534[asHex]).toBe("fffe")
    })

    it("should augment a single prototype (outerSyntax: false)", () => {
      const chunk = Metho.add(
        String.prototype,
        function(length) {
          return this.match(new RegExp('.{1,' + length + '}', 'g'))
        }
      )

      expect("Hello World!"[chunk(2)])
        .toEqual(["He", "ll", "o ", "Wo", "rl", "d!"])
    })

    it("should augment a single prototype (outerSyntax: true)", () => {
      const chunk = Metho.add(
        String.prototype,
        function(length) {
          return this.match(new RegExp('.{1,' + length + '}', 'g'))
        },
        {outerSyntax: true}
      )

      expect("Hello World!"[chunk](2))
        .toEqual(["He", "ll", "o ", "Wo", "rl", "d!"])
    })

    it("should use the provided symbolName", () => {
      const symbolName = "octal"
      const oct = Metho.add(
        Number.prototype,
        function oct() { return this.toString(8) },
        { symbolName },
      )

      expect(oct.toString()).toBe(Symbol(symbolName).toString())
    })
  })

  describe("addSimple", () => {
    it("should augment a single prototype (named)", () => {
      const asHex = Metho.addSimple(
        Number.prototype,
        function toHex () { return this.toString(16) }
      )

      expect(65534[asHex]).toBe("fffe")
    })

    it("should augment a single prototype (unnamed)", () => {
      const asHex = Metho.addSimple(
        Number.prototype,
        function () { return this.toString(16) }
      )

      expect(65534[asHex]).toBe("fffe")
    })
  })

  describe("addProperty", () => {
    it("should augment a single prototype (named)", () => {
      const chunk = Metho.addProperty(
        String.prototype,
        function chunks(length) {
          return this.match(new RegExp('.{1,' + length + '}', 'g'))
        }
      )

      expect("Hello World!"[chunk](2))
        .toEqual(["He", "ll", "o ", "Wo", "rl", "d!"])
    })

    it("should augment a single prototype (unnamed)", () => {
      const chunk = Metho.addProperty(
        String.prototype,
        function(length) {
          return this.match(new RegExp('.{1,' + length + '}', 'g'))
        },
        {outerSyntax: true}
      )

      expect("Hello World!"[chunk](2))
        .toEqual(["He", "ll", "o ", "Wo", "rl", "d!"])
    })
  })

  describe("addWithParams", () => {
    it("should augment a single prototype (named)", () => {
      const chunk = Metho.addWithParams(
        String.prototype,
        function chunks(length) {
          return this.match(new RegExp('.{1,' + length + '}', 'g'))
        }
      )

      expect("Hello World!"[chunk(2)])
        .toEqual(["He", "ll", "o ", "Wo", "rl", "d!"])
    })

    it("should augment a single prototype (unnamed)", () => {
      const chunk = Metho.addWithParams(
        String.prototype,
        function(length) {
          return this.match(new RegExp('.{1,' + length + '}', 'g'))
        }
      )

      expect("Hello World!"[chunk(2)])
        .toEqual(["He", "ll", "o ", "Wo", "rl", "d!"])
    })
  })
})
