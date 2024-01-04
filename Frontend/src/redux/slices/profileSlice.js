import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
	name: "profile",
	initialState: {
		profileData: null,
		signedIn: false,
	},
	reducers: {
		setProfileData: (state, action) => {
			state.profileData = action.payload;
			state.signedIn = true;
		},
		removeProfileData: (state) => {
			state.profileData = null;
			state.signedIn = false;
		}
	},
});

export const {
	setProfileData,
	removeProfileData
} = profileSlice.actions;
export default profileSlice.reducer;
