import * as Metho from "./metho.js"

const target = String.prototype
target[Metho.data] = 'string'


let registered

// no params
let noParams
registered = Metho.registered("shared-no-params")
function noParamsFunction() {
  return "Function with no params (string)"
}
if (registered) {
  console.log('(string) shared-no-params already registered, going to re-use symbol')
  noParams = Metho.add(target, noParamsFunction, {useSymbol: registered})
} else {
  console.log('(string) shared-no-params not registered, creating new symbol and registering')
  noParams = Metho.add(target, noParamsFunction, {symbolName:"shared-no-params", register: true})
}

export { noParams }



// params
let multiParams
registered = Metho.registered("shared-params")
const paramsFunction = function(t) {
  return 'Multi target function with params - ' + this[Metho.data] + ' --- ' + t
}

if (registered) {
  console.log('(string) shared-params already registered, just going to add target')
  multiParams = registered
  multiParams.targets = [...new Set([...multiParams.targets, target])]
} else {
  console.log('(string) shared-params not registered, creating new symbol and registering')
  multiParams = Metho.add(target, paramsFunction, {register:true, symbolName: "shared-params"})
}

export { multiParams }
