import * as Actions from '../actions';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { dateParsed } from '../../utils';

const INITIAL_STATE = {
  user: null,
  profile: null,
  profileSync: {},
  profiles: null,
  trainer: null,
  profileLoading: false,
  profileErrors: {},
  profileMessage: null,
  photos: null,
  loading: false,
  loadErrors: {},
  notifications: null,
  notificationKey: null,
};

const profileReducer = produce((draft, action) => {
  switch (action.type) {
    case 'LOGOUT':
      draft.profile = null;
      break;

    case Actions.request(Actions.GET_USER):
      console.log('GETTING PROFILES');
      break;

    case Actions.fail(Actions.GET_USER):
      console.log('failed at PROFILES');
      break;

    case Actions.response(Actions.GET_USER):
      console.log('got profiles');
      draft.profiles = action.result.profiles;
      break;

    case Actions.SET_ACTIVE_PROFILE:
      draft.profile = action.profile;
      break;

    case Actions.request(Actions.GET_PROFILE):
      draft.profileLoading = true;
      break;

    case Actions.fail(Actions.GET_PROFILE):
      draft.profileLoading = false;
      draft.profileErrors = action.data.errors || {};
      draft.profileMessage = action.data.message;
      break;

    case Actions.response(Actions.GET_PROFILE):
      draft.profileLoading = false;
      draft.profileErrors = {};
      if (action.result.profile) draft.profile = action.result.profile;
      if (action.result.trainer) draft.trainer = action.result.trainer;
      if (action.result.user) draft.user = action.result.user;
      if (action.result.photos) draft.photos = action.result.photos;
      if (action.result.notification_key) draft.notificationKey = action.result.notification_key;
      break;

    case Actions.UPDATE_PROFILE_VALUE:
      const { values } = action;
      if (!draft.profileSync) draft.profileSync = {};

      Object.keys(values).forEach((key) => {
        draft.profile[key] = values[key];
        draft.profileSync[key] = values[key];
      });
      break;

    case Actions.UPLOAD_PROFILE_VALUES:
      draft.profileLoading = true;
      draft.profileLoading = false;
      draft.profileErrors = {};
      break;

    case Actions.fail(Actions.UPLOAD_PROFILE_VALUES):
      console.log('UPDATE PROFILE FAILED');
      console.log(action);
      break;

    case Actions.response(Actions.UPLOAD_PROFILE_VALUES):
      console.log('GOT NEW PROFILE');
      console.log(action.result.profile)
      draft.profileSync = {};
      Object.keys(action.result.profile).forEach((key) => {
        draft.profile[key] = action.result.profile[key];
      });
      break;

    case Actions.SET_INITIAL_STATE:
      if (action.state.profile) draft.profile = action.state.profile;
      if (action.state.trainer) draft.trainer = action.state.trainer;
      if (action.state.user) draft.user = action.state.user;
      break;

    case Actions.request(Actions.GET_PHOTOS):
      draft.loading = true;
      draft.loadErrors = {};
      break;

    case Actions.fail(Actions.GET_PHOTOS):
      draft.loading = false;
      draft.loadErrors = action.data.errors || {};
      break;

    case Actions.response(Actions.GET_PHOTOS):
      draft.photos = action.result.photos;
      draft.loading = false;
      break;

    case Actions.response(Actions.UPLOAD_PHOTOS):
      if (action.result.photos) {
        draft.photos = action.result.photos;
      }
      break;

    case Actions.request(Actions.DELETE_PHOTO):
      draft.loading = true;
      draft.loadErrors = {};
      break;

    case Actions.fail(Actions.DELETE_PHOTO):
      draft.loading = false;
      draft.loadErrors = action.data.errors || {};
      draft.loadingMessage = action.data.message;
      break;

    case Actions.response(Actions.DELETE_PHOTO):
      console.log(action.result);
      draft.loading = false;
      draft.photos = draft.photos.filter((item) => item.id != action.id);
      break;


    case Actions.request(Actions.GET_NOTIFICATIONS):
      draft.loading = true;
      draft.loadErrors = {};
      draft.loadingMessage = null;
      break;

    case Actions.response(Actions.GET_NOTIFICATIONS):
      console.log('GTO NOTIFI');
      console.log(action.result.notifications);
      draft.notifications = action.result.notifications; // REPLACE TO merge
      console.log('i done updating');
      break;

    case Actions.ADD_NOTIFICATION:
      if (draft.notifications === null) draft.notifications = [];
      const message = {...action.notification, synced: false};
      if (!message.id) message.id = uuidv4();
      if (!message.created_at) message.created_at = dateParsed('%Y-%M-%D%T%H:%I:%S', new Date()),
      draft.notifications.push(message);
      break;

    case Actions.response(Actions.SYNC_NOTIFICATIONS):
      console.log('SYNC NOTIFICATONS requested');
      draft.notifications = action.notifications;
      break;

    case Actions.NOTIFICATION_MESSAGE:
      console.log('got notification message');
      console.log(action.message);
      const { type, notification } = action.message;
      console.log(`type was ${type}`);
      if (type === 'notification') {
        if (!draft.notifications) draft.notifications = [];
        const pos = draft.notifications.findIndex((item) => item.id == notification.id);
        console.log(`pos was ${pos}`);
        if (pos === -1) {
          draft.notifications.push({...notification, synced: true});
        } else {
          draft.notifications.splice(pos, 1, {...notification, synced: true});
        }
      }

      break;
  }

}, INITIAL_STATE);

export default profileReducer;
