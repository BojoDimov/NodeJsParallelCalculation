import { InternalParams } from './calculationContext';
import { Timer } from './timer';

process.on('message', (params: InternalParams) => handleFunctionExecution(params));

function handleFunctionExecution(params:InternalParams){
	let f = new Function('return ' + params.function)();
	let timer = new Timer().start();
	let result = f.apply(null, params.arguments);
	console.log('Execution from worker ' + params.arguments[0].workerId + ' took ' + timer.getTime() + 'ms');

	if (result != null && result != undefined) {
		process.send(result);
	} else {
		process.send(null);
	}
}