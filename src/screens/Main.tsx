import * as React from 'react';
import { ImageBackground } from 'react-native';

import { AuthScreen } from './External/Auth/Auth';
import { formStyles } from './External/Auth/FormStyle';
import { Spinner } from '../components/spinner/Spinner';
import { TrainingMain } from './Internal/Training/TrainingMain';

import { withUser } from '../hooks/withUser';

import Background from '../../assets/images/background.png';

interface OwnProps {
}

// This is the root view - it picks either inner or outer view for the app
export const MainScreen: React.FC<OwnProps> = (props: OwnProps) => {
	const info = withUser();

	if (!info.user && !info.loading) {
		return (
			<ImageBackground source={Background} style={formStyles.background}>
				<AuthScreen />
			</ImageBackground>
		);
	}

	return (
		<ImageBackground source={Background} style={formStyles.background}>
			<Spinner loading={info.loading} />
			<TrainingMain />
		</ImageBackground>
	);
};

