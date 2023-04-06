import React from 'react';
import {
	StatusBar,
	View,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist/es/types';
import { PersistGate } from 'redux-persist/integration/react';

import * as Sentry from '@sentry/react-native';

import { RootScreen } from '@app/screens/Root';
import { getStore, IState, getPersistor } from '@app/store/IState';
import { Timer } from '@app/components/timer/Timer';
import { WeightKeyboard } from '@app/components/keyboard/WeightKeyboard';
import { useLoader } from '@app/hooks/useLoader';
import { Spinner } from '@app/components/display/spinner/Spinner';
import { NotificationService } from '@app/services/Notifications';

// Initialize Sentry - this should happen as early as possible so that we can log all possible errors
Sentry.init({
	dsn: 'https://0696a7c64a68467ba36c46d843321e08@o376831.ingest.sentry.io/5947463',
});

// Store should never be changed - so it's ok to call getStore() and getPersistor() only once
const store: Store<IState> = getStore();
const persistor: Persistor = getPersistor();

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'transparent',
	},
};

const SpinnerHolder: React.FC = () => {
	const { loading } = useLoader();

	return <Spinner loading={loading} />;
};

const App = () => {
	console.log('App mounted');

	NotificationService.init()
		.then(() => console.log('NotificationService has been initialized'))
		.catch((error) => console.warn('NotificationService failed to initialize: ', error));

	return (
		<SafeAreaProvider>
			<NavigationContainer theme={theme}>
				<View style={styles.app}>
					<StatusBar
						barStyle="dark-content"
						backgroundColor="rgba(0, 0, 0, 0)"
						translucent
					/>
					<Provider store={store}>
						<PersistGate loading={<ActivityIndicator />} persistor={persistor}>
							<RootScreen />

							<Timer />
							<WeightKeyboard />

							<SpinnerHolder />
						</PersistGate>
					</Provider>
				</View>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	app: {
		flex: 1,
		backgroundColor: '#103152',
	},
});

// Wrap in Sentry to monitor touch events handling and performance
export default Sentry.wrap(App);
