import * as React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

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
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		paddingHorizontal: 32,
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
