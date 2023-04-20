import * as React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { MainScreen } from '@app/screens/Internal/MainScreen';
import { ProfileMenuScreen } from '@app/screens/Internal/Profile/ProfileMenuScreen';
import { TrainingListScreen } from '@app/screens/Internal/TrainingListScreen';
import { TrainingViewScreen } from '@app/screens/Internal/TrainingViewScreen';

import { withUser } from '@app/hooks/withUser';
import { getOptions } from '@app/navigation/options';
import { Routes, CombinedScreenNavigationProps } from '@app/navigation/routes';
import { DeleteProfileScreen } from '@app/screens/Internal/Profile/DeleteProfileScreen';
import { TrainingScreen } from '@app/screens/Internal/Training/Training';
import { AuthByPhoneScreen } from '@app/screens/External/Auth/AuthByPhone';
import { AuthScreen } from '@app/screens/External/Auth/Auth';
import { hasValue } from '@app/utils/value';

type NavigationParams = Record<Routes, undefined>;
const NavigationStack = createNativeStackNavigator<NavigationParams>();

export const Navigation: React.FC = () => {
	const { session } = withUser();
	const navigation = useNavigation<CombinedScreenNavigationProps>();

	React.useEffect(() => {
		// TODO: navigation should be inside NavigationStack.Navigator (replacing stack action)
		if (hasValue(session)) {
			navigation.navigate(Routes.Main);
			// navigation.reset({
			// 	index: 0,
			// 	routes: [
			// 		{ name: Routes.Main },
			// 	],
			// });
		} else {
			navigation.navigate(Routes.AuthByLogin);
			// navigation.reset({
			// 	index: 0,
			// 	routes: [
			// 		{ name: Routes.AuthByLogin },
			// 	],
			// });
		}
	}, [session]);

	return (
		<View style={{ flex: 1, }}>
			<NavigationStack.Navigator>
				<NavigationStack.Screen
					name={Routes.AuthByLogin}
					options={{ headerShown: false, }}
					component={AuthScreen}
				/>
				<NavigationStack.Screen
					name={Routes.AuthByPhone}
					options={{ headerShown: false, }}
					component={AuthByPhoneScreen}
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
						...getOptions('Тренировка', true, 'transparent'),
						headerTintColor: '#fff',
						headerTransparent: true,
					}}
					component={TrainingScreen}
				/>
				<NavigationStack.Screen
					name={Routes.ProfileMenu}
					options={getOptions('Личный кабинет', true, '#F2F4F7', '#010101')}
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

