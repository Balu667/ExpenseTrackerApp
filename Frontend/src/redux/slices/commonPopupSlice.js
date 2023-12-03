import { createSlice } from "@reduxjs/toolkit";

const commonPopupSlice = createSlice({
	name: "commonPopup",
	initialState: {
		popupStatus: false,
	},
	reducers: {
		openCommonPopup: (state) => {
			state.popupStatus = true;
		},
		closeCommonPopup: (state) => {
			state.popupStatus = false;
		},
	},
});

export const { openCommonPopup, closeCommonPopup } = commonPopupSlice.actions;
export default commonPopupSlice.reducer;
