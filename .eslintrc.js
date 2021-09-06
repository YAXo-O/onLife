module.exports = {
	root: true,
	extends: '@react-native-community',

	rules: {
		indent: ['error', 'tab'], // Force tabs for idents
		'no-tabs': 'off', // Allow using tabs
		'max-len': ['error', { code: 150, tabWidth: 4 }],
		'space-before-function-paren': ['error', 'never'],
		'prettier/prettier': 0,
		'nonblock-statement-body-position': ['error', 'beside'],
		'curly': ['error', 'multi-line'],
	},

	parserOptions: {
		ecmaVersion: 2018,
		ecmaFeatures: {
			jsx: true,
		},
	},
};
