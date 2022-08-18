import * as React from 'react';
import {
	View,
	Text,
	TextInput,
	ImageBackground,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import Select from 'react-native-select-dropdown';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { formStyles, formTypography } from './FormStyle';
import { ErrorComponent } from '../../components/validation/Error';
import { DatePicker } from '../../components/date/DatePicker';
import { Gender, User } from '../../objects/User';
import { Nullable } from '../../objects/utility/Nullable';
import { Routes } from '../../navigation';

import { Spinner } from '../../components/spinner/Spinner';
import { AlertBox } from '../../components/alertbox/AlertBox';

import { register } from '../../services/Requests/AppRequests/UserRequests';
import { useDispatch } from 'react-redux';
import { setAction } from '../../store/ItemState/ActionCreators';

import Background from '../../../assets/images/background.png';

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
	dateModal: boolean;
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
	dateModal: false,
};

const validationSchema = Yup.object().shape({
	email: Yup.string().email('Некорректный формат email').required('Обязательное поле'),
	password: Yup.string().required('Обязательное поле').min(8, 'Пароль должен содержать не менее 8 символов'),

	firstName: Yup.string().required('Обязательно поле'),
	lastName: Yup.string().required('Обязательно поле'),

	height: Yup.number().positive('Число должно быть положительным').required('Обязательно поле').typeError('Поле должно быть числом'),
	weight: Yup.number().positive('Число должно быть положительным').required('Обязательно поле').typeError('Поле должно быть числом'),

	gender: Yup.number().required('Обязательно поле').integer('Обязательное поле').min(0).max(1).typeError('Обязательное поле'),
	birthDate: Yup.number().required('Обязательно поле').typeError('Обязательное поле'),
});

