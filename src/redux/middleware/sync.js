import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Actions from '../actions';
import { getTrainingPrograms, registerPushToken, syncTrainingPrograms, uploadProfileValues } from '../action-creators'
// import { TRAINING_SESSION_ACTIVE } from '../../constants/statuses'
import {
  getMeasurements,
  uploadMeasurements,
  getTrainingSessions,
  uploadTrainingSessions,
  getNotifications,
  uploadNotifications,
} from '../../api/requests';

const storageUserKey = 'dataUser';
const storageProfileKey = 'dataProfile';
const storageTrainerKey = 'dataTrainer';
const storagePhotosKey = 'dataPhotos';
const storageSessionKey = 'dataSession';

const createTablePrograms = () => {
  return `CREATE TABLE programs (id INTEGER PRIMARY KEY, name VARCHAR(255), program MEDIUMTEXT)`;
}

const syncUser = async (store, user) => {
  await AsyncStorage.setItem(storageUserKey, JSON.stringify(user));
}

/*
const syncProfile = async (store, profile) => {
  await AsyncStorage.setItem(storageProfileKey, JSON.stringify(profile));
}
*/
const syncTrainer = async (store, profile) => {
  await AsyncStorage.setItem(storageTrainerKey, JSON.stringify(profile));
};

const syncSession = async (store, session) => {
  // how about we keep current session in local storage

  await AsyncStorage.setItem(storageSessionKey, JSON.stringify(session));
}

const syncPhotos = async (store, photos) => {
  await AsyncStorage.setItem(storagePhotosKey, JSON.stringify(photos));
}

const loadProfile = async () => {
  const profile = await AsyncStorage.getItem(storageProfileKey);
  return profile ? JSON.parse(profile) : null;
}

const loadUser = async () => {
  const user = await AsyncStorage.getItem(storageUserKey);
  return user ? JSON.parse(user) : null;
}

const loadTrainer = async () => {
  const trainer = await AsyncStorage.getItem(storageTrainerKey);
  return trainer ? JSON.parse(trainer) : null;
}

const loadPhotos = async () => {
  const photos = await AsyncStorage.getItem(storagePhotosKey);
  return photos ? JSON.parse(photos) : null;
}

const loadInitialState = async (store) => {
  const state = {
    user: await loadUser(),
    profile: await loadProfile(),
    programs: await loadPrograms(),
    trainer: await loadTrainer(),
    session: await loadSession(),
    photos: await loadPhotos(),
  }

  store.dispatch({ type: Actions.SET_INITIAL_STATE, state });
}

const loadSession = async () => {
  const session = await AsyncStorage.getItem(storageSessionKey);
  return session ? JSON.parse(session) : null;
};

const uploadSessions = async (store) => {
  console.log('here i upload stuff');
};

const uploadEverything = (store) => {
  uploadSessions(store);
};

const syncRequestParams = (store) => ({
  token: store.getState().auth.token,
  profile_id: store.getState().profile.profile && store.getState().profile.profile.id ? store.getState().profile.profile.id : 0, // lol ok ugly
});

const syncMeasurements = async (store, sendOnly) => {
  const params = syncRequestParams(store);

  try {
    const localMeasurements = (store.getState().measurements.myMeasurements || []).concat().filter((item) => item.id);
    const localMap = {};
    localMeasurements.forEach((m, index) => localMap[m.id] = index);

    if (!sendOnly) {
      const serverMeasurements = await getMeasurements(params);
      const syncedRecords = {};
      for (const sm of serverMeasurements.measurements) {
        if (typeof localMap[sm.id] === 'undefined') {
          // new item from server, lets append
          localMap[sm.id] = localMeasurements.length;
          localMeasurements.push({...sm, synced: true});
          syncedRecords[sm.id] = true;
          console.log(`new record found ${sm.id}, ${sm.code}, ${sm.value}`);
        } else {
          const lm = localMeasurements[localMap[sm.id]];
          if (lm.synced) { // if local record is marked as "synced", then server has newer version, we overwrite
            localMeasurements.splice(localMap[sm.id], 1, {...sm, synced: true});
          } else if (typeof lm.synced === 'undefined') { // if local sync flag is unset - lets set it, must be older version
            localMeasurements.splice(localMap[sm.id], 1, {...sm, synced: true});
          } // otherwise our version is kinda newer, doing nothing. if flag is unset tho - lets set it
        }
      }
    }

    const updateRecords = localMeasurements.filter((item) => item.synced === false);
    if (updateRecords.length) {
      console.log(`have to update ${updateRecords.length} records`);

      try {
        const result = await uploadMeasurements({...params, measurements: updateRecords});
        if (result && result.measurements) {
          result.measurements.forEach((id) => {
            const pos = localMeasurements.findIndex((m) => m.id == id);
            if (pos !== -1) {
              localMeasurements.splice(pos, 1, {...localMeasurements[pos], synced: true});
            }
          });
        }
      } catch (e) {
        console.log('problem submitting');
        console.log(e.response);
        return null;
      }
    }

    store.dispatch({ type: Actions.response(Actions.SYNC_MEASUREMENTS), measurements: localMeasurements });

  } catch (e) {
    console.log('troubles');
    console.log(e);
    console.log(e.response);
  }
}

