module.exports = {
	root: true,
	extends: ['@react-native-community', 'plugin:import/errors'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/no-shadow': ['error'],
				'no-shadow': 'off',
				'no-undef': 'off',
			},
		},
	],
	settings: {
		'import/resolver': {
			'alias': {
				'extensions': ['.ts', '.tsx'],
				'map': [
					['@app', './src'],
					['@assets', './assets'],
				]
			}
		}
	}
};
