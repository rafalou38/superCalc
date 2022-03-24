export type TokenType = 'operator' | 'number' | 'wrapper' | 'coma';

export class Token {
	static isToken(key: string) {
		// eslint-disable-next-line no-useless-escape
		if (key.match(/^[+\\\-*\/^()0-9\.,]$/)) {
			return true;
		}
	}

	type: TokenType;
	key: string;
	id: string;

	constructor(key: string) {
		if (!Token.isToken(key)) {
			throw new Error('Invalid token');
		}

		this.key = key;

		if (key === '+') {
			this.type = 'operator';
		} else if (key === '-') {
			this.type = 'operator';
		} else if (key === '*') {
			this.type = 'operator';
		} else if (key === '/') {
			this.type = 'operator';
		} else if (key === '(') {
			this.type = 'wrapper';
		} else if (key === ')') {
			this.type = 'wrapper';
		} else if (key.match(/^\d$/)) {
			this.type = 'number';
		} else if (key === ',') {
			this.type = 'coma';
			this.key = '.';
		} else if (key === '.') {
			this.type = 'coma';
		}

		this.id = Math.random().toString(36);
	}

	displayKey() {
		if (this.key === '*') {
			return '&times;';
		} else if (this.key === '/') {
			return '&divide;';
		} else {
			return this.key;
		}
	}

	color() {
		switch (this.type) {
			case 'operator':
				return '#f53d3d';
			case 'number':
				return '#3d3df5';
			case 'coma':
				return '#3d3df5';
			case 'wrapper':
				return '#333333';
		}
	}
}
