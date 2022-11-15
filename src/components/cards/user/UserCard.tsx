import * as React from 'react';
import {
	ViewStyle,
	StyleProp,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { withUser } from '@app/hooks/withUser';
import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';
import { formatName, formatAge } from '@app/utils/formatting';
import { Routes } from '@app/navigation/routes';

import Dots from '@assets/icons/dots.svg';
import User from '@assets/icons/user.svg';

interface OwnProps {
	style?: StyleProp<ViewStyle>;
}
/*
const handleLogout = () => {
	Alert.alert(
		'Смена пользователя',
		'Вы уверены, что хотите сменить пользователя? Все насохранённые данные о тренировке будут утеряны.',
		[
			{
				text: 'Отмена',
				style: 'cancel',
			},
			{
				text: 'Сменить',
				onPress: user.logOut,
			},
		],
	);
};
const handleDelete = () => {
	Alert.alert('Удаление аккаунта',
		'Вы уверены, что хотите удалить аккаунт? Все данные о пользователе и тренировках будут утеряны.',
		[
			{
				text: 'Отмена',
				style: 'cancel',
			},
			{
				text: 'Удалить',
				onPress: () => removeUser().then(user.logOut)
			}
		]);
};
 */

export const UserCard: React.FC<OwnProps> = (props: OwnProps) => {
	const user = withUser();
	const navigation = useNavigation();

	return (
		<View style={[styles.container, props.style]} >
			<TouchableOpacity style={styles.row} onPress={() => navigation.navigate(Routes.ProfileMenu)}>
				<View style={[styles.avatar, { marginRight: 10 }]}>
					<User width={23} height={23} fillPrimary={palette.blue['20']} />
				</View>
				<Text style={[typography.cardTitle, styles.text]}>{formatName(user.user)}</Text>
				<View style={{ flex: 1 }} />
				<Dots width={18} height={4} fillPrimary={palette.white['100']} />
			</TouchableOpacity>
			<View style={[styles.row, { marginTop: 30 }]}>
				<View style={{flex: 1}} />
				<View style={styles.column}>
					<Text style={[typography.counter, styles.text]}>{formatAge(user.user)}</Text>
					<Text style={[typography.counterCaption, styles.text]}>Возраст</Text>
				</View>
				<View style={[styles.column, { borderLeftWidth: 2, borderRightWidth: 2, borderColor: palette.white['100'], borderStyle: 'solid' }]}>
					<Text style={[typography.counter, styles.text]}>{user.user?.weight ?? '-'}</Text>
					<Text style={[typography.counterCaption, styles.text]}>Вес</Text>
				</View>
				<View style={styles.column}>
					<Text style={[typography.counter, styles.text]}>{user.user?.height ?? '-'}</Text>
					<Text style={[typography.counterCaption, styles.text]}>Рост</Text>
				</View>
				<View style={{flex: 1}}  />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: palette.cyan['40'],
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		paddingHorizontal: 20,
		paddingTop: 15,
		paddingBottom: 25,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	column: {
		flexDirection: 'column',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	avatar: {
		width: 35,
		height: 35,
		borderRadius: 17,
		backgroundColor: palette.white['60'],
		alignItems: 'center',
		justifyContent: 'center',
		padding: 6,
	},
	text: {
		color: palette.white['100'],
	},
});
