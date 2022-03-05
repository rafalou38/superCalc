export class Readable {
	subscribers: ((value: this) => void)[];

	constructor() {
		this.subscribers = [];
	}

	subscribe(run: (value: this) => void): () => void {
		console.log('subscribed');
		this.subscribers.push(run);
		run(this);
		return () => {
			const index = this.subscribers.indexOf(run);
			if (index >= 0) {
				this.subscribers.splice(index, 1);
			}
		};
	}
	__dispatch() {
		this.subscribers.forEach((run) => run(this));
	}
}
