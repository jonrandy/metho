export const data = Symbol("methoData")

const registry = {}

export function add(
	targetOrTargets,
	f,
	{
		outerSyntax = false,
		symbolName = f?.name,
		register = false,
		useSymbol = false,
	} = {}
) {
	return f.length
		? outerSyntax
			? addProperty(targetOrTargets, f, { symbolName, register, useSymbol })
			: addWithParams(targetOrTargets, f, { symbolName, register })
		: addSimple(targetOrTargets, f, { symbolName, register, useSymbol })
}

export function addProperty(
	targetOrTargets,
	f,
	{ symbolName = f?.name, register = false, useSymbol = false } = {}
) {
	const s = useSymbol || Symbol(symbolName)
	sanitiseTargets(targetOrTargets).forEach(target => (target[s] = f))
	register && addToRegister(symbolName, s)
	return s
}

export function addWithParams(
	targetOrTargets,
	f,
	{ symbolName = f?.name, register = false } = {}
) {
	const methodName = symbolName || "__methoIntermediate"
	const buildTempMethod = {
		[methodName]: function (...args) {
			const s = Symbol(symbolName)
			const targets = buildTempMethod[methodName].targets
			targets.forEach(target => {
				Object.defineProperty(target, s, {
					configurable: true,
					get: function () {
						targets.forEach(target => {
							delete target[s]
						})
						return f.apply(this, args)
					},
				})
			})
			return s
		},
	}
	buildTempMethod[methodName].targets = sanitiseTargets(targetOrTargets)
	register && addToRegister(symbolName, buildTempMethod[methodName])
	return buildTempMethod[methodName]
}

export function addSimple(
	targetOrTargets,
	f,
	{ symbolName = f?.name, register = false, useSymbol = false } = {}
) {
	const s = useSymbol || Symbol(symbolName)
	sanitiseTargets(targetOrTargets).forEach(target =>
		Object.defineProperty(target, s, { configurable: true, get: f })
	)
	register && addToRegister(symbolName, s)
	return s
}

export const getRegistered = name => registry[name]

const sanitiseTargets = targets => (Array.isArray(targets) && targets.prototype) ? targets : [targets]
const addToRegister = (name, item) => (registry[name] = item)

export function addWithSharedSymbolName(target, func, symbolName) {
	const isRegistered = getRegistered(symbolName)
	let ret
	if (isRegistered) {
		if (!func.length) {
			// if already registerd and no params, re-use symbol
			ret = add(target, func, { useSymbol: isRegistered })
		} else {
			// else if already registered and has params, don't overwrite function, just update targets (function will have to deal with both targets)
			ret = isRegistered
			ret.targets = [...new Set([...ret.targets, target])]
		}
	} else {
		// if not registered, create a new Symbol and register it
		ret = add(target, func, { register: true, symbolName })
	}
	return ret
}

// TODO - see below for stuff necessary for upcoming method 'name' sharing between metho-string and metho-array,
// whilst retaining ability for each module to be use separately without polluting the other's target prototype

// Pseudo code for adding a shared metho method (might already be registered elsewhere)

// * check for existence or registered symbol/function already being used
// * if we're adding a metho with params, the existing function should already cope with
//   the new target (maybe using this[Metho.data]), so simply change the registered
//   function's targets to include new one
// * otherwise, attach use Metho.add appropriately, including {useSymbol:registeredSymbol} in options
