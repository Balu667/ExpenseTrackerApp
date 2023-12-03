import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
	{
		value: 1,
		label: "1",
	},
	{
		value: 2,
		label: "2",
	},
	{
		value: 3,
		label: "3",
	},
	{
		value: 4,
		label: "4",
	},
	{
		value: 5,
		label: "5",
	},
	{
		value: 6,
		label: "6",
	},
	{
		value: 7,
		label: "7",
	},
	{
		value: 8,
		label: "8",
	},
	{
		value: 9,
		label: "9",
	},
	{
		value: 10,
		label: "10",
	},
	{
		value: 11,
		label: "11",
	},
	{
		value: 12,
		label: "12",
	},
];

export default function DiscreteSliderMarks({ onchange, max }) {
	return (
		<Box sx={{ width: 400 }}>
			<Slider
				aria-label="Custom marks"
				defaultValue={1}
				step={1}
				valueLabelDisplay="auto"
				marks={marks}
				className="slider"
				max={max}
				onChange={onchange}
			/>
		</Box>
	);
}
