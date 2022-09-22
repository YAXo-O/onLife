import { StyleSheet } from 'react-native';

export const formTypography = StyleSheet.create({
	label: {
		fontFamily: 'AlegreyaSans-Regular',
		fontSize: 14,
		lineHeight: 18,
	},
	input: {
		fontFamily: 'AlegreyaSans-Light',
		fontSize: 14,
		lineHeight: 16,
		color: 'rgba(255, 255, 255, 0.6)',
		textAlignVertical: 'center',
		textAlign: 'left',
	},
	action: {
		fontFamily: 'AlegreyaSans-Light',
		fontSize: 14,
		lineHeight: 16,
	},
	text: {
		fontFamily: 'AlegreyaSans-Light',
	},
});

export const formStyles = StyleSheet.create({
	background: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	screen: {
		flex: 1,
		justifyContent: 'center',
	},
	container: {
		padding: 16,
	},
	row: {
		marginVertical: 4,
	},
	rowHorizontal: {
		flexDirection: 'row',
		marginHorizontal: -4,
	},
	column: {
		flex: 1,
		paddingHorizontal: 4,
	},
	label: {
		color: 'rgba(255, 255, 255, 0.6)',
	},
	action: {
		color: 'rgba(193, 222, 245, 0.9)',
	},
	input: {
		backgroundColor: 'rgba(200, 200, 200, 0.2)',
		borderStyle: 'solid',
		borderColor: 'rgba(255, 255, 255, 0.5)',
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 6,
		paddingVertical: 2,
		height: 32,
	},
	inputText: {
		color: 'rgba(255, 255, 255, 0.6)',
	},
	btnRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	btn: {
		padding: 2,
	},
});
