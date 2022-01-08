export const data = Symbol('methoData')

// TODO - optionally store created symbols/funcs in a registry so we can check if something already defined (do we need this?)

export function add(targetOrTargets, f, outerSyntax=false){
  return f.length ?
    outerSyntax ?
      addProperty(targetOrTargets, f)
    :
      addWithParams(targetOrTargets, f)
  :
    addSimple(targetOrTargets, f)
}

export function addProperty(targetOrTargets, f) {
  const s = Symbol()
  sanitiseTargets(targetOrTargets).forEach(target => target[s] = f)
  return s
}

// TODO - make this accept multiple targets (maybe make a property of the returned function an array of targets - so it can be changed)
export function addWithParams(target, f) {
  return(function(...args) {
    const s = Symbol()
    Object.defineProperty(target, s, {
      configurable: true,
      get: function() {
        delete target[s]
        return f.apply(this, args)
      }
    })
    return s
  })
}

export function addSimple(targetOrTargets, f) {
  const s = Symbol()
  sanitiseTargets(targetOrTargets).forEach(target => Object.defineProperty(target, s, { configurable:true, get: f}))
  return s
}

const sanitiseTargets = targets => Array.isArray(targets) ? targets : [targets]


// may well need the ability to add descriptions for these Symbols that are flying around
