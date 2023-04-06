import {
	createStore,
	applyMiddleware,
	combineReducers,
	Store,
	ReducersMapObject, Action, Dispatch,
} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistConfig, Persistor } from 'redux-persist/es/types';
import thunk, { ThunkDispatch } from 'redux-thunk';

import { UserState, initItemState } from '@app/store/ItemState/State';
import { getItemReducer } from '@app/store/ItemState/Reducer';
import { LocalState, initLocalState } from '@app/store/LocalState/State';
import { getLocalReducer } from '@app/store/LocalState/Reducer';
import { CurrentTraining } from '@app/store/Types';
import { User } from '@app/objects/User';
import { OnlifeTraining } from '@app/objects/training/Training';

export interface IState {
	user: UserState<User>;
	training: LocalState<CurrentTraining>;
	session: LocalState<OnlifeTraining>;
	loading: LocalState<boolean>;
}

interface StoreContainer {
	store: Store<IState>;
	persistor: Persistor;
}

export const initialState: IState = {
	user: initItemState<User>(),
	training: initLocalState<CurrentTraining>(),
	session: initLocalState<OnlifeTraining>(),
	loading: initLocalState<boolean>(),
};

export const rootReducer: ReducersMapObject<IState> = {
	user: getItemReducer<'user'>('user'),
	training: getLocalReducer<'training'>('training'),
	session: getLocalReducer<'session'>('session'),
	loading: getLocalReducer<'loading'>('loading'),
};

const persistConfig: PersistConfig<IState> = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['loading'],
};

/**
 * Cache store - we only need one instance in the app
 * StoreContainer.Store - This is an in-memory redux store
 * StoreContainer.Persistor - This is an unencrypted file-system copy (used to store data between sessions)
 */
const container: StoreContainer = createStoreContainer();

function createStoreContainer(): StoreContainer {
	const appReducer = combineReducers(rootReducer);
	const persistedReducer = persistReducer(persistConfig, appReducer);
	const store = createStore(persistedReducer, applyMiddleware(thunk));
	const persistor = persistStore(store);
	type AppDispatch = typeof store.dispatch;

	return { store, persistor };
}

/***
 * Get / Create app store
 */
export function getStore(): Store<IState> {
	return container.store;
}

/***
 * Get / Create app store persistor (to store and restore data between sessions)
 */
export function getPersistor(): Persistor {
	return container.persistor;
}

export type AppDispatch = Dispatch<Action> & ThunkDispatch<unknown, undefined, Action>;
