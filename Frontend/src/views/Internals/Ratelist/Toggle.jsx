import * as React from "react";
import "./Rate.css";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Switch" } };
function Toggle({ value, handleChange }) {
	return (
		<div>
			<Switch checked={value === 1} {...label} onChange={handleChange} />
		</div>
	);
}
export default Toggle;
