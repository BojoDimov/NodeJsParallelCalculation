import { start } from './workerProcess';

start(myFn);

function myFn(input:any){
	console.log('Greetings from process ' + input.id);
}
