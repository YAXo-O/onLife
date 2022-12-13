import * as React from 'react';
import {
	Modal,
	View,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import { palette } from '@app/styles/palette';

export enum ActionModalType {
	Floating = 0,
	Docked = 1,
}

interface OwnProps {
	children?: React.ReactNode;
	visible: boolean;
	onChange: (visible: boolean) => void;
	type?: ActionModalType;
}

export const ActionModal: React.FC<OwnProps> = (props: OwnProps) => {
	return (
		<Modal
			visible={props.visible}
			onRequestClose={() => props.onChange(false)}
			animationType="fade"
			transparent
		>
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => props.onChange(false)}
					style={styles['dismiss-container']}
				/>
				<View style={[styles.card, props.type === ActionModalType.Docked ? styles.docked : styles.floating]}>
					{props.children}
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 32,
	},
	'dismiss-container': {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
	card: {
		backgroundColor: palette.white['100'],
		paddingHorizontal: 25,
		paddingVertical: 30,
	},
	floating: {
		borderRadius: 15,
	},
	docked: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
});
