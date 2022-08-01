import * as React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView, ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { ErrorComponent } from '../../components/validation/Error';
import { Routes } from '../../navigation';
import { formStyles } from './FormStyle';

import Background from '../../../assets/background.png';

interface OwnProps {
}

type Props = OwnProps & NativeStackScreenProps<never>;

interface FormValues {
	email: string;
	password: string;
}

const initialValues: FormValues = {
	email: '',
	password: '',
}

const validationSchema = Yup.object().shape({
	email: Yup.string().required('Обязательное поле').email('Некорректный формат email'),
	password: Yup.string().required('Обязательно поле').min(8, 'Пароль должен содержать не меньше 8 символов'),
});

export const SignInScreen: React.FC<Props> = (props: Props) => {
	const register = () => props.navigation.navigate(Routes.SignUp);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={() => console.log('<SignIn>: signing in')}
		>
			{
				({
					 handleChange,
					 handleBlur,
					 handleSubmit,
					 values,
					errors,
					touched,
				 }) => (
					<ImageBackground source={Background} style={formStyles.background}>
						<ScrollView contentContainerStyle={formStyles.scrollContainer}>
							<View style={formStyles.screen}>
								<View style={formStyles.container}>
									<View style={formStyles.row}>
										<Text style={formStyles.label}>Логин: </Text>
										<TextInput
											style={formStyles.input}
											textContentType="emailAddress"
											keyboardType="email-address"
											value={values.email}
											onChange={handleChange('email')}
											onBlur={handleBlur('email')}
										/>
										<ErrorComponent error={errors.email ?? null} touched={touched.email} />
									</View>
									<View style={formStyles.row}>
										<Text style={formStyles.label}>Пароль: </Text>
										<TextInput
											style={formStyles.input}
											textContentType="password"
											secureTextEntry
											value={values.password}
											onChange={handleChange('password')}
											onBlur={handleBlur('password')}
										/>
										<ErrorComponent error={errors.password ?? null} touched={touched.password} />
									</View>
									<View style={[formStyles.btnRow, formStyles.row]}>
										<TouchableOpacity
											style={[formStyles.btn]}
											onPress={register}
										>
											<Text style={formStyles.action}>Создать аккаунт</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[formStyles.btn]}
											onPress={handleSubmit}
										>
											<Text style={formStyles.action}>Войти</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</ScrollView>
					</ImageBackground>
				)
			}
		</Formik>
	);
}
