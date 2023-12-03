import { useState } from "react";
import "./Schedules.css";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import AddAndEditSchedule from "./AddAndEditSchedule";
import { useLane } from "../../../hooks/lane";
import { useSchedule } from "../../../hooks/schedule";
import { useGetPortHolidayList } from "../../../hooks/portHoliday";
import { useCFsManagement } from "../../../hooks/cfsManagement";
import TableOptions from "../../../components/TableOptions/TableOptions";
import Loader from "../../../components/Loader/Loader";
import { keyMatchLoop, convertFirstLettersAsUpperCase } from "../../../helper";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import moment from "moment";

function Schedules() {
	const [popup, setPopup] = useState(null);
	const [editData, setEditData] = useState(null);
	const [searchValue, setSearchValue] = useState("");
	const sidebar = useSelector((state) => state.sidebar);
	const dispatch = useDispatch();

	const { isLoading: laneLoading, data: laneList } = useLane();
	const { isLoading: cfsLoading, data: cfsList } = useCFsManagement();
	const { data: holidayList } = useGetPortHolidayList();
	const { isLoading: scheduleLoading, data: scheduleList } = useSchedule();

	if (laneLoading || cfsLoading || scheduleLoading) {
		return <Loader />;
	}

	const toggleDrawer = () => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return setPopup(false);
		}
		setPopup(false);
	};

	const columns = [
		{ field: "scheduleId", headerName: "ID", flex: 1 },
		{
			field: "pol",
			headerName: "POL",
			flex: 1,
			valueGetter: ({ value }) =>
				keyMatchLoop("_id", laneList, value)?.portCode,
			valueFormatter: ({ value }) => value?.toUpperCase(),
		},
		{
			field: "pod",
			headerName: "POD",
			flex: 1,
			valueGetter: ({ value }) =>
				keyMatchLoop("_id", laneList, value)?.portCode,
			valueFormatter: ({ value }) => value?.toUpperCase(),
		},
		{
			field: "container",
			headerName: "CONTAINER",
			flex: 1,
		},
		{
			field: "vessel",
			headerName: "VESSEL",
			flex: 1,
			valueFormatter: ({ value }) =>
				convertFirstLettersAsUpperCase(value),
		},
		{
			field: "voyage",
			headerName: "VOYAGE",
			flex: 1,
			valueFormatter: ({ value }) =>
				convertFirstLettersAsUpperCase(value),
		},
		{
			field: "etd",
			headerName: "ETD",
			flex: 1,
			valueGetter: ({ value }) => moment(value).format("DD-MM-YYYY"),
		},
		{
			field: "eta",
			headerName: "ETA",
			flex: 1,
			valueGetter: ({ value }) => moment(value).format("DD-MM-YYYY"),
		},
		{
			field: "status",
			headerName: "STATUS",
			flex: 1,
			renderCell: ({ value }) => <ActiveButton status={value} />,
		},
		{
			field: "options",
			headerName: "OPTIONS",
			flex: 1,
			renderCell: (params) => (
				<TableOptions
					editOnClick={() => {
						setEditData(params.row);
						setPopup("edit");
					}}
				/>
			),
		},
	];

	function filterSchedule(array, state) {
		return array.length > 0
			? array.filter((e) => {
					const pol = keyMatchLoop("_id", laneList, e.pol).portCode;
					const pod = keyMatchLoop("_id", laneList, e.pod).portCode;
					return (
						pol.replace(/\s/g, "").includes(state.toLowerCase()) ||
						pod.replace(/\s/g, "").includes(state.toLowerCase()) ||
						e.scheduleId
							.replace(/\s/g, "")
							.toLowerCase()
							.includes(state.toLowerCase().replace(/\s/g, ""))
					);
			  })
			: [];
	}

	return (
		<div className="countrydiv">
			<div className="headingdiv">
				<div className="titlediv">
					{!sidebar.sidebarStatus && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => dispatch(openSidebar())}
							className="icon">
							<MenuIcon />
						</IconButton>
					)}
					<h3 className="title">Schedules</h3>
				</div>
				<div className="buttondiv">
					<button
						className="button"
						onClick={() => {
							setPopup(true);
						}}>
						Add Schedule
					</button>
				</div>
			</div>
			<RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
				{popup === "add" ? (
					<AddAndEditSchedule
						laneList={laneList}
						cfsList={cfsList}
						holidayList={holidayList}
						isEdit={popup === "edit"}
						onCloseButtonClick={() => setPopup(null)}
					/>
				) : (
					<AddAndEditSchedule
						laneList={laneList}
						cfsList={cfsList}
						holidayList={holidayList}
						editData={editData}
						isEdit={popup === "edit"}
						onCloseButtonClick={() => setPopup(null)}
					/>
				)}
			</RightDrawer>
			<div className="searchdiv">
				<div className="chsearchbox">
					<img src={searchlogo} alt="searchlogo" />
					<input
						type="text"
						onChange={(e) => {
							setSearchValue(e.target.value);
						}}
						placeholder="Search Schedule ID, POL, POD"
					/>
				</div>
			</div>
			<div
				style={{
					height: 430,
					width: "100%",
					marginTop: "10px",
					borderRadius: "5px",
				}}>
				<DataGrid
					getRowId={(row) => row._id}
					rows={filterSchedule(scheduleList, searchValue).reverse()}
					columns={columns}
					disableRowSelectionOnClick
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
				/>
			</div>
		</div>
	);
}

export default Schedules;
