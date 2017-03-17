import { start } from './workerProcess';

start(myFn);

function myFn(input: any) {
	let sum = 0;
	let id = input.id;
	for (let i = 0; i < id * 2000; i++) {
		sum += i;
	}
	return sum;
}
