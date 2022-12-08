import * as React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Linking, } from 'react-native';

import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { palette } from '@app/styles/palette';
import { WavyFormRow, WavyFormRowType } from '@app/components/form/WavyForm';
import { ActionButton } from '@app/components/buttons/ActionButton';
import { useLoader } from '@app/hooks/useLoader';

import Home from '@assets/icons/home.svg';
import User from '@assets/icons/user.svg';
import Email from '@assets/icons/email.svg';
import Phone from '@assets/icons/phone.svg';
import Key from '@assets/icons/key.svg';
import { AlertBox, AlertType } from '@app/components/alertbox/AlertBox';
import { Translator, toString } from '@app/utils/validation';
import { Nullable } from '@app/objects/utility/Nullable';
import { register } from '@app/services/Requests/AppRequests/UserRequests';

interface OwnProps {
	style?: StyleProp<ViewStyle>;
}

interface FormValues {
	lastName: string;
	firstName: string;
	email: string;
	phone: string;
	password: string;
}

const initialValues: FormValues = {
	lastName: '',
	firstName: '',
	email: '',
	phone: '',
	password: '',
};

const validationSchema = Yup.object().shape({
	lastName: Yup.string().required('Обязательное поле'),
	firstName: Yup.string().required('Обязательное поле'),
	email: Yup.string().required('Обязательное поле').email('Некорректный формат email'),
	phone: Yup.string().required('Обязательное поле'),
	password: Yup.string().required('Обязательно поле').min(8, 'Пароль должен содержать не меньше 8 символов'),
});

const translation: Translator<FormValues> = {
	lastName: 'Фамилия',
	firstName: 'Имя',
	email: 'Email',
	phone: 'Телефон',
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

export const SignUp: React.FC<OwnProps> = (props: OwnProps) => {
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const [message, setMessage] = React.useState<Nullable<string>>(() => null);
	const { start, finish } = useLoader();

	const submit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
		start();

		register(values)
			.then(() => {
				setError(null);
				setMessage('Теперь вы можете авторизоваться, используя указанные при регистрации email и пароль');
				helpers.resetForm();
			})
			.catch((error: string | Error) => {
				console.warn('<SignUp> register error: ', error);
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
						<ScrollView>
							<WavyFormRow
								value={data.values.lastName}
								error={data.errors.lastName}
								onChange={(value: string) => data.setFieldValue('lastName', value, false)}
								onBlur={data.handleBlur('lastName')}
								type={WavyFormRowType.Left}
								placeholder="Фамилия"
								textContentType="familyName"
								icon={<Home fillPrimary={palette.white['100']} />}
								leading
							/>
							<WavyFormRow
								value={data.values.firstName}
								error={data.errors.firstName}
								onChange={(value: string) => data.setFieldValue('firstName', value, false)}
								onBlur={data.handleBlur('firstName')}
								type={WavyFormRowType.Right}
								placeholder="Имя"
								textContentType="name"
								icon={<User fillPrimary={palette.white['100']} />}
							/>
							<WavyFormRow
								value={data.values.email}
								error={data.errors.email}
								onChange={(value: string) => data.setFieldValue('email', value, false)}
								onBlur={data.handleBlur('email')}
								type={WavyFormRowType.Left}
								placeholder="Email"
								textContentType="username"
								keyboardType="email-address"
								icon={<Email fillPrimary={palette.white['100']} />}
							/>
							<WavyFormRow
								value={data.values.phone}
								error={data.errors.phone}
								onChange={(value: string) => data.setFieldValue('phone', value, false)}
								onBlur={data.handleBlur('phone')}
								type={WavyFormRowType.Right}
								placeholder="Телефон"
								textContentType="telephoneNumber"
								keyboardType="phone-pad"
								icon={<Phone fillPrimary={palette.white['100']} />}
							/>
							<WavyFormRow
								value={data.values.password}
								error={data.errors.password}
								onChange={(value: string) => data.setFieldValue('password', value, false)}
								onBlur={data.handleBlur('password')}
								type={WavyFormRowType.Left}
								placeholder="Создать пароль"
								textContentType="newPassword"
								secureTextEntry
								trailing
								icon={<Key fillPrimary={palette.white['100']} />}
							/>
							<TouchableOpacity onPress={openRules}>
								<Text style={styles.rules}>
									Нажимая «Зарегистрироваться», я принимаю
									<Text style={styles.rulesHighlight}> Правила</Text> предоставления услуг
								</Text>
							</TouchableOpacity>
						</ScrollView>
						<View style={styles.actionContainer}>
							<ActionButton
								text="Зарегистрироваться"
								onPress={data.handleSubmit}
							/>
						</View>
						<AlertBox
							key={data.submitCount ?? -1}
							title="Ошибка регистрации"
							type={AlertType.error}
							message={data.errors || error}
							translation={translation}
						/>
						<AlertBox
							title="Пользователь зарегистрирован"
							message={message}
							type={AlertType.info}
						/>
					</View>
				)
			}
		</Formik>
	);
};

const styles = StyleSheet.create({
	actionContainer: {
		marginTop: 15,
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
		fontFamily: 'Inter-Regular',
		color: palette.cyan['40'],
	},
});
