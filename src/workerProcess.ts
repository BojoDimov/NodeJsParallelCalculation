import { EventEmitter } from 'events';
import { ChildProcess, fork } from 'child_process';

import { CalculationEvent } from './calculationContext'
import { Timer } from './timer'

export class WorkerProcess {
	state: WorkerState = WorkerState.idle;
	calculationResult: any;
	private _underlyingProcess: ChildProcess


	constructor(
		private contextEmitter: EventEmitter,
		private sharedMemory: object, 
		private timer: Timer
	) {
		this.contextEmitter.emit('worker init');
	}

	start(modulePath: string, id: number) {
		let step = 2000000000;
		this._underlyingProcess = fork(modulePath, [id.toString(), (id*step + 1).toString(), ((id+1)*step).toString()]);
		this.state = WorkerState.working;
		this._underlyingProcess.on('message', (data) => {
			//console.log('worker ' + id + ' caught complete signal from uderlying process');
			this.calculationResult = data;
			this.state = WorkerState.finished;
			this.contextEmitter.emit(CalculationEvent.workerComplete);
		});
	}
}

export const enum WorkerState {
	idle,
	working,
	finished
};