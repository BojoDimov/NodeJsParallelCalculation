import { CalculationContext } from './calculationContext';
import { Timer } from './timer';

function main(){
	let ctx = new CalculationContext();

	//let emitter = ctx.start('./build/helloWorld.js', 8, (id:number) => { return { id: id }});

	let calculationEmitter = ctx.exec(HelloWorld, 8);

	calculationEmitter.on('calcComplete', (data) => {
		console.log(data)
	});
}

function HelloWorld(global: GlobalParams){
	console.log("Hello World from worker: " + global.workerId);
}


class GlobalParams{
	workerId: number;
}

main();