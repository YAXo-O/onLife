import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

import { typography } from '@app/styles/typography';
import { palette } from '@app/styles/palette';

interface OwnProps {
	text: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	type?: ActionType;
}

export enum ActionType {
	Primary = 0,
	Secondary = 1,
}

function getStyle(type?: ActionType): StyleProp<ViewStyle> {
	if (type === undefined || type === ActionType.Primary) return styles.actionPrimary;

	return styles.actionSecondary;
}

function getTextStyle(type?: ActionType): StyleProp<TextStyle> {
	if (type === undefined || type === ActionType.Primary) return styles.actionTextPrimary;

	return styles.actionTextSecondary;
}

export const ActionButton: React.FC<OwnProps> = (props: OwnProps) => {
	const [touching, setTouching] = React.useState(() => false);

	return (
		<TouchableOpacity
			style={[styles.action, touching ? styles.actionPressed : getStyle(props.type), props.style]}
			onPress={props.onPress}
			onPressIn={() => setTouching(true)}
			onPressOut={() => setTouching(false)}
		>
			<Text style={[styles.actionText, touching ? undefined : getTextStyle(props.type), typography.action]}>
				{props.text}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	action: {
		borderRadius: 10,
		padding: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionPrimary: {
		backgroundColor: palette.cyan['40'],
	},
	actionSecondary: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: palette.cyan['40'],
	},
	actionPressed: {
		backgroundColor: palette.cyan['20'],
	},
	actionText: {
		color: palette.white['100'],
		textAlign: 'center',
	},
	actionTextPrimary: {
		color: palette.white['100'],
	},
	actionTextSecondary: {
		color: palette.cyan['40'],
	},
});
