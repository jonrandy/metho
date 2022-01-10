export function add(target, f, outerSyntax = false) {
  return f.length
    ? outerSyntax
      ? addProperty(target, f)
      : addWithParams(target, f)
    : addSimple(target, f);
}

export function addProperty(target, f) {
  const s = Symbol(f.name);
  target[s] = f;
  return s;
}

export function addWithParams(target, f) {
  return function (...args) {
    const s = Symbol(f.name);
    Object.defineProperty(target, s, {
      configurable: true,
      get: function () {
        delete target[s];
        return f.apply(this, args);
      },
    });
    return s;
  };
}

export function addSimple(target, f) {
  const s = Symbol(f.name);
  Object.defineProperty(target, s, { configurable: true, get: f });
  return s;
}

// may well need the ability to add descriptions for these Symbols that are flying around
