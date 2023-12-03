import Sidebar from "../Sidebar/Sidebar";
import { Box, CssBaseline, Drawer } from "@mui/material";
import Main from "../Main/Main";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar } from "../../redux/slices/sidebarSlice";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 350;

function OperationAdminDrawer() {
	const sidebar = useSelector((state) => state.sidebar);
	const dispatch = useDispatch();

	const mobileView = useMediaQuery("(max-width:900px)");

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
				variant={mobileView ? "temporary" : "persistent"}
				anchor="left"
				open={sidebar.sidebarStatus}>
				<Sidebar onClick={() => dispatch(closeSidebar())} />
			</Drawer>
			<Main open={sidebar.sidebarStatus} ismobile={mobileView ? 1 : 0}>
				<Outlet />
			</Main>
		</Box>
	);
}

export default OperationAdminDrawer;
