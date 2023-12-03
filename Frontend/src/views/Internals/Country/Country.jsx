import { useState } from "react";
import "./Country.css";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import { MenuItem, Select, IconButton } from "@mui/material";
import TableOptions from "../../../components/TableOptions/TableOptions";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import AddAndEditCountry from "./AddAndEditCountry";
import { useCountries } from "../../../hooks/country";
import Loader from "../../../components/Loader/Loader";
import { convertFirstLettersAsUpperCase } from "../../../helper";

function Country() {
	const [popup, setPopup] = useState(null);
	const [alignment, setAlignment] = useState("left");
	const [editData, setEditData] = useState(null);
	const dispatch = useDispatch();
	const [searchAndFilterValues, setSearchAndFilterValues] = useState({
		searchTerm: "",
		region: "",
	});
	const sidebar = useSelector((state) => state.sidebar);
	const regionData = [
		"Asia",
		"Africa",
		"Australia",
		"North America",
		"South America",
		"Central America",
		"Europe",
	];

	const { data, isLoading, isError, error, isFetching } = useCountries();

	function updateState(key, value) {
		setSearchAndFilterValues({ ...searchAndFilterValues, [key]: value });
	}

	function checkConditionsInObject(object, state) {
		return object.region.toLowerCase().includes(state.region.toLowerCase());
	}

	function filterArrayUsingSearchTermAndFilters(array, state) {
		return array.filter((e) => {
			const searchTermCondition = e.countryName
				.toLowerCase()
				.replace(/\s/g, "")
				.includes(state.searchTerm.toLowerCase().replace(/\s/g, ""));
			return searchTermCondition && checkConditionsInObject(e, state);
		});
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

	const handleAlignment = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	const columns = [
		{
			field: "countryName",
			flex: 1,
			headerName: "Country",
			width: 150,
			valueFormatter: ({ value }) =>
				convertFirstLettersAsUpperCase(value),
		},
		{
			field: "countryCode",
			flex: 1,
			valueFormatter: ({ value }) => value?.toUpperCase(),
			headerName: "Country Code",
			width: 150,
		},
		{
			field: "region",
			flex: 1,
			headerName: "Region",
			width: 200,
			valueFormatter: ({ value }) =>
				convertFirstLettersAsUpperCase(value),
		},
		{
			flex: 1,
			field: "status",
			headerName: "Status",
			width: 140,
			renderCell: ({ value }) => <ActiveButton status={value} />,
		},
		{
			flex: 1,
			field: "Options",
			sortable: false,
			width: 100,
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

	if (isLoading) {
		return <Loader />;
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
					<h3 className="title">Countries</h3>
				</div>
				<div className="buttondiv">
					<button className="button" onClick={() => setPopup("add")}>
						Add Country
					</button>
				</div>
			</div>
			<RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
				{popup === "add" ? (
					<AddAndEditCountry
						alignment={alignment}
						isEdit={popup === "edit"}
						regionData={regionData}
						handleAlignment={handleAlignment}
						onCloseButtonClick={() => setPopup(null)}
					/>
				) : (
					<AddAndEditCountry
						alignment={alignment}
						regionData={regionData}
						handleAlignment={handleAlignment}
						onCloseButtonClick={() => setPopup(null)}
						isEdit={popup === "edit"}
						editData={editData}
					/>
				)}
			</RightDrawer>
			<div className="searchdiv">
				<div className="searchbox">
					<img src={searchlogo} alt="searchlogo" />
					<input
						type="text"
						onChange={(e) =>
							updateState("searchTerm", e.target.value)
						}
						placeholder="Search Country"
					/>
				</div>
				<div className="selectbox">
					<h4>Filter by</h4>
					<div>
						<Select
							variant="standard"
							displayEmpty
							onChange={(e) =>
								updateState("region", e.target.value)
							}
							value={searchAndFilterValues.region}
							sx={{ width: "40%" }}>
							<MenuItem value="">All</MenuItem>
							{regionData.map((e, index) => (
								<MenuItem key={index} value={e}>
									{e}
								</MenuItem>
							))}
						</Select>
					</div>
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
					rows={filterArrayUsingSearchTermAndFilters(
						data,
						searchAndFilterValues
					).reverse()}
					columns={columns}
					getRowId={(data) => data._id}
					disableRowSelectionOnClick
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
					pageSizeOptions={[10]}
					loading={isFetching}
					hideFooterSelectedRowCount={true}
				/>
			</div>
		</div>
	);
}

export default Country;
