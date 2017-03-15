import { EventEmitter } from "events";

import { WorkerProcess } from './workerProcess';
import { Timer } from './timer';

export class CalculationContext{
	logicalCores: number;
	workers: WorkerProcess[];
	timer: Timer;
	stateEmitter: EventEmitter;
	contextMemory: object;

	constructor(
		private onCalculationStartHandler?: (data) => void, 
		private onCalculatonCompleteHandler?: (data) => void,
		private onCalculationErrorHandler?: (data) => void,
		private onWorkerStartHandler?: (data) => void, 
		private onWorkerCompleteHandler?: (data) => void,
		private onWorkerErrorHandler?: (data) => void,
	){
		this.init();
	}

	private init(){
		this.timer.start();
		console.log('initialization of calculation context');

		this.stateEmitter.on('calcStart', this.onCalculationStartHandler);
		this.stateEmitter.on('calcComplete', this.onCalculatonCompleteHandler);
		this.stateEmitter.on('calcError', this.onCalculationErrorHandler);
		this.stateEmitter.on('workerStart', this.onWorkerStartHandler);
		this.stateEmitter.on('workerComplete', this.onWorkerCompleteHandler);
		this.stateEmitter.on('workerError', this.onWorkerErrorHandler);

		for(let i = 0 ; i < this.logicalCores ; i++){
			this.workers[i] = new WorkerProcess(this.stateEmitter, this.contextMemory);
		}
	}
}

export const enum CalculationEvent{
	calculationStart,
	calculationEnd,
	calculationError,
	workerStart,
	workerEnd,
	workerError
}