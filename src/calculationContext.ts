import { EventEmitter } from 'events';
import { cpus } from 'os'

import { WorkerProcess, WorkerState } from './workerProcess';
import { Timer } from './timer';

export class CalculationContext {
	logicalCores: number;
	workers: WorkerProcess[] = [];
	timer: Timer;
	stateEmitter: EventEmitter;
	contextMemory: object = {};

	constructor(
		private onCalculationStartHandler?: (data) => void,
		private onCalculatonCompleteHandler?: (data) => void,
		private onCalculationErrorHandler?: (data) => void,
		private onWorkerStartHandler?: (data) => void,
		private onWorkerCompleteHandler?: (data) => void,
		private onWorkerErrorHandler?: (data) => void,
	) {
		this.init();
	}

	private init() {
		console.log('initialization of calculation context');

		this.timer = new Timer();
		this.stateEmitter = new EventEmitter();
		this.logicalCores = cpus().length;
		for (let i = 0; i < this.logicalCores*4; i++) {
			this.workers[i] = new WorkerProcess(this.stateEmitter, this.contextMemory, this.timer);
		}

		//this.stateEmitter.on('calcStart', this.onCalculationStartHandler);
		//this.stateEmitter.on('calcComplete', this.onCalculatonCompleteHandler);
		//this.stateEmitter.on('calcError', this.onCalculationErrorHandler);
		//this.stateEmitter.on('workerStart', this.onWorkerStartHandler);
		//this.stateEmitter.on('workerComplete', this.onWorkerCompleteHandler);
		//this.stateEmitter.on('workerError', this.onWorkerErrorHandler);

		this.stateEmitter.on(CalculationEvent.workerComplete, (data) => {
			let isCalculationReady = true;
			let result = 0;
			this.workers.forEach((element) => {
				if (element.state == WorkerState.working) {
					isCalculationReady = false;
				}
				if(element.state == WorkerState.finished){
					element.state = WorkerState.idle;
				}
			});

			if (isCalculationReady) {
				let result = 0;
				this.workers.forEach(element => {
					if(element.calculationResult){
						result += element.calculationResult;
						element.calculationResult = undefined;
					}
				})
				this.stateEmitter.emit(CalculationEvent.calculationComplete);
				console.log('Result: ' + result + ' Time: ' + this.timer.getTime() + 'ms');
			}

			if (this.onWorkerCompleteHandler) {
				this.onWorkerCompleteHandler(data);
			}
		})
	}

	start(modulePath: string, numProc: number) {
		this.timer.start();
		this.timer.pause();
		for (let i = 0; i < numProc; i++) {
			this.workers[i].start(modulePath, i);
		}
		this.timer.continue();
	}
}

export class CalculationEvent {
	static calculationStart: string = 'calcStart';
	static calculationComplete: string = 'calcComplete';
	static calculationError: string = 'calcError';
	static workerStart: string = 'workerStart';
	static workerComplete: string = 'workerComplete';
	static workerError: string = 'workerError';
}