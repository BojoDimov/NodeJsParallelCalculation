const id = parseInt(process.argv[2]);

console.log('Hello world from worker ' + id);
var sum = 0;
for(var i = 0 ; i < 200000; i++){
	sum+=i;
}

process.send(sum);