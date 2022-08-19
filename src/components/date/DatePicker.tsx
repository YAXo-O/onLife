import * as React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ViewStyle,
	StyleProp, TextStyle,
} from "react-native";
import RNDatePicker from 'react-native-date-picker';

import { Nullable } from '../../objects/utility/Nullable';
import { format } from '../../utils/datetime';

interface OwnProps {
	value: Nullable<number>;
	onChange: (value: number) => void;

	caption?: string;
	title?: string;

	containerStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
}

export const DatePicker: React.FC<OwnProps> = (props: OwnProps) => {
	const [visible, setVisible] = React.useState(() => false);
	const value = props.value ? new Date(props.value) : new Date();
	const caption = props.value ? format(props.value) : props.caption!;

	return (
		<View>
			<TouchableOpacity
				onPress={() => setVisible(true)}
				style={props.containerStyle}
			>
				<Text style={props.textStyle}>{caption}</Text>
			</TouchableOpacity>
			<RNDatePicker
				modal
				open={visible}
				date={value}
				mode="date"
				onConfirm={(date: Date) => {
					props.onChange(+date);
					setVisible(false);
				}}
				onCancel={() => {
					setVisible(false);
				}}
				title={props.title!}
				confirmText="Выбрать"
				cancelText="Отменить"
			/>
		</View>
	);
}

DatePicker.defaultProps = {
	caption: 'Выбрать',
	title: 'Выберите дату',
};
