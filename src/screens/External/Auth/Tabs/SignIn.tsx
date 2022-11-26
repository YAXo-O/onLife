import * as React from 'react';
import {
	View,
	StyleSheet,
	ViewStyle,
	StyleProp, Text, TouchableOpacity, Linking,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { WavyFormRow, WavyFormRowType } from '@app/components/form/WavyForm';
import { ActionButton } from '@app/components/buttons/ActionButton';
import { useLoader } from '@app/hooks/useLoader';
import { AlertBox, AlertType } from '@app/components/alertbox/AlertBox';
import { Translator, toString } from '@app/utils/validation';
import { palette } from '@app/styles/palette';

import { logIn, LoginResponse } from '@app/services/Requests/AppRequests/UserRequests';
import { Nullable } from '@app/objects/utility/Nullable';
import { setAction as itemSetAction } from '@app/store/ItemState/ActionCreators';

import Key from '@assets/icons/key.svg';
import Email from '@assets/icons/email.svg';

interface OwnProps {
	style?: StyleProp<ViewStyle>;
}

interface FormValues {
	login: string;
	password: string;
}

const initialValues: FormValues = {
	login: '',
	password: '',
};

const validationSchema = Yup.object().shape({
	login: Yup.string().required('Обязательное поле').email('Некорректный формат email'),
	password: Yup.string().required('Обязательно поле').min(8, 'Пароль должен содержать не меньше 8 символов'),
});

const translation: Translator<FormValues> = {
	login: 'Email',
	password: 'Пароль',
};

const url = 'https://onlife.pro/privacy-policy';
function openRules(): void {
	Linking.canOpenURL(url)
		.then((can: boolean) => {
			if (can) {
				return Linking.openURL(url);
			}
		})
}

export const SignIn: React.FC<OwnProps> = (props: OwnProps) => {
	const dispatch = useDispatch();
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const { start, finish } = useLoader();

	const submit = (values: FormValues) => {
		start();

		logIn(values.login, values.password)
			.then((response: LoginResponse) => {
				setError(null);

				dispatch(itemSetAction(response.client, 'user'));
			})
			.catch((error: string | Error) => {
				console.warn('<SignIn> login error: ', error);
				setError(toString(error));
			})
			.finally(finish);
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={submit}
		>
			{
				(data: FormikProps<FormValues>) => (
					<View style={props.style}>
						<View>
							<WavyFormRow
								value={data.values.login}
								error={data.errors.login}
								onChange={(value: string) => data.setFieldValue('login', value, false)}
								onBlur={data.handleBlur('login')}
								type={WavyFormRowType.Left}
								keyboardType="email-address"
								textContentType="username"
								placeholder="Email"
								icon={<Email fillPrimary={palette.white['100']} />}
								leading
							/>
							<WavyFormRow
								value={data.values.password}
								error={data.errors.password}
								onChange={(value: string) => data.setFieldValue('password', value, false)}
								onBlur={data.handleBlur('password')}
								type={WavyFormRowType.Right}
								placeholder="Пароль"
								textContentType="password"
								icon={<Key fillPrimary={palette.white['100']} />}
								secureTextEntry
								trailing
							/>
						</View>
						<TouchableOpacity onPress={openRules}>
							<Text style={styles.rules}>
								Нажимая «Войти», я принимаю<Text style={styles.rulesHighlight}> Правила</Text> предоставления услуг
							</Text>
						</TouchableOpacity>
						<View style={styles.actionContainer}>
							<ActionButton
								text="Войти"
								onPress={data.handleSubmit} />
						</View>
						<AlertBox
							key={data.submitCount ?? -1}
							title="Ошибка авторизации"
							type={AlertType.error}
							message={error ?? data.errors}
							translation={translation}
						/>
					</View>
				)
			}
		</Formik>
	);
}

const styles = StyleSheet.create({
	actionContainer: {
		marginHorizontal: 30,
		marginBottom: 75,
	},
	rules: {
		fontFamily: 'Inter-Regular',
		color: palette.white['50'],
		fontSize: 12,
		lineHeight: 15,
		paddingHorizontal: 30,
		marginTop: 30,
	},
	rulesHighlight: {
		fontFamily: 'Roboto',
		color: palette.cyan['40'],
	},
});