export const SignUpScreen: React.FC<Props> = (props: Props) => {
	const authorize = () => props.navigation.navigate(Routes.SignIn);
	const [progress, setProgress] = React.useState(() => false);
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const dispatch = useDispatch();

	const submit = (values: FormValues) => {
		setProgress(true);
		const model = {
			email: values.email,
			password: values.password,

			firstName: values.firstName,
			lastName: values.lastName,

			gender: values.gender!,
			height: values.height!,
			weight: values.weight!,
			birthDate: values.birthDate!,
		};

		register(model)
			.then((user: User) => {
				console.log('User: ', user);
				dispatch(setAction(values, 'user'));
			})
			.catch((error: string | Error) => {
				console.error(error);
				if (typeof error === 'string') {
					setError(error);
				} else if ((error as Error).message) {
					setError(error.message);
				} else {
					setError('Something went wrong');
				}
			})
			.finally(() => setProgress(false));
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={submit}
		>
			{
				({
					handleChange,
					handleBlur,
					handleSubmit,
					setFieldValue,
					setFieldTouched,
					values,
					errors,
					touched,
				}) => (
					<ImageBackground source={Background} style={formStyles.background}>
						<ScrollView contentContainerStyle={formStyles.scrollContainer}>
							<View style={formStyles.screen}>
								<View style={formStyles.container}>
									<View style={formStyles.row}>
										<Text style={[formStyles.label, formTypography.label]}>Логин: </Text>
										<TextInput
											style={[formStyles.input, formTypography.input]}
											textContentType="emailAddress"
											keyboardType="email-address"
											value={values.email}
											onChangeText={handleChange('email')}
											onBlur={handleBlur('email')}
										/>
										<ErrorComponent error={errors.email ?? null} touched={touched.email} />
									</View>
									<View style={formStyles.row}>
										<Text style={[formStyles.label, formTypography.label]}>Пароль: </Text>
										<TextInput
											style={[formStyles.input, formTypography.input]}
											textContentType="password"
											secureTextEntry
											value={values.password}
											onChangeText={handleChange('password')}
											onBlur={handleBlur('password')}
										/>
										<ErrorComponent error={errors.password ?? null} touched={touched.password} />
									</View>
									<View style={[formStyles.row, formStyles.rowHorizontal]}>
										<View style={formStyles.column}>
											<Text style={[formStyles.label, formTypography.label]}>Имя: </Text>
											<TextInput
												style={[formStyles.input, formTypography.input]}
												textContentType="username"
												value={values.firstName}
												onChangeText={handleChange('firstName')}
												onBlur={handleBlur('firstName')}
											/>
											<ErrorComponent error={errors.firstName ?? null} touched={touched.firstName} />
										</View>
										<View style={formStyles.column}>
											<Text style={[formStyles.label, formTypography.label]}>Фамилия: </Text>
											<TextInput
												style={[formStyles.input, formTypography.input]}
												textContentType="username"
												value={values.lastName}
												onChangeText={handleChange('lastName')}
												onBlur={handleBlur('lastName')}
											/>
											<ErrorComponent error={errors.lastName ?? null} touched={touched.lastName} />
										</View>
									</View>
									<View style={[formStyles.row, formStyles.rowHorizontal]}>
										<View style={formStyles.column}>
											<Text style={[formStyles.label, formTypography.label]}>Рост: </Text>
											<TextInput
												style={[formStyles.input, formTypography.input]}
												keyboardType="number-pad"
												value={values.height !== null ? values.height.toString() : ''}
												onChangeText={handleChange('height')}
												onBlur={handleBlur('height')}
											/>
											<ErrorComponent error={errors.height ?? null} touched={touched.height} />
										</View>
										<View style={formStyles.column}>
											<Text style={[formStyles.label, formTypography.label]}>Вес: </Text>
											<TextInput
												style={[formStyles.input, formTypography.input]}
												keyboardType="number-pad"
												value={values.weight !== null ? values.weight.toString() : ''}
												onChangeText={handleChange('weight')}
												onBlur={handleBlur('weight')}
											/>
											<ErrorComponent error={errors.weight ?? null} touched={touched.weight} />
										</View>
									</View>
									<View style={[formStyles.row, formStyles.rowHorizontal]}>
										<View style={formStyles.column}>
											<Text style={[formStyles.label, formTypography.label]}>Пол: </Text>
											<Select
												data={[
													{ label: 'Мужской', value: Gender.Male },
													{ label: 'Женский', value: Gender.Female },
												]}
												buttonTextAfterSelection={(item: { label: string }) => item.label}
												rowTextForSelection={(item: { label: string }) => item.label}
												onSelect={(value: { value: Gender }) => setFieldValue('gender', value.value, true)}
												onBlur={() => setFieldTouched('gender', true, true)}
												buttonStyle={{ ...formStyles.input, width: '100%' }}
												buttonTextStyle={{ ...formTypography.input, ...formStyles.inputText }}
												defaultButtonText="Выберите пол"
											/>
											<ErrorComponent error={errors.gender ?? null} touched={touched.gender} />
										</View>
										<View style={formStyles.column}>
											<Text style={[formStyles.label, formTypography.label]}>Дата рождения: </Text>
											<DatePicker
												value={values.birthDate}
												onChange={(value: number) => setFieldValue('birthDate', value, true)}
												title="Выберите дату рождения"
												caption="Выберите дату"
												style={{ ...formStyles.input, ...formTypography.input }}
											/>
										</View>
									</View>

									<View style={[formStyles.btnRow, formStyles.row]}>
										<TouchableOpacity
											style={[formStyles.btn]}
											onPress={authorize}
										>
											<Text style={[[formStyles.action, formTypography.action], formTypography.action]}>Уже есть аккаунт?</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[formStyles.btn]}
											onPress={handleSubmit}
										>
											<Text style={[[formStyles.action, formTypography.action], formTypography.action]}>Создать аккаунт</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</ScrollView>
						<Spinner loading={progress} />
						<AlertBox message={error} />
					</ImageBackground>
				)
			}
		</Formik>
	);
}
