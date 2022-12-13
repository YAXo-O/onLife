import * as React from 'react';
import {
	StyleSheet,
	Text,
	StyleProp,
	ViewStyle,
	TextStyle,
	View,
	TouchableOpacity,
} from 'react-native';

import { FormikErrors } from 'formik';

import { Nullable } from '@app/objects/utility/Nullable';
import { palette } from '@app/styles/palette';
import { Translator, errorsToString } from '@app/utils/validation';
import { ActionModal, ActionModalType } from '@app/components/modals/action/ActionModal';

import CheckCircle from '@assets/icons/check_circle.svg';
import ErrorCircle from '@assets/icons/error_circle.svg';
import Cross from '@assets/icons/cross.svg';

export enum AlertType {
	info = 0,
	warning = 1,
	danger = 2,
	error = 3,
}

interface OwnProps<FormValues = never> {
	type?: AlertType;
	title: string;
	message: Nullable<string> | Nullable<FormikErrors<FormValues>>;
	translation?: Translator<FormValues>;
	style?: StyleProp<ViewStyle>;
}

function getTextStyle(type: AlertType = AlertType.info): StyleProp<TextStyle> {
	switch (type) {
		case AlertType.warning:
		case AlertType.danger:
		case AlertType.info:
			return { ...styles.text, ...styles.infoText };

		case AlertType.error:
			return { ...styles.text, ...styles.errorText };
	}
}

function getIcon(type: AlertType = AlertType.info): React.ReactNode {
	switch(type) {
		case AlertType.info:
			return <CheckCircle fillPrimary={palette.cyan['40']} width={54} height={54} />;

		case AlertType.warning:
		case AlertType.danger:
		case AlertType.error:
			return <ErrorCircle fillPrimary={palette.regular.red} width={54} height={54} />
	}
}

export const AlertBox = <FormValues, >(props: OwnProps<FormValues>) => {
	const [visible, setVisible] = React.useState<boolean>(() => false);
	const [message, setMessage] = React.useState<Nullable<string>>(() => null);

	React.useEffect(() => {
		if (!props.message) {
			setVisible(false);

			return;
		}

		const message: string | null = typeof (props.message) === 'object'
			? errorsToString<FormValues>(props.message, props.translation, 0)
			: props.message;

		if (!message) {
			setVisible(false);

			return;
		}

		setMessage(message);
		setVisible(true);
	}, [props.message]);

	return (
		<ActionModal
			visible={visible}
			onChange={setVisible}
			type={ActionModalType.Docked}
		>
			<View style={styles.container}>
				<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
					<TouchableOpacity onPress={() => setVisible(false)}>
						<Cross width={25} height={25} />
					</TouchableOpacity>
				</View>
				{getIcon(props.type)}
				<Text style={[getTextStyle(props.type), styles.title]}>
					{props.title}
				</Text>
				{ props.title || message ? <View style={styles.spacer} /> : null }
				<Text style={[getTextStyle(props.type), { color: palette.blue['20'] }]}>
					{message}
				</Text>
			</View>
		</ActionModal>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	spacer: {
		height: 10,
	},
	title: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 20,
		lineHeight: 24,
	},
	text: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		lineHeight: 16,
	},
	errorText: {
		color: palette.regular.red,
	},
	infoText: {
		color: palette.cyan['40'],
	},
});
