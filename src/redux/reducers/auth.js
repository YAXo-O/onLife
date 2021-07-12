import * as Actions from '../actions';
import produce from 'immer';

const INITIAL_STATE = {
  token: null,
  pushToken: null,
  pushTokenSynced: null,
  challenge: '',
  loginLoading: false,
  loginErrors: {},
  loginMessage: null,
};

const authReducer = produce((draft, action) => {
  switch (action.type) {
    case 'LOGOUT':
      draft.token = null;
      break;

    case Actions.SET_BEARER_TOKEN:
      draft.token = action.token;
      break;

    case Actions.SET_PUSH_TOKEN:
      draft.pushToken = action.token;
      break;

    case Actions.response(Actions.REGISTER_PUSH_TOKEN):
      draft.pushTokenSynced = action.result.token;
      break;

    case Actions.request(Actions.LOGIN_PHONE):
      draft.loginLoading = true;
      draft.loginMessage = null;
      break;

    case Actions.fail(Actions.LOGIN_PHONE):
      draft.loginLoading = false;
      draft.loginErrors = action.data.errors || {};
      draft.loginMessage = action.data.message;
      break;

    case Actions.response(Actions.LOGIN_PHONE):
      draft.loginLoading = false;
      draft.loginErrors = {};
      draft.loginMessage = null;
      draft.challenge = action.result.challenge;
      break;

    case Actions.CHANGE_PHONE:
      draft.challenge = '';
      break;

    case Actions.request(Actions.CONFIRM_PHONE):
      draft.loginErrors = {};
      draft.loginLoading = true;
      draft.loginMessage = null;
      break;

    case Actions.fail(Actions.CONFIRM_PHONE):
      draft.loginErrors = action.data.errors || action.data;
      draft.loginLoading = false;
      break;

    case Actions.response(Actions.CONFIRM_PHONE):
      draft.loginLoading = false;
      draft.token = action.result.token;
      draft.loginMessage = null;
      draft.challenge = '';
      break;

    case Actions.CLEAR_AUTH_ERRORS:
      draft.remindPasswordErrors = {};
      draft.remindPasswordMessage = null;
      draft.loginPasswordErrors = {};
      draft.loginPasswordMessage = null;
      draft.registerPasswordErrors = {};
      draft.registerPasswordMessage = null;
      break;
  }
}, INITIAL_STATE);

export default authReducer;
