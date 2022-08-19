import * as React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { ErrorComponent } from '../../components/validation/Error';
import { Routes } from '../../navigation';
import { formStyles, formTypography } from './FormStyle';

import { Spinner } from '../../components/spinner/Spinner';

import { logIn, test } from '../../services/Requests/AppRequests/UserRequests';
import { User } from '../../objects/User';
import { Nullable } from '../../objects/utility/Nullable';
import { useDispatch } from 'react-redux';
import { setAction } from '../../store/ItemState/ActionCreators';
import { AlertBox } from '../../components/alertbox/AlertBox';

import Background from '../../../assets/images/background.png';

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
	const [progress, setProgress] = React.useState(() => false);
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const dispatch = useDispatch();

	const submit = (values: FormValues) => {
		setProgress(true);
		logIn(values.email, values.password)
			.then((user: User) => {
				console.log('User: ', user);
				dispatch(setAction(user, 'user'));
				setError(null);
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
					values,
					errors,
					touched,
				 }) => (
				 <>
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
					<Spinner loading={progress} />
					<AlertBox message={error} />
				 </>
				)
			}
		</Formik>
	);
}
