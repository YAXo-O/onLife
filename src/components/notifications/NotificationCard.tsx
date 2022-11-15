import * as React from 'react';
import { StyleSheet, View, Modal, Text } from 'react-native';

import { Nullable } from '@app/objects/utility/Nullable';
import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

interface OwnProps {
	text?: Nullable<string>;
}

export const NotificationCard: React.FC<OwnProps> = (props: OwnProps) => {
	if (!props.text) return null;

	return (
		<Modal
			visible={Boolean(props.text)}
			animationType="slide"
			transparent
		>
			<View style={styles.container}>
				<View style={styles.card}>
					<Text style={[styles.text, typography.notification]}>Учетная запись успешно удалена</Text>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
	card: {
		backgroundColor: palette.white['100'],
		borderRadius: 20,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: palette.cyan['40'],
		height: 300,
	},
});
