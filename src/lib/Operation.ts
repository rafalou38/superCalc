import { readable } from 'svelte/store';
import { Readable } from './ReadableClass';
import { Token } from './Token';

type RGroups = (Token | RGroups)[];
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

	setCursor(position: number, select = false): any {
		this._setCursor(position);
		if (!select) this.selection = { start: position, end: position };
		this.__dispatch();
	}
	private _setCursor(position: number): any {
		this.cursor_position = position;
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
			if (this.selection.start != this.selection.end) {
				const min = Math.min(this.selection.end, this.selection.start);
				const max = Math.max(this.selection.end, this.selection.start);
				this.tokens.splice(min, max - min);
				console.log(min, max, max - min);

				this.cursor_position = min;
			} else if (this.cursor_position > 0) {
				this.tokens.splice(this.cursor_position - 1, 1);
				this.cursor_position--;
			}
		} else if (key == 'Delete') {
			if (this.selection.start != this.selection.end) {
				const min = Math.min(this.selection.end, this.selection.start);
				const max = Math.max(this.selection.end, this.selection.start);
				this.tokens.splice(min, max - min);
				console.log(min, max, max - min);

				this.cursor_position = min;
			} else if (this.cursor_position > 0) {
				this.tokens.splice(this.cursor_position, 1);
			}
		} else if (key == 'ArrowLeft') {
			if (ctrl) {
				findNext: {
					const startToken = this.tokens[this.cursor_position - 1];
					for (let i = this.cursor_position - 1; i > 0; i--) {
						const token = this.tokens[i];
						if (token.type != startToken.type) {
							this._setCursor(i + 1);
							break findNext;
						}
					}
					this._setCursor(0);
				}
			} else {
				this._setCursor(
					(this.cursor_position + this.tokens.length - 1 + 1) % (this.tokens.length + 1)
				);
			}
		} else if (key == 'Home') {
			this._setCursor(0);
		} else if (key == 'End') {
			this._setCursor(this.tokens.length);
		} else if (key == 'ArrowRight') {
			if (ctrl) {
				findNext: {
					const startToken = this.tokens[this.cursor_position];
					for (let i = this.cursor_position; i < this.tokens.length; i++) {
						const token = this.tokens[i];
						if (token.type != startToken.type) {
							this._setCursor(i);
							break findNext;
						}
					}
					this._setCursor(this.tokens.length);
				}
			} else {
				this._setCursor(
					(this.cursor_position + this.tokens.length + 1 + 1) % (this.tokens.length + 1)
				);
			}
		} else if (Token.isToken(key)) {
			this.tokens.splice(this.cursor_position, 0, new Token(key));
			this._setCursor(this.cursor_position + 1);
		} else {
			console.log('invalid key', key);
			return false;
		}

		if (shift) {
			this.setSelection(this.selection.start, this.cursor_position);
			console.log(this.selection.start, this.cursor_position);
		} else {
			this.selection = { start: this.cursor_position, end: this.cursor_position };
		}

		this.__dispatch();
		return true;
	}

	private isGroupNum(group: RGroups | null): group is Token[] {
		if (group == null || !Array.isArray(group)) return false;
		return !group.find((token) => (token as Token).type != 'number');
	}
	private getGroupAtDepth(groups: RGroups, depth: number) {
		let lastGroup = groups;
		for (let i = 0; i < depth; i++) {
			if (!Array.isArray(lastGroup.at(-1)))
				throw {
					depth,
					last: lastGroup.at(-1),
					groups
				};
			lastGroup = lastGroup.at(-1) as RGroups;
		}
		return lastGroup;
	}

	calculate(): number {
		const groups: RGroups = [];
		let groupDepth = 0;
		for (const token of this.tokens) {
			const group = this.getGroupAtDepth(groups, groupDepth);
			console.log(groups);
			if (token.type === 'operator') {
				if (!Array.isArray(group)) throw { group, token, groups };
				group.push(token);
			} else if (token.type === 'number') {
				if (!this.isGroupNum(group.at(-1) as RGroups)) {
					group.push([]);
				}
				(group.at(-1) as RGroups).push(token);
			} else if (token.type === 'wrapper') {
				if (token.key == '(') {
					groupDepth++;
					group.push([]);
				} else {
					groupDepth--;
				}
			}
		}

		return NaN;
	}

	setFocus(focused: boolean): any {
		console.log('setFocus', focused);

		this.active = focused;

		this.__dispatch();
	}
}

export const e = readable();
