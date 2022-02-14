import * as React from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	View,
	TouchableOpacity,
	Text,
	TextInput,
	Modal,
	StyleSheet, Dimensions,
} from 'react-native';

import CloseIcon from '@app/assets/formTab/closemdpi.svg';
import UpArr from '@app/assets/formTab/up.svg';
import DownArr from '@app/assets/formTab/down.svg';
import DoneIcon from '@app/assets/formTab/done.svg';

interface WeightInputProps {
	value: number;
	onChange: (value: number) => void;
	onComplete: () => void;

	visible: boolean;
	setVisible: (visible: boolean) => void;

	caption?: string;
}

const { width } = Dimensions.get('window');

export const WeightInput: React.VFC<WeightInputProps> = (props: WeightInputProps) => {
	const [str, setStr] = React.useState<string>();
	const hide = () => props.setVisible(false);

	React.useEffect(() => {
		const val = props.value?.toString() ?? '';
		setStr(val);
	}, [props.value]);
	React.useEffect(() => {
		const val = Number(str);

		if (val.toString() === str) {
			props.onChange(val);
		}
	}, [str]);

	return (
		<Modal
			animationType="slide"
			visible={props.visible}
			onRequestClose={hide}

			transparent
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'height' : null}
				style={styles.keyboardAvoidingView}
				enabled
			>
				<View style={styles.centeredView}>
					<TouchableOpacity
						onPress={hide}
						style={styles.topTouchable}>
						<View style={styles.closeIcon}>
							<CloseIcon/>
						</View>
					</TouchableOpacity>
					<View style={styles.modalView}>
						<Text style={styles.modalTitle}>Выполнен вес</Text>
						{
							props.caption
								? <Text style={styles.caption}>{props.caption}</Text>
								: null
						}
						<View style={styles.inputView}>
							<TouchableOpacity
								style={styles.modalArrUp}
								onPress={() => props.onChange(props.value + 0.5)}>
								<UpArr/>
							</TouchableOpacity>
							<TextInput
								autoFocus
								keyboardType="numeric"
								style={styles.lastItem}
								onChangeText={(val: string) => setStr(val)}
								value={str}
							/>
							<TouchableOpacity
								style={styles.modalArrDown}
								onPress={() => props.onChange(props.value - 0.5)}>
								<DownArr/>
							</TouchableOpacity>
						</View>
						<TouchableOpacity onPress={props.onComplete} style={styles.doneBtn}>
							<DoneIcon/>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
	},
	modalTitle: {
		fontSize: 22,
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '500',
		lineHeight: 25,
	},
	caption: {
		fontSize: 18,
		fontFamily: 'FuturaPT-Medium',
		fontWeight: '200',
		fontStyle: 'italic',
		color: '#A9A9A9',
		lineHeight: 20,
	},
	centeredView: {
		backgroundColor: 'rgba(0,0,0, .7)',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginTop: 0,
	},
	topTouchable: {
		flexGrow: 1,
		flexDirection: 'column',
		position: 'relative',
		width: '100%',
	},
	closeIcon: {
		position: 'absolute',
		width: width,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		bottom: 15,
		right: 15,
	},

	modalView: {
		backgroundColor: 'white',
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		width: width,
		padding: 20,
		paddingBottom: 0,
		alignItems: 'center',
		justifyContent: 'flex-end',
		flexDirection: 'column',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	inputView: {
		width: width,
		paddingTop: 10,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalArrUp: {
		justifyContent: 'center',
		alignItems: 'center',
		right: 20,
	},
	modalArrDown: {
		justifyContent: 'center',
		alignItems: 'center',
		left: 20,
	},
	doneBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		backgroundColor: '#1317CE',
		width: width,
	},
	lastItem: {
		width: '35%',
		height: 50,
		fontSize: 27,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.13)   ',
		color: '#1010FE',
		textAlign: 'center',
		borderRadius: 9,
	},
});
