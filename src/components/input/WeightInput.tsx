import * as React from 'react';
import {
	TextInput,
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Modal,
	KeyboardAvoidingView,
} from 'react-native';

import Done from '../../../assets/icons/done.svg';
import Close from '../../../assets/icons/close.svg';
import Down from '../../../assets/icons/down.svg';
import Up from '../../../assets/icons/up.svg';

interface OwnProps {
	value: number | undefined;
	onChange: (value: number) => void;
	disabled?: boolean;
}

function getValue(rawValue: string): number {
	const value = rawValue.replace(',', '.')
		.replace('-', '')
		.replace(/\s+/g, '');
	const num = parseFloat(value);

	if (Number.isNaN(num)) return 0;

	return num;
}

interface OverlayProps {
	visible: boolean;
	value: string;
	onOk: (value: string) => void;
	onCancel: () => void;
}

const Overlay: React.FC<OverlayProps> = (props: OverlayProps) => {
	const [rawValue, setRawValue] = React.useState<string>(() => props.value);
	React.useEffect(() => {
		setRawValue(props.value);
	}, [props.value]);

	function adjust(adjustment: number): void {
		const value = getValue(rawValue) + adjustment;
		setRawValue(value.toFixed(1));
	}

	return (
		<Modal
			visible={props.visible}
			animationType="fade"
			transparent
			onRequestClose={props.onCancel}
		>
			<KeyboardAvoidingView>
				<View style={styles.keyboard.overlay}>
					<View style={styles.keyboard.container}>
						<TouchableOpacity style={styles.keyboard.close} onPress={props.onCancel}>
							<Close />
						</TouchableOpacity>
						<View
							style={styles.keyboard.card}
						>
							<Text style={styles.keyboard.label}>
								Выполнен вес
							</Text>
							<View style={styles.keyboard.row}>
								<TouchableOpacity onPress={() => adjust(-0.5)}>
									<Down />
								</TouchableOpacity>
								<TextInput
									style={[styles.keyboard.text, styles.input.text]}
									keyboardType="numeric"
									value={rawValue}
									onChangeText={setRawValue}
								/>
								<TouchableOpacity onPress={() => adjust(0.5)}>
									<Up />
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								onPress={() => props.onOk(rawValue)}
								style={styles.keyboard.action}
							>
								<Done />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export const WeightInput: React.FC<OwnProps> = (props: OwnProps) => {
	const [active, setActive] = React.useState<boolean>(() => false);
	const value = props.value?.toFixed(1) ?? '';

	return (
		<View style={styles.input.row}>
			<View style={[styles.input.container]}>
				<TouchableOpacity
					onPress={() => {
						if (props.disabled) return;

						setActive(true);
					}}
				>
					<View style={styles.input.component}>
						<Text style={styles.input.text}>{value ? value : 'Выполненный вес'}</Text>
					</View>
				</TouchableOpacity>
			</View>
			<Overlay
				visible={active}
				value={value}
				onOk={(value: string) => {
					props.onChange(getValue(value));
					setActive(false);
				}}
				onCancel={() => {
					setActive(false);
				}}
			/>
		</View>
	);
};

const _input = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		zIndex: 10,
		flexDirection: 'column',
	},
	row: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	component: {
		borderWidth: 1,
		borderColor: 'blue',
		borderStyle: 'solid',
		borderRadius: 14,
		paddingVertical: 2,
		paddingHorizontal: 4,
		fontSize: 12,
		lineHeight: 12,
		textAlign: 'center',
		minWidth: 100,
		maxWidth: 150,
		marginHorizontal: 8,
	},
	icon: {
		width: 12,
		height: 12,
	},
	iconWrap: {
		borderWidth: 1,
		borderColor: 'blue',
		borderStyle: 'solid',
		borderRadius: 10,
		padding: 2,
	},
	text: {
		color: 'gray',
		textAlign: 'center',
	},

});

const _keyboard = StyleSheet.create({
	overlay: {
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	spacer: {
		flexGrow: 1,
	},
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
	},
	card: {
		backgroundColor: 'white',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	close: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginRight: 6,
	},
	label: {
		fontSize: 18,
		lineHeight: 24,
		color: 'gray',
		textAlign: 'center',
		paddingTop: 8,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.15)',
		borderRadius: 16,
		width: 120,
		lineHeight: 18,
		paddingVertical: 4,
		paddingHorizontal: 2,
		marginTop: 4,
		marginBottom: 8,
		marginHorizontal: 4,
		textAlign: 'center',
	},
	action: {
		backgroundColor: 'blue',
		height: 48,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
});

const styles = {
	input: _input,
	keyboard: _keyboard,
};
