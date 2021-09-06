import React from 'react';
import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import FitnessDashboard from '@app/screens/Fitness/FitnessDasboard';
import TrainFitness from '@app/screens/Fitness/TrainFitness';

import FitnessIcon from '@app/assets/NavIcons/fitnes.svg';
import FitnessUnactiveIcon from '@app/assets/NavIcons/fitnesUnactive.svg';
import EditStats from '@app/screens/Fitness/components/subTabs/EditStats';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function FitnessStack() {
	return (
		<Stack.Navigator
			initialRouteName={'FitnessScreen'}
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
			}}>
			<Stack.Screen
				name="ViewScreen"
				component={FitnessDashboard}
				options={{
					gestureEnabled: false,
				}}
			/>
			<Stack.Screen
				name="TrainFitness"
				component={TrainFitness}
				options={{
					gestureEnabled: false,
				}}
			/>
			<Stack.Screen
				name="EditStats"
				component={EditStats}
				options={{
					gestureEnabled: false,
				}}
			/>
		</Stack.Navigator>
	);
}

function BgTabBar({state, descriptors, navigation}) {
	return (
		<ImageBackground
			source={require('../assets/formTab/menu-bg.png')}
			style={styles.bgImage}>
			{state.routes.map((route, index) => {
				const {options} = descriptors[route.key];
				const label =
          options.tabBarLabel !== undefined
          	? options.tabBarLabel
          	: options.title !== undefined
          		? options.title
          		: route.name;
				const tabIcon = options.tabBarIcon;
				const isFocused = state.index === index;
				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				};

				return index == 2 ? (
					<View style={styles.tabStyleTop} key={route.name}>
						<TouchableOpacity
							accessibilityRole="button"
							accessibilityState={isFocused ? {selected: true} : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							testID={options.tabBarTestID}
							onPress={onPress}
							onLongPress={onLongPress}
							style={styles.tabCentered}>
							{tabIcon}
						</TouchableOpacity>
						<Text
							style={{
								top: 5,
								fontSize: 12,
								color: isFocused ? '#283933' : '#BCC3CC',
							}}>
							{label}
						</Text>
					</View>
				) : (
					<TouchableOpacity
						key={route.name}
						accessibilityRole="button"
						accessibilityState={isFocused ? {selected: true} : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={styles.tabStyle}>
						{!isFocused && <Text style={styles.tabIcon}> {tabIcon[0]}</Text>}
						{isFocused && <Text style={styles.tabIcon}> {tabIcon[1]}</Text>}
						<Text
							style={{
								top: 11,
								fontSize: 12,
								fontFamily: 'FuturaPT-Medium',
								fontWeight: '500',
								color: isFocused ? '#000000' : '#BCC3CC',
							}}>
							{label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	bgImage: {
		width: '100%',
		flex: 1,
		resizeMode: 'contain',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		bottom: 0,
		position: 'absolute',
		height: 110,
	},
	tabStyle: {
		top: 15,
		flex: 1,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabIcon: {
		height: 20,
	},
	tabStyleTop: {
		flex: 1,
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabCentered: {
		width: 63,
		height: 63,
		shadowColor: 'rgba(0, 0, 0, 0.22)',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16,
		elevation: 24,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderRadius: 100,
		bottom: 10,
	},
});

function BottomTabs() {
	return (
		<Tab.Navigator
			tabBar={props => <BgTabBar {...props} />}
			initialRouteName={'Dashboard'}
			activeColor="#616D78"
			inactiveColor="rgba(97, 109, 120, 0.6)"
			tabBarOptions={{
				showIcon: true,
				activeTintColor: '#283933',
				inactiveTintColor: '#BCC3CC',

				tabStyle: {
					marginTop: 13,
					height: 50,
				},
				labelStyle: {
					fontSize: 13,
				},
				style: {
					height: 86,
					bottom: 0,
					opacity: 0.5,
					elevation: 0,
					borderTopWidth: 0,
				},
			}}
			shifting={false}>
			<Tab.Screen
				name="Fitness"
				component={FitnessStack}
				options={{
					tabBarLabel: 'Фитнес',
					tabBarIcon: [<FitnessUnactiveIcon />, <FitnessIcon />],
				}}
			/>
		</Tab.Navigator>
	);
}

const AppNavigator = props => {
	return (
		<Stack.Navigator
			initialRouteName={props.initialRouteName}
			screenOptions={{
				headerShown: false,
				gestureEnabled: false,
			}}>
			<Stack.Screen name="MainStack" component={BottomTabs} />
		</Stack.Navigator>
	);
};

export default AppNavigator;
