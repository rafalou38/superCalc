import { readable } from 'svelte/store';
import { Readable } from './ReadableClass';
import { Token } from './Token';

export class Operation extends Readable {
	public tokens: Token[];
	public active: boolean;
	cursor_position: number;
	selection: { start: number; end: number };

	constructor() {
		super();
		this.tokens = [];
		this.cursor_position = 0;
		this.selection = { start: 0, end: 0 };
		this.active = false;
	}

	setCursor(position: number): any {
		this.cursor_position = position;
		this.__dispatch();
	}
	setSelection(start: number, end: number): any {
		this.selection = {
			start,
			end
			// start: Math.min(start, end),
			// end: Math.max(start, end)
		};
		this.__dispatch();
	}

	handle_key(key: string, shift = false, ctrl = false): boolean {
		if (key == 'Backspace') {
			if (this.cursor_position > 0) {
				this.tokens.splice(this.cursor_position - 1, 1);
				this.cursor_position--;
				this.__dispatch();
				return true;
			}
		} else if (key == 'Delete') {
			if (this.cursor_position < this.tokens.length) {
				this.tokens.splice(this.cursor_position, 1);
				this.__dispatch();
				return true;
			}
		} else if (key == 'ArrowLeft') {
			this.cursor_position =
				(this.cursor_position + this.tokens.length - 1 + 1) % (this.tokens.length + 1);
			if (shift) this.setSelection(this.cursor_position, this.cursor_position);
			else this.selection = { start: 0, end: 0 };
			this.__dispatch();
			return true;
		} else if (key == 'ArrowRight') {
			this.cursor_position =
				(this.cursor_position + this.tokens.length + 1 + 1) % (this.tokens.length + 1);
			this.selection = { start: 0, end: 0 };
			this.__dispatch();
			return true;
		} else if (Token.isToken(key)) {
			this.tokens.splice(this.cursor_position, 0, new Token(key));
			this.cursor_position++;
			this.__dispatch();
			return true;
		}

		return false;
	}

	calculate(): number {
		return NaN;
	}
	setFocus(focused: boolean): any {
		console.log('setFocus', focused);

		this.active = focused;

		this.__dispatch();
	}
}

export const e = readable();
