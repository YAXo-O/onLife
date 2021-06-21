import { combineReducers } from 'redux';
import authReducer from './auth';
import profileReducer from './profile';
import trainingReducer from './training';
import headerReducer from './header';
import photosReducer from './photos';
import syncReducer from './sync';
import measurementsReducer from './measurements';
import nutritionReducer from './nutrition';
import listsReducer from './lists';

export default combineReducers({
  auth: authReducer,
  lists: listsReducer,
  profile: profileReducer,
  header: headerReducer,
  training: trainingReducer,
  photos: photosReducer,
  sync: syncReducer,
  measurements: measurementsReducer,
  nutrition: nutritionReducer,
});
