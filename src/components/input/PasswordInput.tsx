import * as React from 'react';
import {
	View,
	TextInput,
	NativeSyntheticEvent,
	TextInputFocusEventData,
	TextStyle,
	StyleProp,
	Image, StyleSheet, TouchableOpacity,
} from 'react-native';

import Hide from '../../../assets/icons/hide.png';
import Show from '../../../assets/icons/show.png';

interface OwnProps {
	value: string;
	onChange?: (text: string) => void;
	onBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void);
	style?: StyleProp<TextStyle>;
}

export const PasswordInput: React.FC<OwnProps> = (props: OwnProps) => {
	const [secured, setSecured] = React.useState(true);

	return (
		<View style={{ position: 'relative' }}>
			<TextInput
				style={props.style}
				textContentType="password"
				secureTextEntry={secured}
				value={props.value}
				onChangeText={props.onChange}
				onBlur={props.onBlur}
			/>
			<TouchableOpacity style={styles.container} onPress={() => setSecured(state => !state)}>
				<Image tintColor="rgba(255, 255, 255, 0.4)" source={secured ? Show : Hide} style={{ width: 24, height: 24 }}  />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		height: '100%',
		padding: 4,
		right: 0,
		justifyContent: 'center',
	},
});
