import { StyleProp, TextStyle, TextInput, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import * as React from 'react';

import { palette } from '@app/styles/palette';

interface RepeatsInputProps {
	value?: number | undefined;
	onEnd?: (value?: number) => void;
	style?: StyleProp<TextStyle>;
	disabled?: boolean;
	placeholder?: string;
}

export const RepeatsInput: React.FC<RepeatsInputProps> = (props: RepeatsInputProps) => {
	const [value, setValue] = React.useState<string | undefined>(() => props.value?.toFixed(0));

	React.useEffect(() => {
		setValue(props.value?.toFixed(0))
	}, [props.value]);

	return (
		<TextInput
			value={value}
			onChange={(event: NativeSyntheticEvent<TextInputChangeEventData>) => setValue(event.nativeEvent.text)}
			onEndEditing={() => {
				if (!value) {
					props.onEnd?.(undefined);

					return;
				}

				const result = Number.parseInt(value);
				props.onEnd?.(result);

			}}

			keyboardType="numeric"
			style={props.style}

			placeholder={props.placeholder}
			placeholderTextColor={palette.white['20']}
			editable={!props.disabled}
		/>
	);
}
