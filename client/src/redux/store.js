import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import state from "./state";

// Initialize state from localStorage if available
// const initializeState = () => {
//   const token = localStorage.getItem('token');
//   const user = localStorage.getItem('user');
//   
//   if (token && user) {
//     return {
//       user: JSON.parse(user),
//       token: token,
//     };
//   }
//   
//   return {
//     user: null,
//     token: null,
//   };
// };

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, state);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);


