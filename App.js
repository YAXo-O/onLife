import * as React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';

import {AppState, KeyboardAvoidingView, Linking, Platform} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { PersistGate } from 'redux-persist/integration/react';
import VersionCheck from 'react-native-version-check';

import * as Sentry from '@sentry/react-native';

import { store, persistor } from '@app/redux/store';
import AppNavigator from '@app/navigation/AppNavigator';
import AuthNavigator from '@app/navigation/AuthNavigator';
import { navigationRef } from '@app/navigation/RootNavigation';
import {
	notificationMessage,
	setPushToken,
	syncEverything,
	syncTrainingPrograms,
} from '@app/redux/action-creators';

import { sentryDsn } from './app.json';

//* Setup Firebase messaging */
async function backgroundHandler(message) {
	if (store) {
		store.dispatch(notificationMessage(message.data));
	}
}

messaging().setBackgroundMessageHandler(backgroundHandler);

/* Setup Sentry */
Sentry.init({
	dsn: sentryDsn,
});

/* Version Check */
VersionCheck.needUpdate()
	.then((res) => {
		if (res.isNeeded) {
			Linking.openURL(res.storeUrl);
		}
	});

const NavigationComponent = () => {
	const { token } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const appState = React.useRef(AppState.currentState);

	const handleAppState = React.useCallback(
		nextAppState => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				dispatch(syncEverything());
			}

			appState.current = nextAppState;
		},
		[appState, dispatch],
	);

	React.useEffect(() => {
		AppState.addEventListener('change', handleAppState);
		return () => AppState.removeEventListener('change', handleAppState);
	}, [handleAppState]);

	React.useEffect(() => {
		dispatch(syncTrainingPrograms());
	}, [dispatch]);

	React.useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			dispatch(notificationMessage(remoteMessage.data));
		});

		// Request permissions (required for ios)
		const authStatus = messaging().requestPermission();
		const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
			console.log('User has enabled push-notifications');

			messaging()
				.getToken()
				.then(newToken => {
					dispatch(setPushToken(newToken));
				});
		} else {
			console.log('Push notifications are disabled by user');
		}

		return unsubscribe;
	}, [dispatch]);

	if (token) {
		return <AppNavigator />;
	} else {
		return <AuthNavigator setIsLogin={false} />;
	}
};

export const App = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : null}
					style={{ flex: 1}}
				>
					<NavigationContainer ref={navigationRef}>
						<NavigationComponent />
					</NavigationContainer>
				</KeyboardAvoidingView>
			</PersistGate>
		</Provider>
	);
};