const syncGenericItems = async ({ store, sendOnly = false, items, getItems, uploadItems, putItems, transformItem }) => {
  const params = syncRequestParams(store);

  try {
    const localItems = (items || []).concat().filter((item) => item.id);
    const localMap = {};
    localItems.forEach((m, index) => localMap[m.id] = index);

    if (!sendOnly) {
      const serverItems = await getItems(params);

      const syncedRecords = {};
      for (const sm of (typeof transformItem === 'function' ? serverItems.map(transformItem) : serverItems)) {
        if (typeof localMap[sm.id] === 'undefined') {
          // new item from server, lets append
          localMap[sm.id] = localItems.length;
          localItems.push({...sm, synced: true});
          syncedRecords[sm.id] = true;
        } else {
          const lm = localItems[localMap[sm.id]];
          if (lm.synced) { // if local record is marked as "synced", then server has newer version, we overwrite
            localItems.splice(localMap[sm.id], 1, {...sm, synced: true});
          } else if (typeof lm.synced === 'undefined') { // if local sync flag is unset - lets set it, must be older version
            localItems.splice(localMap[sm.id], 1, {...sm, synced: true});
          } // otherwise our version is kinda newer, doing nothing. if flag is unset tho - lets set it
        }
      }
    }

    const updateRecords = localItems.filter((item) => item.synced === false || item.id === 'cb28d3d3-8a7e-45dd-b206-15218fab4df5');
    if (updateRecords.length) {
      try {
        const result = await uploadItems(updateRecords, params);
        if (result) {
          result.forEach((id) => {
            const pos = localItems.findIndex((m) => m.id == id);
            if (pos !== -1) {
              localItems.splice(pos, 1, {...localItems[pos], synced: true});
            }
          });
        }
      } catch (e) {
        console.log('problem submitting items');
        console.log(e.response);
        console.log(e);
        return null;
      }
    }

    putItems(localItems);

  } catch (e) {
    console.log('troubles');
    console.log(e.response);
    console.log(e);
  }
}


const syncProfile =  async (store) => {
  const values = store.getState().profile.profileSync;
  if (!values || Object.keys(values).length === 0) return;
  store.dispatch(uploadProfileValues(values));
}

const ucfirst = (words) => words.split('_').map((word) => word.substr(0, 1).toUpperCase() + word.substr(1)).join('');
const camelize = (words) =>
  words.split('_').map((word, index) =>
    index === 0
      ? word.toLowerCase()
      : (word.substr(0, 1).toUpperCase() + word.substr(1))).join('');

const transformToCamel = (item) => {
  console.log('was----');
  console.log(item);
  console.log('became----');

  const newItem = {};
  Object.keys(item).forEach((key) => {
    newItem[camelize(key)] = item[key];
  })
  console.log(newItem);

  return newItem;
}


const syncTrainingSessions = async (store, sendOnly) => {
  const state = store.getState();
  console.log('=== SYNC: trainingSessions');

  syncGenericItems({
    store, sendOnly,
    items: state.training.sessions,
    getItems: async (params) => {
      const result = await getTrainingSessions(params);
      return result.sessions;
    },
    putItems: async (items) => {
      store.dispatch({ type: Actions.response(Actions.SYNC_TRAINING_SESSIONS), sessions: items });
    },
    uploadItems: async (items, params) => {
      const result = await uploadTrainingSessions({sessions: items, ...params});
      return result.processed;
    },
    transformItem: transformToCamel
  })
}

