import { useState } from "react";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import AddAndEditCostHeading from "./AddAndEditCostHeading";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import TableOptions from "../../../components/TableOptions/TableOptions";
import Loader from "../../../components/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useCostheading } from "../../../hooks/costheading";
import { useCountries } from "../../../hooks/country";
import { keyMatchLoop } from "../../../helper";
import classes from "./index.module.css";

function CostHeading() {
	const [popup, setPopup] = useState(false);

	const [searchValue, setSearchValue] = useState("");

	const [type, setType] = useState("insert");

	const [selectedRow, setSelectedRow] = useState(null);

	const sidebar = useSelector((state) => state.sidebar);

	const dispatch = useDispatch();

	const { isLoading, data: costheadingList, isFetching } = useCostheading();

	const { isLoading: countryLoading, data } = useCountries();

	const toggleDrawer = () => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return setPopup(false);
		}
		setPopup(false);
	};

	const changeTypeHandler = (row) => {
		setSelectedRow(row);
		setType("edit");
		setPopup(true);
	};

	const columns = [
		{ field: "sacCode", flex: 1, headerName: "Sac Code" },
		{
			field: "costHeading",
			flex: 1,
			headerName: "Cost Heading",
		},
		{
			field: "country",
			flex: 1,
			headerName: "Applicable Country",
			valueGetter: ({ value }) =>
				keyMatchLoop("_id", data, value)?.countryName ?? "N/A",
		},
		{
			field: "status",
			flex: 1,
			headerName: "Status",
			renderCell: ({ value }) => <ActiveButton status={value} />,
		},
		{
			field: "options",
			headerName: "Options",
			flex: 1,
			renderCell: ({ row }) => (
				<TableOptions editOnClick={() => changeTypeHandler(row)} />
			),
		},
	];

	if (isLoading || countryLoading) {
		return <Loader />;
	}

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
					<h3 className={classes.title}>Cost Heading</h3>
				</div>
				<div className={classes.buttondiv}>
					<button
						className={classes.button}
						onClick={() => {
							setPopup(true);
							setType("insert");
						}}>
						Add Cost Heading
					</button>
				</div>
			</div>
			<RightDrawer popup={popup} handleDrawer={toggleDrawer}>
				<AddAndEditCostHeading
					countries={data.filter((data) => data.status === 1)}
					costHeadingdata={costheadingList}
					costHeadingData={selectedRow}
					setPopup={setPopup}
					type={type}
				/>
			</RightDrawer>
			<div className={classes.searchdiv}>
				<div className={classes.chsearchbox}>
					<img src={searchlogo} alt="searchlogo" />
					<input
						onChange={(e) => setSearchValue(e.target.value)}
						type="text"
						placeholder="Search Cost Heading"
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
					getRowId={(row) => row._id}
					rows={costheadingList
						.filter((costheading) =>
							costheading.costHeading
								.toLowerCase()
								.replace(/\s/g, "")
								.includes(
									searchValue.toLowerCase().replace(/\s/g, "")
								)
						)
						.reverse()}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
					loading={isFetching}
					hideFooterSelectedRowCount={true}
				/>
			</div>
		</div>
	);
}

export default CostHeading;
