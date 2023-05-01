import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import dataReducer from './slices/dataSlice';
import darkModeReducer from './slices/darkModeSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    data: dataReducer,
    darkMode: darkModeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
