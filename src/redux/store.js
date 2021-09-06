import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';

import reducers from './reducers';
import middleware from './middleware';

const persistConfig = {
	key: 'root',
	storage: FilesystemStorage,
	blacklist: ['header'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(persistedReducer, middleware);
export const persistor = persistStore(store);
