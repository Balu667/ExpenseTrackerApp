import { combineReducers } from "@reduxjs/toolkit";
import profileSlice from "./profileSlice";

export const rootReducer = combineReducers({
	profile: profileSlice,
});
