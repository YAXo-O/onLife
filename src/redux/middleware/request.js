import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Actions from '../actions';
// import { navigate } from '../../navigation';
import { setBearerToken, getProfile, registerPushToken } from '../action-creators'

const navigate = (route) => {};

const request = (store) => (next) => async (action) => {
  const profile = store.getState().profile.profile;
  const profile_id = profile ? profile.id : 0;

  if (typeof action.request === 'function') {
    const derivedAction = { ...action, request: null };

    try {
      let token = store.getState().auth.token;
      if (token === null) {
        // token is null, lets try to retrieve it from local storage
        token = await AsyncStorage.getItem('bearerToken');
        if (token) {
          store.dispatch(setBearerToken(token, true));
        }
      }

      store.dispatch({ ...derivedAction, type: Actions.request(action.type)});
      const result = await action.request({ ...action, token, profile_id });
      store.dispatch({ ...derivedAction, type: Actions.response(action.type), result, profile_id });

      next(action);
      return result;

    } catch (e) {
      console.log(`we actually threw: ${e.message}`);
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
    const derivedAction = { ...action, storeRequest: null };

    try {
      store.dispatch({ ...derivedAction, type: Actions.request(action.type)});
      const result = await action.storeRequest({ ...action });
      store.dispatch({ ...derivedAction, type: Actions.response(action.type), result });

      next(action);
      return result;

    } catch (e) {
      store.dispatch({ type: Actions.fail(action.type), error: e });
    }
  }

  if (action.type === Actions.response(Actions.CONFIRM_PHONE)) {
    store.dispatch(setBearerToken(action.result.token));
    const result = next(action);
    store.dispatch(getProfile());
    // navigate('DashboardScreen');
    navigate('NavigatorScreen');
  }

  if (action.type === Actions.SET_BEARER_TOKEN) {
    if (!action.local) {
      await AsyncStorage.setItem('bearerToken', action.token);
    }
  }

  if (action.type === Actions.response(Actions.GET_PROFILE) || action.type === Actions.SET_PUSH_TOKEN || action.type === Actions.SET_INITIAL_STATE) {
    const token = action.type === Actions.SET_PUSH_TOKEN ? { token: action.token, os: action.os } : store.getState().auth.pushToken;
    let user = store.getState().auth.user;
    if (action.type === Actions.response(Actions.GET_PROFILE)) {
      user = action.result.user;
    } else if (action.type === Actions.SET_INITIAL_STATE) {
      user = action.state.user;
    }

    if (user && token) {
      if (user.push_token !== token.token) {
        store.dispatch(registerPushToken(token.token, token.os));
      }
    }
  }

  return next(action);
}

export default request;
