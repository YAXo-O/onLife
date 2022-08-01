import * as React from 'react';

import { Nullable } from '../../objects/utility/Nullable';
import { StyleSheet, Text } from 'react-native';

interface OwnProps {
	error: Nullable<string>;
	touched: boolean | undefined;
}

export const ErrorComponent: React.FC<OwnProps> = (props: OwnProps) => {
	if (props.error === null || !props.touched) return null;

	return (
		<Text style={styles.text}>
			{props.error}
		</Text>
	);
};

const styles = StyleSheet.create({
	text: {
		color: '#c00007',
	},
});
