import * as React from 'react';
import {
	StyleSheet,
	ImageBackground,
	Text,
	View,
	Dimensions,
	StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@app/styles/palette';
import { TabView } from '@app/components/tabview';

import { SignIn } from '@app/screens/External/Auth/Tabs/SignIn';
import { SignUp } from '@app/screens/External/Auth/Tabs/SignUp';

import Background from '@assets/images/background.png';

const height = Dimensions.get('window').height;

export const AuthScreen: React.FC = () => {
	const [tab, setTab] = React.useState<string>('auth');

	return (
		<ImageBackground source={Background} style={{ height: height + (StatusBar.currentHeight ?? 0), }} resizeMode="cover">
			<SafeAreaView style={{ flex: 1 }}>
				<View style={[styles.row, { marginTop: 52, }]}>
					<Text style={styles.title}>
						<Text style={[styles.title, { color: palette.cyan['40'] }]}>ON</Text>
						<Text style={[styles.title, { color: palette.white['100'] }]}>LIFE</Text>
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<TabView
						value={tab}
						onChange={setTab}
						barStyle={styles.tabBar}
						containerStyle={styles.container}
						panStyle={{ flex: 1 }}
					>
						{
							[
								{
									key: 'auth',
									title: 'АВТОРИЗАЦИЯ',
									content: <SignIn style={styles.tabPane} />
								},
								{
									key: 'register',
									title: 'РЕГИСТРАЦИЯ',
									content: <SignUp style={styles.tabPane} />
								}
							]
						}
					</TabView>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	row: {
		width: '100%',
		paddingHorizontal: 0,
	},
	title: {
		fontFamily: 'AGaramondPro-Regular',
		fontSize: 48,
		lineHeight: 58,
		textAlign: 'center',
		marginBottom: 50,
	},
	container: {
		flex: 1,
	},
	tabBar: {
		paddingHorizontal: 40,
	},
	tabPane: {
		paddingTop: 50,
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
	}
});
