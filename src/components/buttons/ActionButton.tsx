import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';

import { typography } from '@app/styles/typography';
import { palette } from '@app/styles/palette';

interface OwnProps {
	text: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
}

export const ActionButton: React.FC<OwnProps> = (props: OwnProps) => {
	const [touching, setTouching] = React.useState(() => false);

	return (
		<TouchableOpacity
			style={[styles.action, touching && styles.actionPressed, props.style]}
			onPress={props.onPress}
			onPressIn={() => setTouching(true)}
			onPressOut={() => setTouching(false)}
		>
			<Text style={[styles.actionText, typography.action]}>
				{props.text}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	action: {
		backgroundColor: palette.cyan['40'],
		borderRadius: 10,
		padding: 12,
	},
	actionPressed: {
		backgroundColor: palette.cyan['20'],
	},
	actionText: {
		textAlign: 'center',
		color: palette.white['100'],
	},
});
