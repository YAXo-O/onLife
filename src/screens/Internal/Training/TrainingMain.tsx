import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Image, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { options } from '../../../components/navigation/Navigation';
import { Routes, names } from '../../../navigation';

import { TrainingSelect } from './TrainingSelect';
import { TrainingList } from './TrainingList';
import { withUser } from '../../../hooks/withUser';

const TrainingStack = createNativeStackNavigator();

interface LogOutProps {
	color: string;
}

const LogOut: React.FC<LogOutProps> = (props: LogOutProps) => {
	const { logOut } = withUser();

	return (
		<TouchableOpacity onPress={logOut}>
			<Text style={{ color: props.color }}>Выйти</Text>
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
