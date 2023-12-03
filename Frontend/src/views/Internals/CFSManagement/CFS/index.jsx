import { useState } from "react";
import styles from "./index.module.css";
import RightDrawer from "../../../../components/RightDrawer/RightDrawer";
import { IconButton, Switch } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import TableOptions from "../../../../components/TableOptions/TableOptions";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../../redux/slices/sidebarSlice";
import AddAndEditCFs from "./AddAndEditCFs";
import {
	useCFsManagement,
	useMutateCfs,
} from "../../../../hooks/cfsManagement";
import { useCountries } from "../../../../hooks/country";
import { useLane } from "../../../../hooks/lane";
import Loader from "../../../../components/Loader/Loader";
import { useNavigate } from "react-router";
import { keyMatchLoop } from "../../../../helper";
import { toast } from "react-toastify";
import { closePopup, openPopup } from "../../../../redux/slices/popupSlice";
import Popup from "../../../../components/ConfirmationPopup";

function CfsList() {
	const [popup, setPopup] = useState(null);
	const [editData, setEditData] = useState(null);
	const [sendPostData, setSendPostData] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchAndFilterValues, setSearchAndFilterValues] = useState("");
	const sidebar = useSelector((state) => state.sidebar);
	const ProfileRole = useSelector((state) => state.profile.role);
	const createdBy = localStorage.getItem("allMasterId");
	const { data: countryList, isLoading } = useCountries();
	const { isLoading: laneLoading, data: laneList } = useLane();
	const { data: cfsData, isLoading: cfsLoading } = useCFsManagement();

	const titleText = "Update CFS User Status";
	const contentText = "Are you sure that you want to change CFS User status";

	function handleChange(params) {
		setSendPostData({
			...params,
			id: params._id,
			status: params.status === 1 ? 2 : 1,
			createdBy,
		});
		dispatch(openPopup());
	}
	const onSuccessFunctions = (response) => {
		toast.success(response);
	};
	const { mutate } = useMutateCfs(onSuccessFunctions);

	const updateStatus = () => {
		mutate(sendPostData);
		dispatch(closePopup());
	};

	if (isLoading) {
		return <Loader />;
	}

	const toggleDrawer = () => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return setPopup(null);
		}
		setPopup(null);
	};

	const columns = [
		{
			field: "fullName",
			flex: 1,
			headerName: "NAME",
			width: 150,
		},
		{
			field: "cfsBranch",
			flex: 1,
			headerName: "BRANCH",
			width: 150,
		},
		{
			field: "countryName",
			flex: 1,
			headerName: "COUNTRY",
			width: 250,
			valueGetter: ({ value }) =>
				keyMatchLoop("_id", countryList, value)?.countryName ?? "N/A",
		},
		{
			field: "type",
			flex: 1,
			headerName: "TYPE",
			width: 200,
			valueGetter: ({ value }) =>
				value === 1 ? "Origin CFS" : "Destination CFS",
		},

		{
			field: "gateway",
			headerName: "GATEWAY",
			width: 150,
			valueGetter: ({ value }) =>
				keyMatchLoop("_id", laneList, value)?.portName ?? "N/A",
			flex: 1,
		},
		{
			field: "destination",
			headerName: "DESTINATION",
			width: 150,
			valueGetter: ({ value }) =>
				keyMatchLoop("_id", laneList, value)?.portName ?? "N/A",
			flex: 1,
		},

		{
			flex: 1,
			field: "Options",
			sortable: false,
			width: 100,
			renderCell: (params) =>
				params.row.status !== 3 && (
					<TableOptions
						editOnClick={() => {
							setEditData(params.row);
							setPopup("edit");
						}}
					/>
				),
		},
		{
			flex: 1,
			field: "Actions",
			sortable: false,
			width: 100,
			renderCell: (params) => {
				return (
					params.row.status !== 3 && (
						<Switch
							disabled={params.row.status === 3}
							inputProps={{ "aria-label": "controlled" }}
							checked={params.row.status === 1}
							onClick={() => handleChange(params.row)}
						/>
					)
				);
			},
		},
	];

	if (isLoading || cfsLoading || laneLoading) {
		return <Loader />;
	}

	const rowClickFunction = (data) => {
		if (data.row.status !== 3) {
			if (data.field !== "Options" && data.field !== "Actions") {
				if (ProfileRole === 2) {
					return navigate("/admin/cfsmanagement/" + data.row._id);
				}
				if (ProfileRole === 3) {
					return navigate("/obteam/cfsmanagement/" + data.row._id);
				}
				if (ProfileRole === 4) {
					return navigate("/rdt/cfsmanagement/" + data.row._id);
				}
			}
		}
	};

	return (
		<div className={styles.countrydiv}>
			<div className={styles.headingdiv}>
				<div className={styles.titlediv}>
					{!sidebar.sidebarStatus && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => dispatch(openSidebar())}
							className={styles.icon}>
							<MenuIcon />
						</IconButton>
					)}
					<h3 className={styles.title}>CFS Management</h3>
				</div>
				<div className={styles.buttondiv}>
					<button
						className={styles.button}
						onClick={() => setPopup("add")}>
						Add CFS
					</button>
				</div>
			</div>
			<RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
				{popup === "add" ? (
					<AddAndEditCFs
						country={countryList.filter(
							({ status }) => status === 1
						)}
						lane={laneList}
						isEdit={popup === "edit"}
						onCloseButtonClick={() => setPopup(null)}
					/>
				) : (
					<AddAndEditCFs
						country={countryList.filter(
							({ status }) => status === 1
						)}
						lane={laneList}
						onCloseButtonClick={() => setPopup(null)}
						isEdit={popup === "edit"}
						editData={editData}
					/>
				)}
			</RightDrawer>
			<div className={styles.searchdiv}>
				<div className={styles.searchbox}>
					<img src={searchlogo} alt="searchlogo" />
					<input
						type="text"
						onChange={(e) =>
							setSearchAndFilterValues(e.target.value)
						}
						placeholder="Search CFS by Name"
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
					sx={{ textTransform: "capitalize" }}
					rows={cfsData
						.filter((e) =>
							e.fullName
								.toLowerCase()
								.includes(searchAndFilterValues.toLowerCase())
						)
						.reverse()}
					columns={columns}
					columnVisibilityModel={{ Actions: ProfileRole === 2 }}
					getRowId={(data) => data._id}
					hideFooterSelectedRowCount={true}
					onCellClick={(row) => rowClickFunction(row)}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
				/>
			</div>
			<div>
				<Popup
					handleAgree={updateStatus}
					titleText={titleText}
					contentText={contentText}
				/>
			</div>
		</div>
	);
}

export default CfsList;
