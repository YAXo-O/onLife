import * as React from 'react';
import {
	FlatList,
	View,
	ListRenderItemInfo,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { palette } from '@app/styles/palette';
import { typography } from '@app/styles/typography';
import { formatName } from '@app/utils/formatting';
import { Routes } from '@app/navigation/routes';
import { withUser } from '@app/hooks/withUser';

import ChevronRight from '@assets/icons/chevron-right.svg';
import Key from '@assets/icons/key.svg';
import Trash from '@assets/icons/trash.svg';
import Edit from '@assets/icons/edit.svg';
import Exit from '@assets/icons/exit.svg';
import User from '@assets/icons/user.svg';
import { ActionModal } from '@app/components/modals/action/ActionModal';
import { LogoutModal } from '@app/components/modals/action/LogoutModal';

interface ListItem {
	id: number;
	icon: React.ReactElement;
	title: string;
	action?: () => void;
}

interface HeaderProps {
	title: string;
}

function getItems(
	navigate: (route: Routes) => void,
	showLogout: (visible: boolean) => void,
): Array<ListItem> {
	return [
		{
			id: 0,
			title: 'Редактировать профиль',
			icon: <Edit fillPrimary={palette.cyan['40']} />,
		},
		{
			id: 1,
			title: 'Изменить пароль',
			icon: <Key fillPrimary={palette.cyan['40']} />,
		},
		{
			id: 2,
			title: 'Удалить учётную запись',
			icon: <Trash fillPrimary={palette.cyan['40']} />,
			action: () => navigate(Routes.ProfileDelete),
		},
		{
			id: 3,
			title: 'Выйти',
			icon: <Exit fillPrimary={palette.cyan['40']} />,
			action: () => showLogout(true),
		},
	];
}

const ProfileMenuItem: React.FC<ListItem> = (props: ListItem) => {
	return (
		<TouchableOpacity style={styles.item} onPress={props?.action}>
			<View style={styles.icon}>
				{props.icon}
			</View>
			<Text style={[typography.text, styles.text]}>
				{props.title}
			</Text>
			<View style={{ flex: 1 }} />
			<ChevronRight width={12} height={24} fillPrimary={palette.cyan['40']} />
		</TouchableOpacity>
	);
};

const Separator: React.FC = () => <View style={styles.separator} />;

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
	return (
		<View style={styles.header}>
			<View style={styles.avatar}>
				<User width={23} height={23} fillPrimary={palette.blue['20']} />
			</View>
			<Text style={[typography.cardTitle, styles.text, { marginLeft: 10 }]}>{props.title}</Text>
		</View>
	);
}

export const ProfileMenuScreen: React.FC = () => {
	const [visible, setVisible] = React.useState(() => false);
	const { user } = withUser();
	const { navigate } = useNavigation();

	const render = ({ item }: ListRenderItemInfo<ListItem>) => {
		return (
			<ProfileMenuItem
				id={item.id}
				icon={item.icon}
				title={item.title}
				action={item.action}
			/>
		);
	};

	return (
		<View style={styles.screen}>
			<FlatList
				data={getItems(navigate, setVisible)}
				keyExtractor={item => item.id.toFixed()}
				renderItem={render}
				style={styles.list}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={<Header title={formatName(user)} />}
			/>
			<LogoutModal
				visible={visible}
				onChange={() => setVisible(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: palette.white['100'],
	},
	list: {
		marginVertical: 20,
		marginLeft: 10,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 45,
		paddingRight: 10,
	},
	icon: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: palette.blue['0'],
	},
	separator: {
		height: 2,
		marginLeft: 45,
		backgroundColor: '#F5F5F5',
	},
	header: {
		flexDirection: 'row',
		marginBottom: 20,
		marginLeft: 10,
		alignItems: 'center',
	},
	avatar: {
		width: 35,
		height: 35,
		borderRadius: 17,
		backgroundColor: palette.white['60'],
		alignItems: 'center',
		justifyContent: 'center',
	},
});
