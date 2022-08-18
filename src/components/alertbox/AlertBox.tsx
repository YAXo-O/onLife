import * as React from 'react';
import { Nullable } from '../../objects/utility/Nullable';
import { View, StyleSheet, Text } from 'react-native';

export enum AlertType {
	info = 0,
	warning = 1,
	danger = 2,
	error = 3,
}

interface OwnProps {
	type?: AlertType;
	message: Nullable<string>;
}

export const AlertBox: React.FC<OwnProps> = (props: OwnProps) => {
	if (!props.message) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.text}>
				{props.message}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		padding: 4,
		backgroundColor: '#be0000',
	},
	text: {
		color: '#fff',
	}
});
