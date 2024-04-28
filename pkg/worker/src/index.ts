import { CalculationContext, GlobalParams } from './calculationContext';
import { Timer } from './timer';

function main() {
	let ctx = new CalculationContext();

	let calculationEmitter = ctx.exec(HelloWorld, 4, 1, 'neshto');

	calculationEmitter.on('calcComplete', (data) => {
		console.log(data)
	});
}

function HelloWorld(global: GlobalParams, param1: number, param2: string) {
	console.log("Hello World from worker: " + global.workerId + ' param1=' + param1 + ' param2=' + param2);
}


main();