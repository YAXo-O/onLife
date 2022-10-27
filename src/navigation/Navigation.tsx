import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthScreen } from '@app/screens/External/Auth/Auth';
import { withUser } from '@app/hooks/withUser';
import { MainScreen } from '@app/screens/Internal/MainScreen';

import { getOptions } from '@app/navigation/options';
import { Routes } from '@app/navigation/routes';
import { TrainingListScreen } from '@app/screens/Internal/TrainingListScreen';
import { TrainingScreen } from '@app/screens/Internal/TrainingScreen';
import { palette } from '@app/styles/palette';

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
		<SafeAreaView style={{ flex: 1, }}>
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
					options={getOptions('План тренировки')}
					component={TrainingListScreen}
				/>
				<NavigationStack.Screen
					name={Routes.Training}
					options={getOptions('Тренировка', true, palette.cyan['100'])}
					component={TrainingScreen}
				/>
			</NavigationStack.Navigator>
		</SafeAreaView>
	);
};

