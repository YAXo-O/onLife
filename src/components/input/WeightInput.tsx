import * as React from 'react';
import { TextInput, StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';

import Plus from '../../../assets/icons/plus.png';
import Minus from '../../../assets/icons/minus.png';

interface OwnProps {
	onAdd: (value: number) => void;
}

function getValue(rawValue: string): number {
	const value = rawValue.replace(',', '.')
		.replace('-', '')
		.replace(/\s+/g, '');
	const num = parseFloat(value);

	if (Number.isNaN(num)) return 0;

	return num;
}

export const WeightInput: React.FC<OwnProps> = (props: OwnProps) => {
	const [rawValue, setRawValue] = React.useState<string>('');
	const adjust = (value: number) => {
		const cur = getValue(rawValue)
		setRawValue((cur + value).toFixed(1));
	}

	return (
		<View style={styles.row}>
			<View style={[styles.container, { alignSelf: 'flex-start' }]}>
				<TouchableOpacity style={styles.iconWrap} onPress={() => adjust(-0.5)}>
					<Image source={Minus} style={styles.icon} tintColor="blue" />
				</TouchableOpacity>
				<TextInput
					value={rawValue}
					onChangeText={setRawValue}
					placeholder="Выполненный вес (кг)"
					style={[styles.input, styles.text]}
					placeholderTextColor="gray"
				/>
				<TouchableOpacity style={styles.iconWrap} onPress={() => adjust(0.5)}>
					<Image source={Plus} style={styles.icon} tintColor="blue" />
				</TouchableOpacity>
			</View>
			<View>
				<TouchableOpacity onPress={() => props.onAdd(getValue(rawValue))}>
					<Text style={{ fontSize: 12, lineHeight: 14, color: 'blue' }}>
						Добавить подход
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flex: 1,
		justifyContent: 'space-between',
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
