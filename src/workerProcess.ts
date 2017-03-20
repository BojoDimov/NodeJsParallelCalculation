import { EventEmitter } from 'events';
import { ChildProcess, fork } from 'child_process';

import { CalculationEvent } from './calculationContext'

export class WorkerProcess {
	state: WorkerState = WorkerState.idle;
	lastCalculationResult: any;


	constructor(private calculationStateEmitter: EventEmitter) { }

	start(modulePath: string, dataInput?: any) {
		this.state = WorkerState.working;
		let _process = fork(modulePath);

		_process.send(dataInput);

		_process.on('message', (result) => {
			this.state = WorkerState.finished;
			this.lastCalculationResult = result;
			_process.kill();
			this.calculationStateEmitter.emit(CalculationEvent.workerComplete);
		});
	}
}

export const enum WorkerState {
	idle,
	working,
	finished
};


// export function start(executable: (input?: any) => void) {
// 	process.on('message', (data) => {
// 		let result = executable(data);
// 		if (result != null && result != undefined) {
// 			process.send(result);
// 		} else {
// 			process.send(null);
// 		}
// 	})
// }
