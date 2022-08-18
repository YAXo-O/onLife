import * as React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

interface OwnProps {
	loading: boolean;
}

export const Spinner: React.FC<OwnProps> = (props: OwnProps) => {
	if (!props.loading) return null;

	return (
		<View style={styles.container} pointerEvents="none">
			<View style={styles.card}>
				<ActivityIndicator size="large" color="#1539C2" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, .4)',
		pointerEvents: 'none',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		padding: 12,
		backgroundColor: '#c0c0c0',
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
	}
});
