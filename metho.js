export const data = Symbol('methoData')

// TODO - optionally store created symbols/funcs in a registry so we can check if something already defined (do we need this?)

export function add(targetOrTargets, f, {outerSyntax=false, symbolName=f?.name}={}){
  return f.length ?
    outerSyntax ?
      addProperty(targetOrTargets, f, {symbolName})
    :
      addWithParams(targetOrTargets, f, {symbolName})
  :
    addSimple(targetOrTargets, f, {symbolName})
}

export function addProperty(targetOrTargets, f, {symbolName = f?.name}={}) {
  const s = Symbol(symbolName)
  sanitiseTargets(targetOrTargets).forEach(target => target[s] = f)
  return s
}

export function addWithParams(targetOrTargets, f, {symbolName = f?.name}={}) {
  const buildTempMethod = function __methoIntermediate(...args) {
    const s = Symbol(symbolName)
    const targets = __methoIntermediate.targets
    targets.forEach(target => {
      Object.defineProperty(target, s, {
        configurable: true,
        get: function() {
          targets.forEach(target => { delete target[s] })
          return f.apply(this, args)
        }
      })
    })
    return s
  }
  buildTempMethod.targets = sanitiseTargets(targetOrTargets)
  return buildTempMethod
}

export function addSimple(targetOrTargets, f, {symbolName = f?.name}={}) {
  const s = Symbol(symbolName)
  sanitiseTargets(targetOrTargets).forEach(target => Object.defineProperty(target, s, { configurable:true, get: f}))
  return s
}

const sanitiseTargets = targets => Array.isArray(targets) ? targets : [targets]


// may well need the ability to add descriptions for these Symbols that are flying around
