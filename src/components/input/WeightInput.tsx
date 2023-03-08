import * as React from 'react';
import {
	StyleProp,
	TextStyle,
	TextInput,
} from 'react-native';

import { WeightKeyboard } from '@app/components/keyboard/WeightKeyboard';
import { palette } from '@app/styles/palette';

interface WeightInputProps {
	value?: number | undefined;
	onEnd?: (value?: number) => void;
	style?: StyleProp<TextStyle>;
	disabled?: boolean;
	placeholder?: string;
}

export const WeightInput: React.FC<WeightInputProps> = (props: WeightInputProps) => {
	return (
		<TextInput
			value={props.value?.toFixed(1)}
			onEndEditing={() => {
				WeightKeyboard.dismiss();
			}}
			keyboardType="numeric"
			style={props.style}
			onFocus={() => {
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
