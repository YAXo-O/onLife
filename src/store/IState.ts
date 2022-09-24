import {
	createStore,
	applyMiddleware,
	combineReducers,
	Store,
	ReducersMapObject,
} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistConfig, Persistor } from 'redux-persist/es/types';

import { ItemState, initItemState } from './ItemState/State';
import { User } from '../objects/User';
import { getItemReducer } from './ItemState/Reducer';
import thunk from 'redux-thunk';
import { Nullable } from '../objects/utility/Nullable';
import { CounterState } from './CounterState/State';
import { counterReducer } from './CounterState/Reducer';
import { CurrentTrainingDay } from './Types';
import { LocalState, initLocalState } from './LocalState/State';
import { getLocalReducer } from './LocalState/Reducer';

export interface IState {
	user: ItemState<User>;
	training: LocalState<CurrentTrainingDay>;
	counter: CounterState;
}

export const initialState: IState = {
	user: initItemState<User>(),
	training: initLocalState<CurrentTrainingDay>(),
	counter: { counter: 0 },
};

export const rootReducer: ReducersMapObject<IState> = {
	user: getItemReducer<'user'>('user'),
	training: getLocalReducer<'training'>('training'),
	counter: counterReducer,
};

const persistConfig: PersistConfig<IState> = {
	key: 'root',
	storage: AsyncStorage,
};

// Cache store - we only need one instance in the app
let store: Nullable<Store<IState>> = null; // This is an in-memory redux store
let persistor: Nullable<Persistor> = null; // This is an unencrypted file-system copy (used to store data between sessions)

/***
 * Get / Create app store
 */
export function getStore(): Store<IState> {
	if (store) return store;

	const appReducer = combineReducers(rootReducer);
	const persistedReducer = persistReducer(persistConfig, appReducer);
	store = createStore(persistedReducer, applyMiddleware(thunk));

	return store;
}

/***
 * Get / Create app store persistor (to store and restore data between sessions)
 */
export function getPersistor(): Persistor {
	if (persistor) return persistor;

	const store = getStore();
	persistor = persistStore(store);

	return persistor;
}
