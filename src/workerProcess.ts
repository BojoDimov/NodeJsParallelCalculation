import { EventEmitter } from 'events';

export class WorkerProcess{
	constructor(private contextEmitter: EventEmitter, private sharedMemory: object) {
		this.contextEmitter.emit('workerStart');
	 }
}