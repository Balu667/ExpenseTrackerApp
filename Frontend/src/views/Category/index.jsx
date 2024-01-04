import { useState } from "react";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import { MenuItem, Select, FormControl, IconButton } from "@mui/material";
import TableOptions from "../../../components/TableOptions/TableOptions";
import AddAndEditLane from "./AddAndEditLane";
import { useSelector, useDispatch } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import Loader from "../../../components/Loader/Loader";
import classes from "./index.module.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			minWidth: "230px !important",
		},
	},
};

function Lane() {
	const [popup, setPopup] = useState(false);

	const [type, setType] = useState("insert");

	const [selectedRow, setSelectedRow] = useState(null);

	// const [searchAndFilterValues, setSearchAndFilterValues] = useState({
	// 	searchLane: "",
	// 	countryName: "",
	// 	status: 1,
	// 	type: "",
	// });

	// const sidebar = useSelector((state) => state.sidebar);

	const dispatch = useDispatch();

	// const { data: countryList, isLoading } = useCountries();

	// const { isLoading: laneLoading, data: laneList, isFetching } = useLane();

	const toggleDrawer = () => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return setPopup(false);
		}
		setPopup(false);
		setType("insert");
	};

	const changeTypeHandler = (row) => {
		setSelectedRow(row);
		setType("edit");
		setPopup(true);
	};

	function updateState(key, value) {
		setSearchAndFilterValues({ ...searchAndFilterValues, [key]: value });
	}

	function checkConditionsInObject(object, state) {
		return (
			object.country
				.toLowerCase()
				.replace(/\s/g, "")
				.includes(state.countryName.toLowerCase()) &&
			`${object.status}`.includes(state.status) &&
			`${object.type}`.includes(state.type)
		);
	}

	function filterArrayUsingSearchTermAndFilters(array, state) {
		return array.filter((e) => {
			const searchTermCondition = e.portName
				.toLowerCase()
				.replace(/\s/g, "")
				.includes(state.searchLane.toLowerCase().replace(/\s/g, ""));
			return searchTermCondition && checkConditionsInObject(e, state);
		});
	}

	// const getCountryName = (value) => {
	// 	return keyMatchLoop("_id", countryList, value)?.countryName ?? "N/A";
	// };

	const columns = [
		{
			field: "country",
			headerName: "Country",
			width: 150,
			valueGetter: ({ value }) => getCountryName(value),
			flex: 1,
		},
		{
			field: "type",
			headerName: "Type",
			width: 90,
			flex: 1,
			valueGetter: ({ value }) =>
				value === 1 ? "Gateway" : "Destination",
		},
		{ field: "portName", headerName: "Port Name", width: 200, flex: 1 },
		{
			field: "portCode",
			headerName: "Port Code",
			width: 120,
			flex: 1,
			valueFormatter: ({ value }) => value?.toUpperCase(),
		},
		{
			field: "fee",
			headerName: "GATEWAY FEE",
			flex: 1,
			valueGetter: ({ value }) => (value === 0 ? "N/A" : value),
		},
		{
			field: "status",
			headerName: "Status",
			flex: 1,
			renderCell: ({ value }) => <ActiveButton status={value} />,
		},
		{
			field: "Options",
			headerName: "Options",
			width: 100,
			renderCell: ({ row }) => (
				<TableOptions editOnClick={() => changeTypeHandler(row)} />
			),
		},
	];

	// if (isLoading || laneLoading) {
	// 	return <Loader />;
	// }

    const rows = [{
        name:"Bike",
        
    }]

	return (
		<div className={classes.countrydiv}>
			<div className={classes.headingdiv}>
				<div className={classes.titlediv}>
					{!sidebar.sidebarStatus && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => dispatch(openSidebar())}
							className={classes.icon}>
							<MenuIcon />
						</IconButton>
					)}
					<h3 className={classes.title}>Lane Management</h3>
				</div>
				<div className={classes.buttondiv}>
					<button
						className={classes.button}
						onClick={() => {
							setType("insert");
							setPopup(true);
						}}>
						Add Category
					</button>
				</div>
			</div>
			<RightDrawer popup={popup} handleDrawer={toggleDrawer}>
				<AddAndEditCategory
					laneData={selectedRow}
					countries={countryList}
					type={type}
					setPopup={setPopup}
				/>
			</RightDrawer>
			{/* <div className={classes.searchdiv}>
				<div className={classes.searchbox}>
					<img src={searchlogo} alt="searchlogo" />
					<input
						onChange={(e) =>
							updateState("searchLane", e.target.value)
						}
						type="text"
						placeholder="Search Port Name"
					/>
				</div>
				<div className={classes.selectbox}>
					<h4>Filter by</h4>
					<div>
						<FormControl>
							<Select
								className={classes.laneDropdown}
								variant="standard"
								value={searchAndFilterValues.countryName}
								placeholder="Country"
								displayEmpty
								label="Label"
								inputProps={{ "aria-label": "Without label" }}
								onChange={(e) =>
									updateState("countryName", e.target.value)
								}
								fullWidth={true}
								autoWidth={true}
								MenuProps={MenuProps}>
								<MenuItem value="">All Country</MenuItem>
								{countryList &&
									countryList.map((country) => (
										<MenuItem
											className={classes.menuitem}
											key={country._id}
											value={country._id}>
											{country.countryName}
										</MenuItem>
									))}
							</Select>
						</FormControl>
						<FormControl sx={{ padding: "0 20px" }}>
							<Select
								variant="standard"
								placeholder="Status"
								displayEmpty
								value={searchAndFilterValues.status}
								inputProps={{ "aria-label": "Without label" }}
								onChange={(e) =>
									updateState("status", e.target.value)
								}
								sx={{ minWidth: "30%" }}>
								<MenuItem value="">All</MenuItem>
								<MenuItem value={1}>Active</MenuItem>
								<MenuItem value={2}>Inactive</MenuItem>
							</Select>
						</FormControl>
						<FormControl sx={{ padding: "0 20px" }}>
							<Select
								variant="standard"
								placeholder="Type"
								displayEmpty
								value={searchAndFilterValues.type}
								inputProps={{ "aria-label": "Without label" }}
								onChange={(e) =>
									updateState("type", e.target.value)
								}
								sx={{ minWidth: "30%" }}>
								<MenuItem value="">Type</MenuItem>
								<MenuItem value={1}>Gateway</MenuItem>
								<MenuItem value={2}>Destination</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
			</div> */}
			<div
				style={{
					height: 430,
					width: "100%",
					marginTop: "10px",
					borderRadius: "5px",
				}}>
				<DataGrid
					sx={{ textTransform: "capitalize" }}
					getRowId={(row) => row._id}
					rows={rows}
					columns={columns.map((column) => ({
						...column,
						sortable: false,
					}))}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
					pageSizeOptions={[10]}
					// loading={isFetching}
					hideFooterSelectedRowCount={true}
				/>
			</div>
		</div>
	);
}

export default Lane;
