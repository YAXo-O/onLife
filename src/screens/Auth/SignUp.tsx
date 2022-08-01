import * as React from 'react';
import { View, Text, TextInput, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { formStyles } from './FormStyle';
import { ErrorComponent } from '../../components/validation/Error';
import { Gender } from '../../objects/User';
import { Nullable } from '../../objects/utility/Nullable';

import Background from '../../../assets/background.png';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Routes } from '../../navigation';

interface OwnProps {
}

type Props = OwnProps & NativeStackScreenProps<never>;

interface FormValues {
	email: string;
	password: string;

	firstName: string;
	lastName: string;

	height: Nullable<number>;
	weight: Nullable<number>;

	gender: Nullable<Gender>;
	birthDate: Nullable<number>;
}

const initialValues: FormValues = {
	email: '',
	password: '',

	firstName: '',
	lastName: '',

	height: null,
	weight: null,

	gender: null,
	birthDate: null,
};

const validationSchema = Yup.object().shape({
	email: Yup.string().email('Некорректный формат email').required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле').min(8, 'Пароль должен содержать не менее 8 символов'),

	firstName: Yup.string().required('Обязательно поле'),
	lastName: Yup.string().required('Обязательно поле'),

	height: Yup.number().positive('Число должно быть положительным').required('Обязательно поле').typeError('Поле должно быть числом'),
	weight: Yup.number().positive('Число должно быть положительным').required('Обязательно поле').typeError('Поле должно быть числом'),

	gender: Yup.number().required('Обязательно поле').integer().min(0).max(1),
	birthDate: Yup.number().required('Обязательно поле').min(0).max(+Date()),
});

export const SignUpScreen: React.FC<Props> = (props: Props) => {
	const register = () => console.log('<SignUp> sign up action');
	const authorize = () => props.navigation.navigate(Routes.SignIn);

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
									<View style={formStyles.row}>
										<Text style={formStyles.label}>Имя: </Text>
										<TextInput
											style={formStyles.input}
											textContentType="username"
											value={values.password}
											onChange={handleChange('firstName')}
											onBlur={handleBlur('firstName')}
										/>
										<ErrorComponent error={errors.firstName ?? null} touched={touched.firstName} />
									</View>
									<View style={formStyles.row}>
										<Text style={formStyles.label}>Фамилия: </Text>
										<TextInput
											style={formStyles.input}
											textContentType="username"
											value={values.password}
											onChange={handleChange('lastName')}
											onBlur={handleBlur('lastName')}
										/>
										<ErrorComponent error={errors.lastName ?? null} touched={touched.lastName} />
									</View>

									<View style={[formStyles.row, formStyles.rowHorizontal]}>
										<View style={formStyles.column}>
											<Text style={formStyles.label}>Рост: </Text>
											<TextInput
												style={formStyles.input}
												keyboardType="number-pad"
												value={values.password}
												onChange={handleChange('height')}
												onBlur={handleBlur('height')}
											/>
											<ErrorComponent error={errors.height ?? null} touched={touched.height} />
										</View>
										<View style={formStyles.column}>
											<Text style={formStyles.label}>Вес: </Text>
											<TextInput
												style={formStyles.input}
												keyboardType="number-pad"
												value={values.password}
												onChange={handleChange('weight')}
												onBlur={handleBlur('weight')}
											/>
											<ErrorComponent error={errors.weight ?? null} touched={touched.weight} />
										</View>
									</View>

									<View style={[formStyles.btnRow, formStyles.row]}>
										<TouchableOpacity
											style={[formStyles.btn]}
											onPress={authorize}
										>
											<Text style={formStyles.action}>Уже есть аккаунт?</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[formStyles.btn]}
											onPress={handleSubmit}
										>
											<Text style={formStyles.action}>Создать аккаунт</Text>
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
