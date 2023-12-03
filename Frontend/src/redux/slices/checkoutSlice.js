import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
	name: "checkoutDetails",
	initialState: {
		bookingId: null,
		cargoDetails: null,
		shipperDetails: null,
		consigneeDetails: null,
		notifyPartyDetails: null,
		bookingDocsDetails: null,
		legalName: null,
		notifyCheckbox: true,
		ofSaveFlag: true,
		dfSaveFlag: true,
		npSaveFlag: true,
	},
	reducers: {
		insertBookingId: (state, action) => {
			state.bookingId = action.payload;
		},
		insertCargoDetails: (state, action) => {
			state.cargoDetails = action.payload;
		},
		insertShipperDetails: (state, action) => {
			state.shipperDetails = action.payload;
		},
		insertConsigneeDetails: (state, action) => {
			state.consigneeDetails = action.payload;
		},
		insertNotifyPartyDetails: (state, action) => {
			state.notifyPartyDetails = action.payload;
		},
		insertBookingDocs: (state, action) => {
			state.bookingDocsDetails = action.payload;
		},
		insertIdAndLegalName: (state, action) => {
			state.bookingId = action.payload.bookingId;
			state.legalName = action.payload.legalName;
		},
		handleNotifyCheckbox: (state, action) => {
			state.notifyCheckbox = action.payload;
		},
		handleOriginFSaveFlag: (state, action) => {
			state.ofSaveFlag = action.payload;
		},
		handleDestinationFSaveFlag: (state, action) => {
			state.dfSaveFlag = action.payload;
		},
		handleNotifySaveFlag: (state, action) => {
			state.npSaveFlag = action.payload;
		},
		removeAllDetails: (state) => {
			state.bookingId = null;
			state.cargoDetails = null;
			state.shipperDetails = null;
			state.consigneeDetails = null;
			state.notifyPartyDetails = null;
			state.bookingDocsDetails = null;
			state.legalName = null;
			state.notifyCheckbox = true;
			state.ofSaveFlag = true;
			state.dfSaveFlag = true;
			state.npSaveFlag = true;
		},
	},
});

export const {
	insertCargoDetails,
	insertBookingDocs,
	insertConsigneeDetails,
	insertIdAndLegalName,
	insertNotifyPartyDetails,
	insertBookingId,
	insertShipperDetails,
	removeAllDetails,
	handleNotifyCheckbox,
	handleOriginFSaveFlag,
	handleDestinationFSaveFlag,
	handleNotifySaveFlag,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
