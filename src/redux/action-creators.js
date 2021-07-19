import * as Actions from './actions';
import * as Api from '../api/requests';

export const setBearerToken = (token, local = false) => ({
  type: Actions.SET_BEARER_TOKEN,
  token,
  local,
});

export const logout = () => ({
  type: Actions.LOGOUT,
});

export const setPushToken = (token, os = 'android') => ({
  type: Actions.SET_PUSH_TOKEN,
  token,
  os,
});

export const registerPushToken = (pushToken, os = 'android') => ({
  type: Actions.REGISTER_PUSH_TOKEN,
  request: Api.registerToken,
  pushToken,
  os,
})

export const notificationMessage = (message) => ({
  type: Actions.NOTIFICATION_MESSAGE,
  message,
});

export const loginPhone = (phone) => ({
  type: Actions.LOGIN_PHONE,
  request: Api.loginPhone,
  phone,
});

export const changePhone = () => ({
  type: Actions.CHANGE_PHONE,
});

export const confirmPhone = (challenge, code) => ({
  type: Actions.CONFIRM_PHONE,
  request: Api.confirmPhone,
  challenge,
  code
});

export const getUser = () => ({
  type: Actions.GET_USER,
  request: Api.getUser,
});

export const getProfile = () => ({
  type: Actions.GET_PROFILE,
  request: Api.getProfile,
});

export const setActiveProfile = (profile) => ({
  type: Actions.SET_ACTIVE_PROFILE,
  profile,
});

export const updateProfileValue = (values) => ({
  type: Actions.UPDATE_PROFILE_VALUE,
  values,
});

export const uploadProfileValues = (values) => ({
  type: Actions.UPLOAD_PROFILE_VALUES,
  request: Api.uploadProfileValues,
  values,
});

export const getNotifications = () => ({
  type: Actions.GET_NOTIFICATIONS,
  request: Api.getNotifications,
});


export const setHeaderTitle = (title) => ({
  type: Actions.SET_HEADER_TITLE,
  title,
});

export const setHeaderSection = (section) => ({
  type: Actions.SET_HEADER_SECTION,
  section,
});

export const setHeaderButton = (button) => ({
  type: Actions.SET_HEADER_BUTTON,
  button,
});

export const setHeaderMenu = (menu) => ({
  type: Actions.SET_HEADER_MENU,
  menu,
});

export const getTrainingPrograms = () => ({
  type: Actions.GET_TRAINING_PROGRAMS,
  request: Api.getTrainingPrograms,
});

export const setCurrentTrainingProgram = (programId, profileId = null) => ({
  type: Actions.SET_CURRENT_TRAINING_PROGRAM,
  programId, profile_id: profileId,
});

export const getNutritionProgram = () => ({
  type: Actions.GET_NUTRITION_PROGRAM,
  request: Api.getNutritionProgram,
});

export const updateNutritionPreference = (code, value) => ({
  type: Actions.UPDATE_NUTRITION_PREFERENCE,
  code, value,
});

export const addTrainingSession = (session) => ({
  type: Actions.ADD_TRAINING_SESSION,
  session, profile_id: null,
});

export const addTrainingSessionItem = (sessionItem) => ({
  type: Actions.ADD_TRAINING_SESSION_ITEM,
  sessionItem, profile_id: null,
});

export const updateTrainingSessionItem = (sessionId, sessionItem) => ({
  type: Actions.UPDATE_TRAINING_SESSION_ITEM,
  sessionId, sessionItem, profile_id: null,
});

export const uploadTrainingSessions = (sessions) => ({
  type: Actions.UPLOAD_TRAINING_SESSIONS,
  request: Api.uploadTrainingSessions,
  sessions,
});

export const getMeasurements = () => ({
  type: Actions.GET_MEASUREMENTS,
  request: Api.getMeasurements,
});

export const addMeasurement = (measurement) => ({
  type: Actions.ADD_MEASUREMENT,
  measurement,
});

export const syncMeasurements = () => ({
  type: Actions.SYNC_MEASUREMENTS,
});

export const uploadMeasurements = () => ({
  type: Actions.UPLOAD_MEASUREMENTS,
});


export const getPhotos = () => ({
  type: Actions.GET_PHOTOS,
  request: Api.getPhotos,
});

export const addPhoto = (photo) => ({
  type: Actions.ADD_PHOTO,
  photo,
});

export const deletePhoto = (id) => ({
  type: Actions.DELETE_PHOTO,
  request: Api.deletePhoto,
  id,
});

export const deletePhotos = () => ({
  type: Actions.DELETE_PHOTOS,
});

export const uploadPhotos = (photos) => ({
  type: Actions.UPLOAD_PHOTOS,
  request: Api.uploadPhotos,
  photos,
});

export const uploadFile = (file) => ({
  type: Actions.UPLOAD_FILE,
  request: Api.uploadFile,
  file,
});

export const loadInitialState = () => ({
  type: Actions.LOAD_INITITAL_STATE,
});

export const saveSession = (session) => ({
  type: Actions.SAVE_TRAINING_SESSION,
  // storeRequest: storeSession,
  session, profile_id: null,
});

export const syncEverything = () => ({
  type: Actions.SYNC_EVERYTHING,
});

export const syncTrainingPrograms = () => ({
  type: Actions.SYNC_TRAINING_PROGRAMS,
});

export const syncTrainingSessions = () => ({
  type: Actions.SYNC_TRAINING_SESSIONS,
});

export const getTrainingSessions = () => ({
  type: Actions.GET_TRAINING_SESSIONS,
  request: getTrainingSessions,
});

export const getLists = () => ({
  type: Actions.GET_LISTS,
  request: Api.getLists,
});

export const addNotification = (notification) => ({
  type: Actions.ADD_NOTIFICATION,
  notification,
});

export const setCurrentTrainingDay = (trainingDayId, trainingCycle) => ({
  type: Actions.SET_CURRENT_TRAINING_DAY,
  trainingDayId, trainingCycle,
});
