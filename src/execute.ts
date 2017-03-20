process.on('message', (context) => {

	let func = new Function('return ' + context.functionString)();
	
	let result = func({workerId: context.workerId});
	if (result != null && result != undefined) {
			process.send(result);
		} else {
			process.send(null);
		}
});