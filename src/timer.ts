export class Timer {
	private startTime: number = undefined;
	private pauseStart: number = undefined;
	private totalPausetime: number = 0;

	public start():Timer {
		// if (this.startTime) {
		// 	throw 'Timer is started';
		// }

		this.startTime = new Date().getTime();
		return this;
	}

	public pause(): number {
		if (this.pauseStart) {
			throw 'Timer is already paused';
		}

		if (!this.startTime) {
			throw 'Timer is not started';
		}

		this.pauseStart = new Date().getTime();
		return new Date().getTime() - this.startTime - this.totalPausetime;
	}

	public continue(): number {
		if (!this.pauseStart) {
			throw 'Timer is not paused';
		}

		if (!this.startTime) {
			throw 'Timer is not started';
		}

		let currentPauseTime = new Date().getTime() - this.pauseStart;
		this.totalPausetime += currentPauseTime;
		this.pauseStart = undefined;

		return currentPauseTime;
	}

	public getTime(): number {
		if (this.pauseStart) {
			this.continue();
			this.pause();
		}

		return new Date().getTime() - this.totalPausetime - this.startTime;
	}
}