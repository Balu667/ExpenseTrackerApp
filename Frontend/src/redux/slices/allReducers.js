import { combineReducers } from "@reduxjs/toolkit";
import popupSlice from "./popupSlice";
import profileSlice from "./profileSlice";
import sidebarSlice from "./sidebarSlice";
import commonPopupSlice from "./commonPopupSlice";
import checkoutSlice from "./checkoutSlice";
import myBookingsCardSlice from "./myBookingsCardSlice";

export const rootReducer = combineReducers({
	profile: profileSlice,
	sidebar: sidebarSlice,
	popup: popupSlice,
	commonPopup: commonPopupSlice,
	checkoutDetails: checkoutSlice,
	myBookingsCard: myBookingsCardSlice,
});
