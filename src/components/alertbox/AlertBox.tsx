import * as React from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';

import { FormikErrors } from 'formik';

import { Nullable } from '@app/objects/utility/Nullable';
import { palette } from '@app/styles/palette';
import { Translator, errorsToString } from '@app/utils/validation';

export enum AlertType {
	info = 0,
	warning = 1,
	danger = 2,
	error = 3,
}

interface OwnProps<FormValues = never> {
	type?: AlertType;
	message: Nullable<string> | Nullable<FormikErrors<FormValues>>;
	translation?: Translator<FormValues>;
	style?: StyleProp<ViewStyle>;
}

export const AlertBox = <FormValues, >(props: OwnProps<FormValues>) => {
	const [expanded, setExpanded] = React.useState<boolean>(() => false);
	if (!props.message) return null;

	const message: string | null = typeof (props.message) === 'object' ? errorsToString<FormValues>(props.message, props.translation, expanded ? 0 : 1) : props.message;
	if (!message) return null;

	return (
		<TouchableOpacity
			style={[styles.container, props.style]}
			onPress={() => setExpanded((value) => !value)}
		>
			<Text style={styles.text}>
				{message}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		paddingHorizontal: 4,
		paddingVertical: 6,
		backgroundColor: palette.regular.red,
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
	},
	text: {
		color: '#fff',
	}
});
