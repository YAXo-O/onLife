import * as React from 'react';
import {
	View,
	TextInput,
	StyleSheet,
	KeyboardTypeOptions,
	NativeSyntheticEvent,
	TextInputFocusEventData, TextInputProps,
} from 'react-native';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

export enum WavyFormRowType {
	Left = 0,
	Right = 1,
}

interface InputIconProps {
	icon: React.ReactNode;
	visible: boolean;
}

interface WavyFormRowProps {
	type: WavyFormRowType;
	icon?: React.ReactNode;

	leading?: boolean;
	trailing?: boolean;

	value: string;
	placeholder?: string;

	onChange: (value: string) => void;
	onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;

	keyboardType?: KeyboardTypeOptions;
	textContentType?: TextInputProps['textContentType'];
	secureTextEntry?: boolean;

	error?: string;
}

const InputIcon: React.FC<InputIconProps> = (props: InputIconProps) => {
	if (!props.visible) return null;

	return (
		<View style={styles.iconContainer}>
			{props.icon}
		</View>
	);
};

function getStyles(props: WavyFormRowProps, type: WavyFormRowType) {
	const result = [];

	if (props.type !== type) {
		result.push(type === WavyFormRowType.Left ? styles.prefix : styles.suffix);
	} else {
		result.push(styles.dummy);
		if (props.leading) result.push(styles.leading);
		if (props.trailing) result.push(styles.trailing);
	}

	return result;
}

export const WavyFormRow: React.FC<WavyFormRowProps> = (props: WavyFormRowProps) => {
	return (
		<View style={[styles.row, !props.leading && styles.overlap]}>
			<View style={getStyles(props, WavyFormRowType.Left)}>
				<InputIcon visible={props.type === WavyFormRowType.Right} icon={props.icon} />
			</View>
			<View style={styles.content}>
				<TextInput
					value={props.value}
					onChangeText={props.onChange}
					placeholder={props.placeholder}
					placeholderTextColor={props.error ? palette.light.red : palette.white['70']}
					style={[typography.input, styles.input, props.error ? styles.error : null]}
					keyboardType={props.keyboardType}
					textContentType={props.textContentType}
					secureTextEntry={props.secureTextEntry}
				/>
			</View>
			<View style={getStyles(props, WavyFormRowType.Right)}>
				<InputIcon visible={props.type === WavyFormRowType.Left} icon={props.icon} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		width: '100%',
		flexDirection: 'row',
	},
	overlap: { marginTop: -3, },
	dummy: {
		width: 83,
	},
	leading: {
		borderTopWidth: 3,
		borderColor: palette.white['70'],
		borderStyle: 'solid',
	},
	trailing: {
		borderBottomWidth: 3,
		borderColor: palette.white['70'],
		borderStyle: 'solid',
	},
	prefix: {
		borderWidth: 3,
		borderRightWidth: 0,
		borderColor: palette.white['70'],
		borderStyle: 'solid',
		borderTopLeftRadius: 45,
		borderBottomLeftRadius: 45,
		marginLeft: 30,
		padding: 5,
	},
	content: {
		borderTopWidth: 3,
		borderBottomWidth: 3,
		borderColor: palette.white['70'],
		borderStyle: 'solid',
		flex: 1,
		paddingLeft: 7,
	},
	suffix: {
		borderWidth: 3,
		borderLeftWidth: 0,
		borderColor: palette.white['70'],
		borderStyle: 'solid',
		borderTopRightRadius: 45,
		borderBottomRightRadius: 45,
		marginRight: 30,
		padding: 5,
	},
	input: {
		paddingHorizontal: 0,
		color: palette.white['90'],
	},
	error: {
		color: palette.light.red,
	},
	iconContainer: {
		width: 40,
		height: 40,
		backgroundColor: palette.cyan['40'],
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionContainer: {
		marginHorizontal: 30,
		marginBottom: 75,
	},
	action: {
		backgroundColor: palette.cyan['40'],
		borderRadius: 10,
		padding: 12,
	},
	actionText: {
		textAlign: 'center',
		color: palette.white['100'],
	},
});
