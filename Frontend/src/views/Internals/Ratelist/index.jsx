import "./Rate.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
// import Toggle from "./Toggle";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useState } from "react";
import { useRates } from "../../../hooks/rate";
import Loader from "../../../components/Loader/Loader";
import { useSchedule } from "../../../hooks/schedule";
import { keyMatchLoop } from "../../../helper";
// import Popup from "../../../components/ConfirmationPopup";
// import * as CryptoJS from "crypto-js";
// import { openPopup } from "../../../redux/slices/popupSlice";
import { useLane } from "../../../hooks/lane";

function RateList() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const sidebar = useSelector((state) => state.sidebar);
	const ProfileRole = useSelector((state) => state.profile.role);
	const dispatch = useDispatch();
	const { isLoading: scheduleLoading, data: scheduleData } = useSchedule();
	const {
		isLoading: rateLoading,
		data: ratesList,
		isFetching,
		isError,
		error,
	} = useRates();
	// const [sendPostData, setSendPostData] = useState(null);
	const { isLoading: laneLoading, data: laneData } = useLane();
	// const { mutate } = useUpdateRateStatus();
	// const titleText = "Change Rate Status?";
	// const contentText = "Are you sure that you want to change this rate status";

	// function handleToggle(params) {
	// 	setSendPostData({
	// 		id: params.row._id,
	// 		status: params.row.status === 1 ? 2 : 1,
	// 	});
	// 	dispatch(openPopup());
	// }

	// function updateStatus() {
	// 	const data = { data: [sendPostData] };
	// 	const encryptedPayload = CryptoJS.AES.encrypt(
	// 		JSON.stringify(data),
	// 		import.meta.env.VITE_ENCRYPTION_KEY
	// 	).toString();
	// 	const postPayload = { data: [encryptedPayload] };
	// 	mutate(postPayload);
	// }
	if (rateLoading || scheduleLoading || laneLoading) {
		return <Loader />;
	}

	const columns = [
		{
			field: "scheduleId",
			headerName: "Schedule ID",
			flex: 1,
			cellClassName: "scheduleStyle",
			valueGetter: (params) =>
				keyMatchLoop("_id", scheduleData, params.row.scheduleId)
					.scheduleId,
		},
		{
			field: "FOCFS",
			headerName: "POL",
			flex: 1,
			valueGetter: (params) =>
				keyMatchLoop(
					"_id",
					laneData,
					params.row.scheduleInfo.pol
				).portCode.toUpperCase(),
		},
		{
			field: "ODOC",
			headerName: "POD",
			flex: 1,
			valueGetter: (params) =>
				keyMatchLoop(
					"_id",
					laneData,
					params.row.scheduleInfo.pod
				).portCode.toUpperCase(),
		},
		{
			field: "FREIGHT",
			headerName: "Origin Total",
			flex: 1,
			valueGetter: (params) => params.row.finalRates.FOT,
		},
		{
			field: "DCFS",
			headerName: "Freight Total",
			flex: 1,
			valueGetter: (params) => params.row.finalRates.FF,
		},
		{
			field: "DDO",
			headerName: "Destination Total",
			flex: 1,
			valueGetter: (params) => params.row.finalRates.FDT,
		},
		{
			field: "status",
			headerName: "Status",
			renderCell: ({ value }) => <ActiveButton status={value} />,
			flex: 1,
		},
		// {
		// 	field: "Options",
		// 	headerName: "Options",
		// 	renderCell: (params) => (
		// 		<Toggle
		// 			value={params.row.status}
		// 			handleChange={() => handleToggle(params)}
		// 		/>
		// 	),
		// 	flex: 1,
		// },
		{
			field: "options",
			headerName: "VIEW",
			flex: 1,
			renderCell: (params) => (
				<p
					className="viewbtn"
					onClick={() => {
						if (ProfileRole === 2) {
							navigate("/admin/rate/" + params.id);
						}
						if (ProfileRole === 4) {
							navigate("/rdt/rate/" + params.id);
						}
					}}>
					{ProfileRole === 2
						? params.row.status === 1
							? "View"
							: "Approve"
						: "View"}
				</p>
			),
		},
	];

	function filterArray(array) {
		return scheduleData.length > 0
			? array.filter((e) => {
					const scheduleId = keyMatchLoop(
						"_id",
						scheduleData,
						e.scheduleId
					).scheduleId;
					return (
						scheduleId &&
						scheduleId
							.toLowerCase()
							.replace(/\s/g, "")
							.includes(
								searchTerm.toLowerCase().replace(/\s/g, "")
							)
					);
			  })
			: [];
	}

	if (isError) {
		return <div>{error.message}</div>;
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
					<h3 className="title">Rate Management</h3>
				</div>
				{ProfileRole === 4 && (
					<div className="buttondiv">
						<button
							className="button"
							onClick={() => {
								navigate("/rdt/rate/add");
							}}>
							Add Rate
						</button>
					</div>
				)}
			</div>
			<div className="searchdiv">
				<div className="chsearchbox">
					<img src={searchlogo} alt="searchlogo" />
					<input
						type="text"
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search Schedule ID"
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
					columns={columns}
					rows={filterArray(ratesList).reverse()}
					loading={isFetching}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
					disableRowSelectionOnClick
				/>
			</div>
			{/* <Popup
				handleAgree={() => updateStatus()}
				titleText={titleText}
				contentText={contentText}
			/> */}
		</div>
	);
}

export default RateList;
