import * as React from 'react';
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	StyleSheet,
	StyleProp,
	ViewStyle,
	Linking,
} from 'react-native';

import { Formik, FormikProps } from 'formik';
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
import { AlertBox } from '@app/components/alertbox/AlertBox';
import { Translator } from '@app/utils/validation';

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
	const { start } = useLoader();

	const submit = () => {
		start();
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
								onChange={data.handleChange('lastName')}
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
								onChange={data.handleChange('firstName')}
								onBlur={data.handleBlur('firstName')}
								type={WavyFormRowType.Right}
								placeholder="Имя"
								textContentType="name"
								icon={<User fillPrimary={palette.white['100']} />}
							/>
							<WavyFormRow
								value={data.values.email}
								error={data.errors.email}
								onChange={data.handleChange('email')}
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
								onChange={data.handleChange('phone')}
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
								onChange={data.handleChange('password')}
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
						<AlertBox message={data.errors} translation={translation} />
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
		fontFamily: 'Roboto',
		color: palette.cyan['40'],
	},
});
