import { configureStore } from '@reduxjs/toolkit'
import propertyReducer from './slices/property/propertySlice'

export const store = configureStore({
  reducer: {property: propertyReducer},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch