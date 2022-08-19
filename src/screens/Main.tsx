import * as React from 'react';
import { useSelector } from 'react-redux';
import {
	ImageBackground,
	Text,
} from 'react-native';

import { IState } from '../store/IState';
import { ItemState } from '../store/ItemState/State';
import { User } from '../objects/User';
import { AuthScreen } from './Auth/Auth';
import { PrivateKeys } from '../services/Privacy/PrivateKeys';
import { usePrivateStorage } from '../usePrivateStorage';
import { formStyles } from './Auth/FormStyle';
import { Spinner } from '../components/spinner/Spinner';

import Background from '../../assets/images/background.png';

interface OwnProps {
}

// This is the root view - it picks either inner or outer view for the app
export const MainScreen: React.FC<OwnProps> = (props: OwnProps) => {
	const session = usePrivateStorage(PrivateKeys.Session);
	const user = useSelector<IState, ItemState<User>>((state: IState) => state.user);
	const loading = Boolean(session.loading || session.item && !user.item);

	if (!session.item && !loading) {
		return (
			<ImageBackground source={Background} style={formStyles.background}>
				<AuthScreen />
			</ImageBackground>
		);
	}

	return (
		<ImageBackground source={Background} style={formStyles.background}>
			<Spinner loading={loading} />
		</ImageBackground>
	);
};

