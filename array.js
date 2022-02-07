import * as Metho from "./metho.js"

const target = Array.prototype
target[Metho.data] = 'array'

let registered


// no params
let noParams
registered = Metho.registered("shared-no-params")
function noParamsFunction() {
  return "Function with no params (array)"
}
if (registered) {
  console.log('(array) shared-no-params already registered, going to re-use symbol')
  noParams = Metho.add(target, noParamsFunction, {useSymbol: registered})
} else {
  console.log('(array) shared-no-params not registered, creating new symbol and registering')
  noParams = Metho.add(target, noParamsFunction, {register:true, symbolName: "shared-no-params"})
}

export { noParams }



// params
let multiParams
registered = Metho.registered("shared-params")
const paramsFunction = function(t) {
  return 'Multi target function with params - ' + this[Metho.data] + ' --- ' + t
}

if (registered) {
  console.log('(array) shared-params already registered, just going to add target')
  multiParams = registered
  multiParams.targets = [...new Set([...multiParams.targets, target])]
} else {
  console.log('(array) shared-params not registered, creating new symbol and registering')
  multiParams = Metho.add(target, paramsFunction, {register:true, symbolName: "shared-params"})
}

export { multiParams }
