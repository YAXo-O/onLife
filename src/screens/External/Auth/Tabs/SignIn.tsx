import * as React from 'react';
import {
	View,
	StyleSheet,
	ViewStyle,
	StyleProp, Text, TouchableOpacity, Linking,
} from 'react-native';

import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { WavyFormRow, WavyFormRowType } from '@app/components/form/WavyForm';
import { ActionButton } from '@app/components/buttons/ActionButton';
import { useLoader } from '@app/hooks/useLoader';
import { AlertBox, AlertType } from '@app/components/alertbox/AlertBox';
import { Translator } from '@app/utils/validation';
import { palette } from '@app/styles/palette';

import { logIn } from '@app/services/Requests/AppRequests/UserRequests';
import { Nullable } from '@app/objects/utility/Nullable';

import Key from '@assets/icons/key.svg';
import Email from '@assets/icons/email.svg';
import { PrivateStorage } from '@app/services/Privacy/PrivateStorage';
import { PrivateKeys } from '@app/services/Privacy/PrivateKeys';
import { useNavigation } from '@react-navigation/native';
import { Routes, ExternalScreenNavigationProps } from '@app/navigation/routes';

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
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const { start, finish } = useLoader();
	const { navigate } = useNavigation<ExternalScreenNavigationProps>();

	const submit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
		start();

		logIn(values.login, values.password)
			.then((token: string) => {
				setError(null);
				helpers.resetForm();

				return PrivateStorage.set(PrivateKeys.Session, token)
					.catch((error) => console.warn('Failed to save token: ', error))
			})
			.catch((error: string | Error) => {
				console.warn('<SignIn> login error: ', error);
				setError('Убедитесь, что указаны верные логин и пароль');
				// setError(toString(error));
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
							<TouchableOpacity style={{ marginVertical: 16 }} onPress={() => navigate(Routes.AuthByPhone)}>
								<Text style={styles.action}>
									Войти по номеру телефона
								</Text>
							</TouchableOpacity>
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
	action: {
		color: palette.cyan['60'],
		fontFamily: 'Inter-SemiBold',
		fontSize: 14,
		lineHeight: 18,
		textAlign: 'center',
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
		fontFamily: 'Inter-Regular',
		color: palette.cyan['40'],
	},
});
