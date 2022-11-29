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

import { RootScreen } from '@app/screens/Root';
import { getStore, IState, getPersistor } from '@app/store/IState';
import { Timer } from '@app/components/timer/Timer';
import { WeightKeyboard } from '@app/components/keyboard/WeightKeyboard';
import { useLoader } from '@app/hooks/useLoader';
import { Spinner } from '@app/components/display/spinner/Spinner';

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

const App = () => (
	<SafeAreaProvider>
		<View style={styles.app}>
			<NavigationContainer theme={theme}>
				<StatusBar barStyle="dark-content" />
				<Provider store={store}>
					<PersistGate loading={<ActivityIndicator />} persistor={persistor}>
						<RootScreen />

						<Timer />
						<WeightKeyboard />

						<SpinnerHolder />
					</PersistGate>
				</Provider>
			</NavigationContainer>
		</View>
	</SafeAreaProvider>
);

const styles = StyleSheet.create({
	app: {
		flex: 1,
		backgroundColor: '#103152',
	},
});

export default App;