const syncNotifications = async (store, sendOnly) => {
  const state = store.getState();

  syncGenericItems({
    store, sendOnly,
    items: state.profile.notifications,
    getItems: async (params) => {
      const result = await getNotifications(params);
      return result.notifications;
    },
    putItems: async (items) => {
      store.dispatch({ type: Actions.response(Actions.SYNC_NOTIFICATIONS), notifications: items });
    },
    uploadItems: async (items, params) => {
      console.log('gotta upload');
      console.log(items);
      const result = await uploadNotifications({notifications: items, ...params});
      return result.processed;
    },
  })
};

const syncEverything = store => {
  const state = store.getState();
  console.log(`we went into sync`);
  console.log(state.sync);
  if (state.sync?.syncItems?.trainingPrograms) {
    console.log('got to sync programs');
    store.dispatch(getTrainingPrograms());
  }
  syncPushToken(store);
};

const syncPushToken = store => {
  const state = store.getState();
  const {pushToken, pushTokenSynced} = state.auth;
  console.log(`push token ${pushToken} vs ${pushTokenSynced}`);

  if (pushToken && pushToken != pushTokenSynced) {
    store.dispatch(registerPushToken(pushToken));
  }
};

const sync = (store) => (next) => async (action) => {
  const processed = next(action);

  switch (action.type) {
    case Actions.SYNC_MEASUREMENTS:
      console.log('syncing measurements!');
      syncMeasurements(store);
      break;

    case Actions.UPLOAD_MEASUREMENTS:
      syncMeasurements(store, true);
      break;

    case Actions.SAVE_TRAINING_SESSION:
      syncTrainingSessions(store, true);
      break;

    case Actions.SYNC_TRAINING_SESSIONS:
      syncTrainingSessions(store);
      break;

    case Actions.UPDATE_PROFILE_VALUE:
      syncProfile(store);
      break;

    case Actions.ADD_NOTIFICATION:
    case Actions.SYNC_NOTIFICATIONS:
      syncNotifications(store);
      break;

    case Actions.response(Actions.CONFIRM_PHONE):
      syncTrainingSessions(store);
      break;
    case Actions.UPDATE_TRAINING_SESSION_ITEM:
      syncTrainingSessions(store, true);
      break;

    case Actions.SYNC_TRAINING_PROGRAMS:
    case Actions.SYNC_EVERYTHING:
      syncEverything(store);
      break;

    case Actions.SET_PUSH_TOKEN:
      syncPushToken(store);
      break;

    case Actions.NOTIFICATION_MESSAGE:
      console.log('so we got it');
      console.log(action.message);
      if (action.message.refresh) {
        action.message.refresh.split(',').forEach((refreshType) => {
          if (refreshType === 'programs') {
            store.dispatch(syncTrainingPrograms());
          }
        });
      }
      break;
  }

  return processed;
  /*
  if (action.type.indexOf('redux/INIT') !== -1) {
    console.log('ok here we are doing iss!t');
  }

  if (action.type === Actions.LOAD_INITITAL_STATE) {
    await loadInitialState(store);
  }

  if (action.type === Actions.response(Actions.GET_TRAINING_PROGRAMS)) {
    syncPrograms(store, action.result.programs);
  }

  if (action.type === Actions.response(Actions.GET_PROFILE)) {
    if (action.result.programs) syncPrograms(store, action.result.programs);
    if (action.result.user) syncUser(store, action.result.user);
    if (action.result.profile) syncProfile(store, action.result.profile);
    if (action.result.trainer) syncTrainer(store, action.result.trainer);
  }

  if (action.type === Actions.NOTIFICATION_MESSAGE) {
    if (action.message.refresh) {
      action.message.refresh.split(',').forEach((refreshType) => {
        if (refreshType === 'programs') {
          console.log('gotta refresh programs!');
          store.dispatch(getTrainingPrograms());
        }
      });
    }
  }

  const processed = next(action);

  switch (action.type) {
    case Actions.ADD_TRAINING_SESSION_ITEM:
      syncSession(store, store.getState().training.session);
      break;

    case Actions.response(Actions.SAVE_TRAINING_SESSION):
      console.log(`so session is saved, lets upload`);
      uploadEverything(store);
      break;

    case Actions.LOAD_INITITAL_STATE:
    case action.type === Actions.UPLOAD_EVERYTHING:
      uploadEverything(store);
      break;

    case 'ADD_PHOTO':
    case 'DELETE_PHOTO':
    case 'DELETE_PHOTOS':
    case Actions.response('UPLOAD_PHOTOS'):
      syncPhotos(store, store.getState().photos.photos);
      break;
  }

  return processed;
   */
}

export default sync;
export {
  loadProfile,
}
