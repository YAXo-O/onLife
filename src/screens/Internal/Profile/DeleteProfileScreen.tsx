import * as React from 'react';
import { View, Text, StyleSheet, } from 'react-native';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';
import { PasswordInput } from '@app/components/input/PasswordInput';
import { ActionButton, ActionType } from '@app/components/buttons/ActionButton';
import { NotificationCard } from '@app/components/notifications/NotificationCard';

export const DeleteProfileScreen: React.FC = () => {
	const [password, setPassword] = React.useState<string>(() => '');
	return (
		<View style={styles.screen}>
			<View style={styles.headerContainer}>
				<Text style={[typography.header, styles.text]}>Удалить учётную запись</Text>
			</View>
			<View style={styles.textContainer}>
				<Text style={[typography.text, styles.text]}>
					Вы собираетесь удалить свою учетную запись.
					Связанные с учетной записью данные будут удалены без возможности восстановления.
					Если вы подтверждаете удаление своей учетной записи, введите свой пароль.
				</Text>
			</View>
			<View style={styles.inputContainer}>
				<Text style={[typography.text, styles.text]}>Введите пароль</Text>
				<PasswordInput
					value={password}
					onChange={setPassword}
					style={styles.input}
					tint={palette.blue['0']}
					placeholder="Текущий пароль"
					placeholderTextColor="#D0D5DD"
				/>
			</View>
			<View style={styles.actionContainer}>
				<ActionButton
					text="Удалить"
					onPress={() => console.log('Удалить')}
					style={{ flex: 1 }}
				/>
				<View style={{ width: 23 }} />
				<ActionButton
					text="Отмена"
					onPress={() => console.log('Удалить')}
					style={{ flex: 1 }}
					type={ActionType.Secondary}
				/>
			</View>
			<NotificationCard
				text={null}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: palette.white['100'],
	},
	headerContainer: {
		height: 45,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 30,
		marginTop: 60,
	},
	textContainer: {
		marginHorizontal: 30,
		marginTop: 13,
	},
	text: {
		color: palette.blue['0'],
	},
	inputContainer: {
		marginHorizontal: 30,
		marginTop: 25,
	},
	input: {
		paddingVertical: 10,
		paddingHorizontal: 0,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: '#D0D5DD',
		color: palette.blue['0'],
		height: 45,
	},
	actionContainer: {
		marginVertical: 35,
		marginHorizontal: 30,
		flexDirection: 'row',
		height: 50,
	}
});
