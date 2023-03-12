import * as React from 'react';
import {
	StyleProp,
	TextStyle,
	TextInput,
	Keyboard,
} from 'react-native';
import uuid from 'react-native-uuid';

import { WeightKeyboard } from '@app/components/keyboard/WeightKeyboard';
import { palette } from '@app/styles/palette';
import { Nullable } from '@app/objects/utility/Nullable';

interface WeightInputProps {
	value?: number | undefined;
	onEnd?: (value?: number) => void;
	style?: StyleProp<TextStyle>;
	disabled?: boolean;
	placeholder?: string;
}

export const WeightInput: React.FC<WeightInputProps> = (props: WeightInputProps) => {
	const ref = React.useRef<boolean>(false);

	return (
		<TextInput
			value={props.value?.toFixed(1)}
			onEndEditing={() => {
				if (ref.current) {
					ref.current = false;
				} else {
					WeightKeyboard.dismiss();
				}
			}}
			keyboardType="numeric"
			style={props.style}
			onFocus={() => {
				ref.current = true;
				Keyboard.dismiss();

				WeightKeyboard.present(props.value);
				WeightKeyboard.listen = props.onEnd;
			}}
			showSoftInputOnFocus={false}
			selectionColor="transparent"

			placeholder={props.placeholder}
			placeholderTextColor={palette.white['20']}
			editable={!props.disabled}
		/>
	);
}
