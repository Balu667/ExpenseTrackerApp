import React from "react";
import Drawer from "@mui/material/Drawer";
import "./RightDrawer.css";

function RightDrawer({ popup, children, handleDrawer }) {
	return (
		<Drawer
			anchor={"right"}
			open={popup}
			// onClose={handleDrawer()}
			sx={{ width: { sm: "400px" } }}>
			{children}
		</Drawer>
	);
}

export default RightDrawer;
