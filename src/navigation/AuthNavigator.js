import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '@app/screens/Login';
import CodeScreen from '@app/screens/CodeScreen';

const Stack = createStackNavigator();

const AuthStack = (props, setIsLogin) => {
	return (
		<Stack.Navigator
			initialRouteName={'FitnessScreen'}
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
			}}>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{
					gestureEnabled: false,
				}}
			/>

			<Stack.Screen name="CodeScreen">
				{props => <CodeScreen {...props} setIsLogin={setIsLogin} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

const AuthNavigator = props => {
	const isLogin = props.setIsLogin;
	return (
		<Stack.Navigator
			initialRouteName={props.initialRouteName}
			screenOptions={{
				headerShown: false,
				gestureEnabled: false,
			}}>
			<Stack.Screen name="AuthStack">
				{props => AuthStack(props, isLogin)}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default AuthNavigator;
