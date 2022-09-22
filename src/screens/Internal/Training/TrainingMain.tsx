import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { options } from '../../../components/navigation/Navigation';
import { Routes, names } from '../../../navigation';

import { TrainingSelect } from './TrainingSelect';
import { TrainingList } from './TrainingList';
import { withUser } from '../../../hooks/withUser';

import LogOutImage from '../../../../assets/icons/logout.png';

const TrainingStack = createNativeStackNavigator();

const LogOut: React.FC = () => {
	const { logOut } = withUser();

	return (
		<TouchableOpacity onPress={logOut}>
			<Image
				source={LogOutImage} style={{ width: 16, height: 16 }}
				tintColor="rgba(255, 255, 255, 0.6)"
			/>
		</TouchableOpacity>
	);
};

export const TrainingMain: React.FC = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TrainingStack.Navigator
				screenOptions={{ ...options, headerRight: LogOut }}
			>
				<TrainingStack.Screen
					name={Routes.TrainingSelect}
					options={{ title: names[Routes.TrainingSelect] }}
					component={TrainingSelect}
				/>
				<TrainingStack.Screen
					name={Routes.TrainingList}
					options={{ title: names[Routes.TrainingList] }}
					component={TrainingList}
				/>
			</TrainingStack.Navigator>
		</SafeAreaView>
	);
};
