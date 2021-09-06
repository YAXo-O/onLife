import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Actions from '../actions';

import {
	setBearerToken,
	getProfile,
} from '../action-creators';

const navigate = (route) => {
};

const request = (store) => (next) => async (action) => {
	const profile = store.getState().profile.profile;
	const profile_id = profile ? profile.id : 0;

	if (typeof action.request === 'function') {
		const derivedAction = {...action, request: null};

		try {
			let token = store.getState().auth.token;
			if (token === null) {
				// token is null, lets try to retrieve it from local storage
				token = await AsyncStorage.getItem('bearerToken');
				if (token) {
					store.dispatch(setBearerToken(token, true));
				}
			}

			store.dispatch({...derivedAction, type: Actions.request(action.type)});
			const result = await action.request({...action, token, profile_id});
			store.dispatch({...derivedAction, type: Actions.response(action.type), result, profile_id});

			next(action);
			return result;

		} catch (e) {
			if (e.response) {
				if (e.response.status === 401) {
					navigate('LoginScreen');
				}
			}
			store.dispatch({
				type: Actions.fail(action.type),
				error: e,
				status: e.response.status,
				data: e.response.data || {},
			});
		}
	}

	if (action.profile_id === null) {
		action.profile_id = profile_id;
	}

	if (typeof action.storeRequest === 'function') {
		const derivedAction = {...action, storeRequest: null};

		try {
			store.dispatch({...derivedAction, type: Actions.request(action.type)});
			const result = await action.storeRequest({...action});
			store.dispatch({...derivedAction, type: Actions.response(action.type), result});

			next(action);
			return result;

		} catch (e) {
			store.dispatch({type: Actions.fail(action.type), error: e});
		}
	}

	if (action.type === Actions.response(Actions.CONFIRM_PHONE)) {
		store.dispatch(setBearerToken(action.result.token));
		const result = next(action);
		store.dispatch(getProfile());
		navigate('NavigatorScreen');
	}

	if (action.type === Actions.SET_BEARER_TOKEN) {
		if (!action.local) {
			await AsyncStorage.setItem('bearerToken', action.token);
		}
	}

	if (action.type === Actions.LOGOUT) {
		await AsyncStorage.removeItem('bearerToken');
	}

	return next(action);
};

export default request;
