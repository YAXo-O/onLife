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
import thunk from 'redux-thunk';

import { UserState, initItemState } from '@app/store/ItemState/State';
import { getItemReducer } from '@app/store/ItemState/Reducer';
import { Nullable } from '@app/objects/utility/Nullable';
import { CounterState } from '@app/store/CounterState/State';
import { counterReducer } from '@app/store/CounterState/Reducer';
import { LocalState, initLocalState } from '@app/store/LocalState/State';
import { getLocalReducer } from '@app/store/LocalState/Reducer';
import { CurrentTraining } from '@app/store/Types';
import { Client } from '@app/objects/User';
import { OnlifeTraining } from '@app/objects/training/Training';

export interface IState {
	user: UserState<Client>;
	training: LocalState<CurrentTraining>;
	session: LocalState<OnlifeTraining>;
	counter: CounterState;
	loading: LocalState<boolean>;
}

export const initialState: IState = {
	user: initItemState<Client>(),
	training: initLocalState<CurrentTraining>(),
	session: initLocalState<OnlifeTraining>(),
	counter: { counter: 0 },
	loading: initLocalState<boolean>(),
};

export const rootReducer: ReducersMapObject<IState> = {
	user: getItemReducer<'user'>('user'),
	training: getLocalReducer<'training'>('training'),
	session: getLocalReducer<'session'>('session'),
	loading: getLocalReducer<'loading'>('loading'),
	counter: counterReducer,
};

const persistConfig: PersistConfig<IState> = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['loading'],
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
