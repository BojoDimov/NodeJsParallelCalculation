import { EventEmitter } from 'events';

import { WorkerProcess, WorkerState } from './workerProcess';
import { Timer } from './timer';

export class CalculationContext {
	workers: WorkerProcess[] = [];
	timer: Timer;
	stateEmitter: EventEmitter;

	constructor() {
		this.init();
	}

	private init() {
		console.log('initialization of calculation context');

		this.timer = new Timer();
		this.stateEmitter = new EventEmitter();

		this.stateEmitter.on(CalculationEvent.workerComplete, () => this.workerCompleteHandler());
	}

	private workerCompleteHandler() {
		let calculationReady = true;

		this.workers.forEach((worker) => {
			if (worker.state == WorkerState.working) {
				calculationReady = false;
			}
		});

		if (calculationReady) {
			let results = [];
			this.workers.forEach((worker, index) => {
				if (worker.state == WorkerState.finished) {
					worker.state = WorkerState.idle;
					results[index] = worker.lastCalculationResult;
				}
			});

			this.stateEmitter.emit(CalculationEvent.calculationComplete, results);
			console.log('Time: ' + this.timer.getTime() + 'ms');
			this.timer.pause();
		}
	}

	start(modulePath: string, numProc: number, dataGenerator?: (id?: number, input?: any) => void, input?: any): ListenerOnlyEventEmitter {
		this.timer.start();

		//create and call the workers
		if (dataGenerator) {
			for (let i = 0; i < numProc; i++) {
				this.timer.pause();
				this.workers[i] = new WorkerProcess(this.stateEmitter);
				this.workers[i].start(modulePath, dataGenerator(i, input));
				this.timer.continue();
			}
		} else {
			for (let i = 0; i < numProc; i++) {
				this.timer.pause();
				this.workers[i] = new WorkerProcess(this.stateEmitter);
				this.workers[i].start(modulePath);
				this.timer.continue();
			}
		}

		return new ListenerOnlyEventEmitter(this.stateEmitter);
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

export class ListenerOnlyEventEmitter{
	constructor(private emitter: EventEmitter){ }

	on(event: 'calcComplete', calculationCompleteHandler: (data: any) => void){
		this.emitter.on(CalculationEvent.calculationComplete, (data) => calculationCompleteHandler(data));
	}
}