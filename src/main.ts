import { CalculationContext } from './calculationContext';

function main(){
	let ctx = new CalculationContext();

	ctx.start('./build/helloWorld.js', 4);
}

main();