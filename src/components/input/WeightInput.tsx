import * as React from 'react';
import {
	StyleProp,
	TextStyle,
	TextInput,
} from 'react-native';

import { WeightKeyboard } from '@app/components/keyboard/WeightKeyboard';

interface WeightInputProps {
	value?: number | undefined;
	onEnd?: (value?: number) => void;
	style?: StyleProp<TextStyle>;
	disabled?: boolean;
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
				console.log('Focused');
				WeightKeyboard.present(props.value);
				WeightKeyboard.listen = props.onEnd;
			}}
			showSoftInputOnFocus={false}
			selectionColor="transparent"

			editable={!props.disabled}
		/>
	);
}
