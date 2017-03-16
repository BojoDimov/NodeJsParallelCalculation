import { EventEmitter } from 'events';
import { ChildProcess, fork } from 'child_process';

import { CalculationEvent } from './calculationContext'
import { Timer } from './timer'

export class WorkerProcess {
	state: WorkerState = WorkerState.idle;
	calculationResult: any;
	private _process: ChildProcess


	constructor(
		private contextEmitter: EventEmitter,
		private sharedMemory: object,
		private timer: Timer
	) { }

	start(modulePath: string, dataInput?: any) {
		this.state = WorkerState.working;
		this._process = fork(modulePath);
		this._process.send(dataInput);

		this._process.on('message', (data) => {
			//console.log('received finish message');
			//console.log(data);
			this.calculationResult = data ? data : undefined;
			this.state = WorkerState.finished;
			this._process.kill();
			this.contextEmitter.emit(CalculationEvent.workerComplete);
		});
	}
}

export const enum WorkerState {
	idle,
	working,
	finished
};


export function start(executable: (input?: any) => void) {
	process.on('message', (data) => {
		//console.log('process received data');
		//console.log(data);
		let result = executable(data);
		if (result) {
			process.send(result);
		} else {
			process.send(null);
		}
		//console.log('process ended - sending finish message');
	})
}
