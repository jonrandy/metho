export const data = Symbol('methoData')

const registry = {}

export function add(targetOrTargets, f, {outerSyntax=false, symbolName=f?.name, register=false}={}){
  return f.length ?
    outerSyntax ?
      addProperty(targetOrTargets, f, {symbolName, register})
    :
      addWithParams(targetOrTargets, f, {symbolName, register})
  :
    addSimple(targetOrTargets, f, {symbolName, register})
}

export function addProperty(targetOrTargets, f, {symbolName = f?.name, register=false}={}) {
  const s = Symbol(symbolName)
  sanitiseTargets(targetOrTargets).forEach(target => target[s] = f)
  register && addToRegister(symbolName, s)
  return s
}

export function addWithParams(targetOrTargets, f, {symbolName = f?.name, register=false}={}) {
  const methodName = symbolName || '__methoIntermediate'
  const buildTempMethod = {
    [methodName]: function (...args) {
      const s = Symbol(symbolName)
      const targets = buildTempMethod[methodName].targets
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
  }
  buildTempMethod[methodName].targets = sanitiseTargets(targetOrTargets)
  register && addToRegister(symbolName, buildTempMethod[methodName])
  return buildTempMethod[methodName]
}

export function addSimple(targetOrTargets, f, {symbolName = f?.name, register=false}={}) {
  const s = Symbol(symbolName)
  sanitiseTargets(targetOrTargets).forEach(target => Object.defineProperty(target, s, { configurable:true, get: f}))
  register && addToRegister(symbolName, s)
  return s
}

const sanitiseTargets = targets => Array.isArray(targets) ? targets : [targets]

const addToRegister = (name, item) => registry[name] = item

