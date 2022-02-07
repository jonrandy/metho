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
registered = Metho.registered("shared-params")

