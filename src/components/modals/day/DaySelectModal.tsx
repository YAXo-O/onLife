import * as React from 'react';
import {
	View,
	Modal, StyleSheet,
} from 'react-native';
import { palette } from '@app/styles/palette';

interface OwnProps {
	visible: boolean;
	value: string | undefined;
	onChange: (value: string) => void;
	onClose: () => void;
}

export const DaySelectModal: React.FC<OwnProps> = (props: OwnProps) => {
	return (
		<Modal
			visible={props.visible}
			animationType="fade"
			onRequestClose={props.onClose}
			transparent
		>
			<View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: palette.cyan['20'],
	}
});
