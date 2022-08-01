import * as React from 'react';
import { useSelector } from 'react-redux';
import {
	StyleSheet,
	View,
	ActivityIndicator,
	Text,
} from 'react-native';

import { IState } from '../store/IState';
import { ItemState } from '../store/ItemState/State';
import { User } from '../objects/User';
import { AuthScreen } from './Auth/Auth';
import { PrivateKeys } from '../services/Privacy/PrivateKeys';
import { usePrivateStorage } from '../usePrivateStorage';

interface OwnProps {
}

// This is the root view - it picks either inner or outer view for the app
export const MainScreen: React.FC<OwnProps> = (props: OwnProps) => {
	const session = usePrivateStorage(PrivateKeys.Session);
	const user = useSelector<IState, ItemState<User>>((state: IState) => state.user);

	if (session.loading) return <ActivityIndicator />;
	if (session.item === null) return <AuthScreen />;
	if (user.item === null) return <ActivityIndicator />;

	return (
		<View style={styles.container}>
			<Text style={styles.label}>
				Пользователь:
			</Text>
			<Text style={styles.text}>
				{user.item.firstName} {user.item.lastName}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: '16px',
	},
	label: {
		fontSize: 16,
		lineHeight: 20,
		fontWeight: 'bold',
	},
	text: {
		fontSize: 16,
		lineHeight: 20,
	},
});
