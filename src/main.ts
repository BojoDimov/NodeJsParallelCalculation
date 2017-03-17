import { CalculationContext } from './calculationContext';
import { Timer } from './timer';

function main(){
	let ctx = new CalculationContext();

	let emitter = ctx.start('./build/helloWorld.js', 8, (id:number) => { return { id: id }});

	emitter.on('calcComplete', (data) => {
		console.log(data)
	});
}

main();
//at about 200000000 operations per process the overhead of creating 
//4 process is equal to calculating 4*200000000 in one process

//old technique
//1999999998016779000 after 25665ms single thread
//1999999998067114000 after 2009ms sigle thread


//new technique
//1999999998067114000 after 1892ms single thread sum of 2000000000
//Result: 7999999992268456000 Time: 1947ms  4 thread 4*sum(2000000000)
//Result: 7999999992067116000 Time: 20464ms 1 thread 4*sum(2000000000)
//Result: 31999999992068380000 Time: 10675ms 1 thread sum(8000000000)
//Result: 7999999992268456000 Time: 2030ms 4 thread each the same numbers
//Result: 32000000000071897000 Time: 2989ms 4 thread different portions
//Result: 32000000000068380000 Time: 10656ms 1 thread (i dont know why the sums are different)


//sum of 2 000
//Result: 32004000 Time: 192ms sum of 8 000 4 thread
//Result: 32004000 Time: 124ms sum of 8 000 1 thread

//sum of 20 000
//Result: 3200040000 Time: 160ms sum of 80 000 4 thread
//Result: 3200040000 Time: 125ms sum of 80 000 1 thread

//sum of 200 000
//Result: 320000400000 Time: 161ms sum of 800 000 4 thread
//Result: 320000400000 Time: 126ms sum of 800 000 1 thread

//sum of 2 000 000
//Result: 32000004000000 Time: 204ms sum of 8 000 000 4 thread
//Result: 32000004000000 Time: 133ms sum of 8 000 000 1 thread

//sum of 20 000 000
//Result: 3200000040000000 Time: 226ms sum of 80 000 000 4 thread
//Result: 3200000040000000 Time: 210ms sum of 80 000 000 1 thread

//sum of 200 000 000(there is difference in the result due to int overflow i think)
//also single thread is slower because now operations are operations on strings and we can see the difference(i think)
//Result: 320000000105912960 Time: 380ms sum of 800 000 000 4 thread
//Result: 320000000067109000 Time: 959ms sum of 800 000 000 1 thread

//sum of 2 000 000 000(there is difference in the result due to int overflow i think)
//also single thread is slower because now operations are operations on strings and we can see the difference(i think)
//Result: 32000000000071897000 Time: 2965ms sum of 	8 000 000 000 4 thread
//Result: 32000000000068380000 Time: 10661ms sum of 8 000 000 000 1 thread

//actual sum is 31999999996000000000
//1999000 sum 1 to 2000