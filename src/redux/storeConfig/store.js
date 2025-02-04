import rootReducer from '../slice/rootReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
    persistReducer, persistStore,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';

const authPersistConfig = {
    key: 'auth-property-management',
    version: 1.1,
    storage,
    whitelist: ['auth'] // only persist the auth slice
};

// const persistedAuthReducer = persistReducer(authPersistConfig, rootReducer.auth);

// const combinedReducer = combineReducers({
//     ...rootReducer,
//     auth: persistReducer(authPersistConfig, rootReducer.auth)
// });
export const rootReducerData = combineReducers({
    ...rootReducer,
});
const persistedReducer = persistReducer(authPersistConfig, rootReducerData);
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            // serializableCheck: false,
        }),
});

const persistor = persistStore(store);

export { store, persistor };
// const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => {
//         return getDefaultMiddleware({
//             serializableCheck: false
//         });
//     }
// });

// export { store, persistor };
