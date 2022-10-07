import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { options } from '../../../components/navigation/Navigation';
import { Routes, names } from '../../../navigation';

import { TrainingSelect } from './TrainingSelect';
import { TrainingList } from './TrainingList';
import { withUser } from '../../../hooks/withUser';
import { IState } from '../../../store/IState';

const TrainingStack = createNativeStackNavigator();

interface LogOutProps {
	color: string;
}

const LogOut: React.FC<LogOutProps> = (props: LogOutProps) => {
	const { logOut, user } = withUser();
	const currentTraining = useSelector((state: IState) => state.training.item);

	const handler = () => {
		const day = currentTraining?.training?.days.find(day => day.programDayId === currentTraining?.day);
		const pDay = user?.trainingProgram?.days.find(day => day.id === currentTraining?.day);
		const pList = pDay?.exercises?.map(item => item.rounds).flat() ?? [];
		const list = day?.exercises?.map(item => item.rounds).flat() ?? [];
		const count = list.reduce((counter, cur) => Boolean(cur.time) ? counter + 1 : counter, 0);

		// pList.length !== list.length - some exercises of the day haven't been started yet
		// count !== list.length && count > 0 - some exercises have been started but not finished
		if (pList.length !== list.length && list.length > 0 || count !== list.length && count > 0) {
			Alert.alert(
				'Смена пользователя',
				'Все данные о незавершённой тренировке будут утеряны. Вы уверены, что хотите продолжить?',
				[
					{
						text: 'Отмена',
						style: 'cancel',
					},
					{
						text: 'Выйти',
						onPress: logOut,
					},
				],
			);
		} else {
			logOut();
		}
	};

	return (
		<TouchableOpacity onPress={handler}>
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
						headerBackVisible: true,
						headerLeftTitle: '',
					}}
					component={TrainingList}
				/>
			</TrainingStack.Navigator>
		</SafeAreaView>
	);
};
