import * as React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
} from 'react-native';

import { Nullable } from '@app/objects/utility/Nullable';

import Remove from '@assets/icons/keyboard/keyboard.remove.svg';
import Apply from '@assets/icons/keyboard/keyboardapply.svg';

interface OwnProps {
}

type Present = (value?: number) => void;
type Dismiss = () => void;
type Event = (value: number) => void;

type Actions = {
	present: Present;
	dismiss: Dismiss;
	listen?: Event;
};
type WeightKeyboardType = React.FC<OwnProps> & Actions;

let present: Present = (value?: number) => console.log('Presented keyboard mock with value: ', value);
let dismiss: Dismiss = () => console.log('Dismissed keyboard mock');

enum KeyType {
	Input = 0,
	Switch = 1,
	Spacer = 2,
	Remove = 3,
	Apply = 4
}

interface BlockProps {
	text: string;
	action?: () => void;
	type?: KeyType;
}

const keyboard: Array<BlockProps> = [
	{ text: '1', },
	{ text: '2', },
	{ text: '3', },
	{ text: 'KG', type: KeyType.Spacer },
	{ text: '4', },
	{ text: '5', },
	{ text: '6', },
	{ text: 'LB', type: KeyType.Spacer },
	{ text: '7', },
	{ text: '8', },
	{ text: '9', },
	{ text: 'BCK', type: KeyType.Remove },
	{ text: '', type: KeyType.Spacer },
	{ text: '0', },
	{ text: '.', },
	{ text: 'APPLY', type: KeyType.Apply },
];

function getItem(block: BlockProps): React.ReactNode {
	const type = block.type ?? KeyType.Input;

	switch (type) {
		case KeyType.Input:
			return (
				<TouchableOpacity
					style={styles['button__container-action']}
					onPress={block.action}
				>
					<Text style={styles['button__container-action__text']}>{block.text}</Text>
				</TouchableOpacity>
			);

		case KeyType.Apply:
			return (
				<TouchableOpacity
					style={[styles['button__container-action'], styles['button__container-action_apply']]}
					onPress={block.action}
				>
					<Apply width={21} height={12} />
				</TouchableOpacity>
			);

		case KeyType.Remove:
			return (
				<TouchableOpacity
					style={[styles['button__container-action'], styles['button__container-action_remove']]}
					onPress={block.action}
				>
					<Remove width={20} height={20} />
				</TouchableOpacity>
			);
	}
}

const Block: React.FC<BlockProps> = (props: BlockProps) => {
	if (props.type === KeyType.Spacer) return <View style={styles.button__container} />

	return (
		<View style={styles.button__container}>
			<TouchableOpacity
				style={styles['button__container-action']}
				onPress={props.action}
			>
				{getItem(props)}
			</TouchableOpacity>
		</View>
	);
};

const weightMask = /^\d*\.?\d?$/;
function isValid(value: Nullable<string> | undefined): boolean {
	if (value === null || value === undefined || value === '') return false;

	return weightMask.test(value);
}

type Handler<Argument, Result> = (argument: Argument) => Result;
type SetValue = Handler<Handler<string, string>, void>;
function setAction(block: BlockProps, setValue: SetValue, dismiss: () => void): void {
	const type = block.type ?? KeyType.Input;
	switch (type) {
		case KeyType.Input:
			setValue((value: string) => `${value}${block.text}`);
			return;

		case KeyType.Remove:
			setValue((value: string) => (value.length > 0 ? value.slice(0, -1) : ''));
			return;

		case KeyType.Apply:
			dismiss();
			return;
	}
}

export const WeightKeyboard: WeightKeyboardType = (props: OwnProps) => {
	const [visible, setVisible] = React.useState(() => false);
	const [value, setValue] = React.useState<string>(() => '');

	present = (value?: number) => {
		setVisible(true);
		setValue(value !== undefined ? value.toFixed(1) : '');
	}
	dismiss = () => {
		setVisible(false);

		const num = Number.parseFloat(value);
		if (isValid(value) && !Number.isNaN(num)) {
			WeightKeyboard.listen?.(num);
		} else {
			WeightKeyboard.listen?.(0);
		}
	}

	const onChange: SetValue = (action: (value: string) => string) => {
		setValue((value: string) => {
			const result = action(value);
			if (result === '' || isValid(result)) return result;

			return value;
		});
	};

	if (!visible) return null;

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, backgroundColor: 'green' }} />
			<View style={styles['keyboard-header']}>
				<View style={{ flex: 1, padding: 5, }} />
				<View style={[{ flex: 1, padding: 5, }, styles['keyboard-header__input']]}>
					<Text style={styles['keyboard-header__input-text']}>{value}</Text>
				</View>
				<View style={{ flex: 1, padding: 5, justifyContent: 'flex-start' }}>
					<Text style={styles['keyboard-header__input-text']}>KG</Text>
				</View>
			</View>
			<View style={styles['keyboard-container']}>
				{
					keyboard.map(
						(item: BlockProps) => (
							<Block
								key={item.text}
								text={item.text}
								action={() => setAction(item, onChange, dismiss)}
								type={item.type}
							/>
						)
					)
				}
			</View>
		</View>
	);
};

WeightKeyboard.present = (value?: number) => present(value);
WeightKeyboard.dismiss = () => dismiss();

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		flexDirection: 'column',
	},
	'keyboard-header': {
		height: 60,
		padding: 10,
		backgroundColor: '#F6F6F6',
		flexDirection: 'row',
		alignItems: 'center',
	},
	'keyboard-header__input': {
		borderRadius: 10,
		backgroundColor: '#fff',
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor:'#CCCCCC',
		height: 42,
		alignItems: 'center',
		justifyContent: 'center',
	},
	'keyboard-header__input-text': {
		fontFamily: 'Inter',
		fontSize: 20,
		lineHeight: 24,
		color: '#112A50',
	},
	'keyboard-container': {
		backgroundColor: 'rgba(204, 206, 211, 1)',
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 5,
	},
	'button__container': {
		flex: 1,
		flexBasis: '25%',
		height: 46,
		padding: 5,
	},
	'button__container-action': {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		elevation: 1,
		justifyContent: 'center',
		borderRadius: 5,
	},
	'button__container-action_remove': {
		backgroundColor: '#ADB3BC',
		justifyContent: 'center',
		alignItems: 'center',
	},
	'button__container-action_apply': {
		backgroundColor: '#63CDDA',
		justifyContent: 'center',
		alignItems: 'center',
	},
	'button__container-action__text': {
		fontFamily: 'Inter',
		fontSize: 25,
		lineHeight: 30,
		color: '#000',
	},
});
