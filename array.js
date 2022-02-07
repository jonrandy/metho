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
registered = Metho.registered("shared-params")

