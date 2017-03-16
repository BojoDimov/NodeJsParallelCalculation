const id = parseInt(process.argv[2]);
const from = parseInt(process.argv[3]);
const to = parseInt(process.argv[4]);

console.log(id + ':Calculating sum from ' + from + ' to ' + to);
var sum = 0;
for(var i = from; i <= to; i++){
	sum+=i;
}
process.send(sum);