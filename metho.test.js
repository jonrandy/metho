import * as Metho from './metho.js'

describe("metho library", () => {
  it("should augment multiple prototypes", () => {
    const nonHash = Symbol("No hash")
    const constHash = Metho.add(
      [Number.prototype, String.prototype],
      () => nonHash,
    )

    expect(12345[constHash]).toBe(nonHash)
    expect("this is a string"[constHash]).toBe(nonHash)
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

    it("should augment a single prototype (outer)", () => {
      const chunk = Metho.add(
        String.prototype,
        function(length) {
          return this.match(new RegExp('.{1,' + length + '}', 'g'))
        }
      )

      expect("Hello World!"[chunk(2)])
        .toEqual(["He", "ll", "o ", "Wo", "rl", "d!"])
    })

    it("should augment a single prototype (outer)", () => {
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
