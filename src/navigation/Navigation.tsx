import * as React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { AuthScreen } from '@app/screens/External/Auth/Auth';
import { MainScreen } from '@app/screens/Internal/MainScreen';
import { ProfileMenuScreen } from '@app/screens/Internal/Profile/ProfileMenuScreen';
import { TrainingListScreen } from '@app/screens/Internal/TrainingListScreen';
import { TrainingViewScreen } from '@app/screens/Internal/TrainingViewScreen';

import { withUser } from '@app/hooks/withUser';
import { getOptions } from '@app/navigation/options';
import { Routes } from '@app/navigation/routes';
import { DeleteProfileScreen } from '@app/screens/Internal/Profile/DeleteProfileScreen';
import { TrainingScreen } from '@app/screens/Internal/Training/Training';

const NavigationStack = createNativeStackNavigator();

export const Navigation: React.FC = () => {
	const { id } = withUser();
	const navigation = useNavigation();

	React.useEffect(() => {
		if (id !== null) {
			navigation.navigate(Routes.Main);
		} else {
			navigation.navigate(Routes.Auth);
		}
	}, [id]);

	return (
		<View style={{ flex: 1, }}>
			<NavigationStack.Navigator>
				<NavigationStack.Screen
					name={Routes.Auth}
					options={{ headerShown: false, }}
					component={AuthScreen}
				/>
				<NavigationStack.Screen
					name={Routes.Main}
					options={getOptions('Главная', false)}
					component={MainScreen}
				/>
				<NavigationStack.Screen
					name={Routes.TrainingList}
					options={getOptions('План тренировки', true, '#F2F4F7', '#010101')}
					component={TrainingListScreen}
				/>
				<NavigationStack.Screen
					name={Routes.TrainingView}
					options={getOptions('Тренировка', true, '#F2F4F7', '#010101')}
					component={TrainingViewScreen}
				/>
				<NavigationStack.Screen
					name={Routes.Training}
					options={{
						...getOptions('Тренировка', true, '#ff00000a'),
						headerTintColor: '#fff',
					}}
					component={TrainingScreen}
				/>
				<NavigationStack.Screen
					name={Routes.ProfileMenu}
					options={getOptions('Личный кабинет', true, '#F2F4F7', 'transparent')}
					component={ProfileMenuScreen}
				/>
				<NavigationStack.Screen
					name={Routes.ProfileDelete}
					options={getOptions('Удаление учётной записи', true, '#F2F4F7', '#010101')}
					component={DeleteProfileScreen}
				/>
			</NavigationStack.Navigator>
		</View>
	);
};

