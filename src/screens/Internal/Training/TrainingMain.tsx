import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { options, getOptions } from '../../../components/navigation/Navigation';
import { Routes, names } from '../../../navigation';

import { TrainingSelect } from './TrainingSelect';
import { TrainingList } from './TrainingList';
import { withUser } from '../../../hooks/withUser';

import LogOutImage from '../../../../assets/icons/logout.png';

const TrainingStack = createNativeStackNavigator();

const LogOut: React.FC = ({ color }: { color: string }) => {
	const { logOut } = withUser();

	return (
		<TouchableOpacity onPress={logOut}>
			<Image
				source={LogOutImage} style={{ width: 16, height: 16 }}
				tintColor={color}
			/>
		</TouchableOpacity>
	);
};

export const TrainingMain: React.FC = () => {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TrainingStack.Navigator>
				<TrainingStack.Screen
					name={Routes.TrainingSelect}
					options={{
						...options,
						title: names[Routes.TrainingSelect],
						headerRight: () => <LogOut color='rgba(255, 255, 255, 0.6)' />,
					}}
					component={TrainingSelect}
				/>
				<TrainingStack.Screen
					name={Routes.TrainingList}
					options={{
						...options,
						title: names[Routes.TrainingList],
						headerStyle: {
							backgroundColor: 'rgba(200, 200, 200, 1)',
						},
						headerTintColor: 'rgba(80, 80, 80, 1)',
						headerRight: () => <LogOut color='rgba(80, 80, 80, 1)' />,
					}}
					component={TrainingList}
				/>
			</TrainingStack.Navigator>
		</SafeAreaView>
	);
};
