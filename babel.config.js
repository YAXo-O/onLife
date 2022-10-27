module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			"module-resolver",
			{
				root: ['.'],
				extension: [
					'.js',
					'.ts',
					'.jsx',
					'.tsx',
				],
				alias: {
					'@app': './src',
					'@assets': './assets',
				}
			}
		]
	]
};
