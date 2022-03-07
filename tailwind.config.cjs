const forms = require('@tailwindcss/forms');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				mono: ['Space Mono', 'monospace']
			}
		}
	},

	plugins: [forms]
};

module.exports = config;
