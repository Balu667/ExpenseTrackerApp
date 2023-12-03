import { createSlice } from "@reduxjs/toolkit";

const myBookingsCardSlice = createSlice({
	name: "myBookingsCard",
	initialState: {
		selectedCard: "",
	},
	reducers: {
		setSelectedCard: (state, action) => {
			state.selectedCard = action.payload;
		},
		removeSelectedCard: (state, action) => {
			state.selectedCard = "";
		},
	},
});

export const { setSelectedCard, removeSelectedCard } =
	myBookingsCardSlice.actions;
export default myBookingsCardSlice.reducer;
