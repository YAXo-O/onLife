import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SignInScreen } from './SignIn';
import { SignUpScreen } from './SignUp';
import { Routes, names } from '../../../navigation';
import { options } from '../../../components/navigation/Navigation';

const AuthNavigation = createNativeStackNavigator();

export const AuthScreen: React.FC = () => {
	return (
		<SafeAreaView style={{ flex: 1, }}>
			<AuthNavigation.Navigator
				initialRouteName="SignIn"
				screenOptions={options}
			>
				<AuthNavigation.Screen
					name={Routes.SignIn}
					options={{ title: names[Routes.SignIn] }}
					component={SignInScreen}
				/>
				<AuthNavigation.Screen
					name={Routes.SignUp}
					options={{ title: names[Routes.SignUp] }}
					component={SignUpScreen}
				/>
			</AuthNavigation.Navigator>
		</SafeAreaView>
	);
};
