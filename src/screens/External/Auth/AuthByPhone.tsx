import * as React from 'react';
import {
	StatusBar,
	View,
	Text,
	ImageBackground,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@app/styles/palette';

import Background from '@assets/images/background.png';
import { WavyFormRowType, WavyFormRow } from '@app/components/form/WavyForm';

import Phone from '@assets/icons/phone.svg';
import Key from '@assets/icons/key.svg';
import { ActionButton } from '@app/components/buttons/ActionButton';
import { getCode, AuthCodeData, confirmPhone, AuthTokenData } from '@app/services/Requests/PowerTrainRequests/Auth';
import { useLoader } from '@app/hooks/useLoader';
import { AlertType, AlertBox } from '@app/components/alertbox/AlertBox';
import { Nullable } from '@app/objects/utility/Nullable';
import { toString } from '@app/utils/validation';
import { PrivateStorage } from '@app/services/Privacy/PrivateStorage';
import { PrivateKeys } from '@app/services/Privacy/PrivateKeys';

const height = Dimensions.get('window').height;

enum AuthStep {
	Phone = 0,
	Code = 1,
}

interface PhoneStepProps {
	onNext: (phone: string, challenge: string) => void;
}

interface CodeStepProps {
	phone: string;
	challenge: string;

	onPrevious: () => void;
	onConfirm: (token: string) => void;
}

const regexp = /^[+]\d*$/;
const PhoneStep: React.FC<PhoneStepProps> = (props: PhoneStepProps) => {
	const [phone, setPhone] = React.useState<string>(() => '+7');
	const [count, setCount] = React.useState<number>(() => 0);
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const { start, finish } = useLoader();

	return (
		<>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<WavyFormRow
					value={phone}
					error={undefined}
					onChange={(value: string) => {
						if (value && !regexp.test(value)) return;

						setPhone(value);
					}}
					placeholder="Телефон"
					keyboardType="phone-pad"
					textContentType="telephoneNumber"
					icon={<Phone fillPrimary={palette.white['100']} />}
					type={WavyFormRowType.Left}
					enclosed
				/>
				<Text style={styles.details}>
					Введите номер телефона в формате +7XXXXXXXXXX
				</Text>
			</View>
			<View style={{ padding: 32 }}>
				<ActionButton
					onPress={() => {
						setCount((count: number) => count + 1);
						start();
						getCode(phone)
							.then((data: AuthCodeData) => {
								setError(null);
								props.onNext(phone, data.challenge)
							})
							.catch((error: Error | string) => {
								console.warn('<AuthByPhone> get code error: ', error);
								setError(toString(error));
							})
							.finally(finish);
					}}
					text="Запросить код"
				/>
			</View>
			<AlertBox
				key={count}
				title="Ошибка авторизации"
				type={AlertType.error}
				message={error}
			/>
		</>
	);
}

const CodeStep: React.FC<CodeStepProps> = (props: CodeStepProps) => {
	const [code, setCode] = React.useState<string>(() => '');
	const [error, setError] = React.useState<Nullable<string>>(() => null);
	const [count, setCount] = React.useState<number>(() => 0);
	const { start, finish } = useLoader();

	return (
		<>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<WavyFormRow
					value={code}
					error={undefined}
					onChange={(value: string) => setCode(value)}
					placeholder="Код подтверждения"
					textContentType="oneTimeCode"
					keyboardType="number-pad"
					icon={<Key fillPrimary={palette.white['100']} />}
					type={WavyFormRowType.Right}
					enclosed
				/>
				<Text style={styles.details}>
					В течение минуты на номер {props.phone} поступит звонок. Введите последние 4 цифры входящего номера.
				</Text>
			</View>
			<View style={{ paddingHorizontal: 32, paddingVertical: 16 }}>
				<TouchableOpacity onPress={props.onPrevious}>
					<Text style={styles.action}>
						Изменить номер телефона
					</Text>
				</TouchableOpacity>
			</View>
			<View style={{ paddingHorizontal: 32, paddingTop: 16, paddingBottom: 32 }}>
				<ActionButton
					onPress={() => {
						setCount((count: number) => count + 1);
						start();
						confirmPhone(code, props.challenge)
							.then((data: AuthTokenData) => {
								setError(null);
								props.onConfirm(data.token);
							})
							.catch((error: Error | string) => {
								console.warn('<AuthByPhone> confirm code error: ', error);
								setError(toString(error));
							})
							.finally(finish);
					}}
					text="Войти"
				/>
				<AlertBox
					key={count}
					title="Ошибка авторизации"
					type={AlertType.error}
					message={error}
				/>
			</View>
		</>
	);
}

export const AuthByPhoneScreen: React.FC = () => {
	const [step, setStep] = React.useState<AuthStep>(() => AuthStep.Phone);
	const [phone, setPhone] = React.useState<string>(() => '');
	const [challenge, setChallenge] = React.useState<string>(() => '');
	const { start, finish } = useLoader();

	return (
		<ImageBackground source={Background} style={{ height: height + (StatusBar.currentHeight ?? 0), }} resizeMode="cover">
			<SafeAreaView style={{ flex: 1 }}>
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ flex: 1 }}
					bounces={false}
				>
					<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
						<View style={[styles.row, { marginTop: 52, }]}>
							<Text style={styles.title}>
								<Text style={[styles.title, { color: palette.cyan['40'] }]}>ON</Text>
								<Text style={[styles.title, { color: palette.white['100'] }]}>LIFE</Text>
							</Text>
							<Text style={styles.caption}>
								Авторизация
							</Text>
						</View>
						{
							step === AuthStep.Phone
								? (
									<PhoneStep
										onNext={(phone: string, challenge: string) => {
											setPhone(phone);
											setChallenge(challenge);
											setStep(AuthStep.Code)
										}}
									/>
								)
								: (
									<CodeStep
										phone={phone}
										challenge={challenge}
										onPrevious={() => setStep(AuthStep.Phone)}
										onConfirm={(token: string) => {
											start();
											PrivateStorage.set(PrivateKeys.Session, token)
												.catch((error) => console.warn('Failed to save token: ', error))
												.finally(finish);
										}}
									/>
								)
						}
					</KeyboardAvoidingView>
				</ScrollView>
			</SafeAreaView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	row: {
		width: '100%',
		paddingHorizontal: 0,
	},
	title: {
		fontFamily: 'AGaramondPro-Regular',
		fontSize: 48,
		lineHeight: 58,
		textAlign: 'center',
		marginBottom: 0,
	},
	caption: {
		fontFamily: 'Inter-Regular',
		fontSize: 24,
		lineHeight: 24,
		textAlign: 'center',
		color: '#d9d9d9',
		margin: 0,
		padding: 0,
	},
	details: {
		color: '#efefef',
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		lineHeight: 18,
		marginHorizontal: 32,
		marginVertical: 16,
		textAlign: 'center',
	},
	action: {
		color: palette.cyan['60'],
		fontFamily: 'Inter-SemiBold',
		fontSize: 14,
		lineHeight: 18,
		textAlign: 'center',
	},
	container: {
		flex: 1,
	},
	tabBar: {
		paddingHorizontal: 40,
	},
	tabPane: {
		paddingTop: 50,
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
	},
});
