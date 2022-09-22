import * as React from 'react';
import {
	TextInput,
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Modal
} from 'react-native';

import Done from '../../../assets/icons/done.svg';

interface OwnProps {
	value: number | undefined;
	onChange: (value: number) => void;
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

	return (
		<Modal
			visible={props.visible}
			animationType="fade"
			transparent
		>
			<View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
				<View
					style={{
						position: 'absolute',
						bottom: 0,
						right: 0,
						left: 0,
						backgroundColor: 'white',
						borderTopLeftRadius: 12,
						borderTopRightRadius: 12,
					}}
				>
					<Text style={{ fontSize: 18, lineHeight: 24, color: 'gray', textAlign: 'center', paddingTop: 8 }}>
						Выполнен вес
					</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<TextInput
							style={[{
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
								textAlign: 'center',
							}, styles.text
							]}
							keyboardType="numeric"
							autoFocus
							value={rawValue}
							onChangeText={setRawValue}
						/>
					</View>
					<TouchableOpacity
						onPress={() => props.onOk(rawValue)}
					>
						<View
							style={{
								backgroundColor: 'blue',
								height: 48,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								flex: 1,
							}}
						>
							<Done />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export const WeightInput: React.FC<OwnProps> = (props: OwnProps) => {
	const [active, setActive] = React.useState<boolean>(() => false);
	const value = props.value?.toFixed(1) ?? '';
	const ref = React.useRef(null);

	return (
		<View style={styles.row}>
			<View style={[styles.container]}>
				<TextInput
					value={value}
					placeholder="Выполненный вес"
					style={[styles.input, styles.text]}
					placeholderTextColor="gray"
					onFocus={() => {
						setActive(true);
					}}
					ref={ref}
				/>
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

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		zIndex: 10,
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
	input: {
		borderWidth: 1,
		borderColor: 'blue',
		borderStyle: 'solid',
		borderRadius: 14,
		paddingVertical: 0,
		paddingHorizontal: 4,
		fontSize: 12,
		lineHeight: 12,
		textAlign: 'center',
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
	}
});
