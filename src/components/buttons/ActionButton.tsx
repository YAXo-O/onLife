import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';

import { typography } from '@app/styles/typography';
import { palette } from '@app/styles/palette';

interface OwnProps {
	text?: string;
	children?: React.ReactNode;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	type?: ActionType;
	disabled?: boolean;
}

export enum ActionType {
	Primary = 0,
	Secondary = 1,
}

function getStyle(type: ActionType | undefined, touching: boolean, disabled: boolean | undefined): StyleProp<ViewStyle> {
	if (disabled) return styles.actionDisabled;
	if (touching) return styles.actionPressed;
	if (type === undefined || type === ActionType.Primary) return styles.actionPrimary;

	return styles.actionSecondary;
}

function getTextStyle(type?: ActionType): StyleProp<TextStyle> {
	if (type === undefined || type === ActionType.Primary) return styles.actionTextPrimary;

	return styles.actionTextSecondary;
}

export const ActionButton: React.FC<OwnProps> = (props: OwnProps) => {
	const [touching, setTouching] = React.useState(() => false);
	const onPress = () => {
		if (props.disabled) return;

		props.onPress();
	};

	return (
		<TouchableOpacity
			style={[
				styles.action,
				getStyle(props.type, touching, props.disabled),
				props.style,
			]}
			onPress={onPress}
			onPressIn={() => setTouching(true)}
			onPressOut={() => setTouching(false)}
		>
			{props.children ?? null}
			{
				props.text ? (
					<Text
						style={[
							styles.actionText,
							touching ? undefined : getTextStyle(props.type),
							typography.action
						]}
					>
						{props.text}
					</Text>
				) : null
			}
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
	actionDisabled: {
		backgroundColor: palette.blue['50'],
	},
});
