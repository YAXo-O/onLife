import * as React from 'react';
import { StyleSheet, Text, View, } from 'react-native';

import { ActionModal } from '@app/components/modals/action/ActionModal';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';

import Attention from '@assets/icons/attention.svg';
import { ActionButton, ActionType } from '@app/components/buttons/ActionButton';
import { withUser } from '@app/hooks/withUser';

interface OwnProps {
	visible: boolean;
	onChange: (visible: boolean) => void;
}

export const LogoutModal: React.FC<OwnProps> = (props: OwnProps) =>  {
	const { logOut } = withUser();

	return (
		<ActionModal
			visible={props.visible}
			onChange={props.onChange}
		>
			<View style={styles.container} >
				<View style={styles.icon}>
					<Attention />
				</View>
				<View style={styles.titleContainer}>
					<Text style={[typography.modalTitle, styles.text]}>
						Подтверждение
					</Text>
				</View>
				<View style={styles.textContainer}>
					<Text style={[typography.text, styles.text, { lineHeight: 20 }]}>
						Вы действительно хотите выйти из Onlife?
					</Text>
				</View>
				<View style={styles.actionContainer}>
					<ActionButton
						style={{ width: 64 }}
						text="Нет"
						onPress={() => props.onChange(false)}
						type={ActionType.Secondary}
					/>
					<View style={{ width: 15 }} />
					<ActionButton
						style={{ width: 64 }}
						text="Да"
						onPress={logOut}
					/>
				</View>
			</View>
		</ActionModal>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	icon: {
		width: 96,
		height: 96,
		backgroundColor: 'rgba(255, 51, 51, 0.12)',
		borderRadius: 48,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleContainer: {
		marginTop: 20,
	},
	text: {
		color: palette.blue['0'],
		textAlign: 'center',
	},
	textContainer: {
		marginTop: 8,
	},
	actionContainer: {
		marginTop: 24,
		flexDirection: 'row',
	}
});
