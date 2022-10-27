import * as React from 'react';
import {
	View,
	StyleSheet,
	ViewStyle,
	StyleProp,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { WavyFormRow, WavyFormRowType } from '@app/components/form/WavyForm';
import { ActionButton } from '@app/components/buttons/ActionButton';
import { useLoader } from '@app/hooks/useLoader';
import { AlertBox } from '@app/components/alertbox/AlertBox';
import { Translator, toString } from '@app/utils/validation';
import { palette } from '@app/styles/palette';

import { logIn, LoginResponse } from '@app/services/Requests/AppRequests/UserRequests';
import { Nullable } from '@app/objects/utility/Nullable';

import Key from '@assets/icons/key.svg';
import Email from '@assets/icons/email.svg';
import { LocalActionCreators } from '@app/store/LocalState/ActionCreators';
import { setAction as itemSetAction } from '@app/store/ItemState/ActionCreators';

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

export const SignIn: React.FC<OwnProps> = (props: OwnProps) => {
	const dispatch = useDispatch();
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const { start, finish } = useLoader();

	const submit = (values: FormValues) => {
		start();

		logIn(values.login, values.password)
			.then((response: LoginResponse) => {
				setError(null);

				const factory = new LocalActionCreators('training');
				dispatch(itemSetAction(response.client, 'user'));
				dispatch(factory.set({ training: response.training }));
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
								icon={<Email fillPrimary={data.errors.login ? palette.regular.red : palette.white['100']} />}
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
								icon={<Key fillPrimary={data.errors.password ? palette.regular.red : palette.white['100']} />}
								secureTextEntry
								trailing
							/>
						</View>
						<View style={styles.actionContainer}>
							<ActionButton
								text="Войти"
								onPress={data.handleSubmit} />
						</View>
						<AlertBox message={error ?? data.errors} translation={translation} />
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
});
