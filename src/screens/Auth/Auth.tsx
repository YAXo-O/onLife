import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignInScreen } from './SignIn';
import { SignUpScreen } from './SignUp';
import { Routes, names } from '../../navigation';

interface OwnProps {
}

const AuthNavigation = createNativeStackNavigator();

export const AuthScreen: React.FC<OwnProps> = (props: OwnProps) => {
	return (
		<SafeAreaView style={{ flex: 1, }}>
			<AuthNavigation.Navigator
				initialRouteName="SignIn"
				screenOptions={{
					headerTitleAlign: 'center',
					gestureEnabled: false,
					headerTransparent: true,
					headerStyle: {
						backgroundColor: 'rgba(0, 0, 0, 0.15)',
					},
					headerTintColor: 'rgba(255, 255, 255, 0.6)',
					headerLeft: () => null,
				}}
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
