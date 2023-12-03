import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import TableOptions from "../../../components/TableOptions/TableOptions";
import AddAndEditPortHoliday from "./AddAndEditPortHoliday";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import Loader from "../../../components/Loader/Loader";
import {
	useGetPortHolidayList,
	useInsertPortHoliday,
} from "../../../hooks/portHoliday";
import { MdDownload } from "react-icons/md";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useLane } from "../../../hooks/lane";
import holidaySampleExcel from "../../../assets/ExcelFiles/holidays.xlsx";
import CommonPopup from "../../../components/CommonPopup";
import {
	openCommonPopup,
	closeCommonPopup,
} from "../../../redux/slices/commonPopupSlice";
import classes from "./index.module.css";
import DeleteIcon from "@mui/icons-material/Delete";

function PortHoliday() {
	const createdBy = localStorage.getItem("allMasterId");

	const [popup, setPopup] = useState(false);

	const [type, setType] = useState("insert");

	const [selectedRow, setSelectedRow] = useState(null);

	const [searchValue, setSearchValue] = useState("");

	const [fileName, setFileName] = useState(null);

	const fileRef = useRef();

	const dispatch = useDispatch();

	const [file, setFile] = useState(null);

	const [excelFile, setExcelFile] = useState(null);

	const sidebar = useSelector((state) => state.sidebar);

	const { isLoading: holidayLoading, data: holidayList } =
		useGetPortHolidayList();

	const { isLoading: laneLoading, data: laneList } = useLane();

	const titleText = "Holiday Bulk Upload ?";

	const contentText =
		"Are you sure that you want to upload this excel sheet ?";

	const fileType = [
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	];

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

	const onSuccessFunctions = (response) => {
		toast.success(response);
		setFileName(null);
		setExcelFile(null);
	};

	const { mutate } = useInsertPortHoliday(onSuccessFunctions);

	const handleFile = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile && fileType.includes(selectedFile.type)) {
			const reader = new FileReader();
			reader.readAsArrayBuffer(selectedFile);
			reader.onload = (e) => {
				setExcelFile(e.target.result);
				toast.success("File Uploaded");
			};
			setFileName(selectedFile.name);
			setFile(selectedFile);
		} else {
			setFileName(null);
			setExcelFile(null);
			toast.error("Upload Only xls & xlsx file");
		}
		e.target.value = null;
	};

	const columns = [
		{
			field: "portCode",
			headerName: "Port Code",
			width: 120,
			flex: 1,
			valueGetter: ({ value }) => value?.toUpperCase(),
		},
		{
			field: "date",
			headerName: "Date",
			width: 90,
			flex: 1,
			valueGetter: ({ value }) => moment(value).format("DD-MM-YYYY"),
		},
		{ field: "name", headerName: "Holiday Name", width: 200, flex: 1 },
		{
			field: "status",
			headerName: "Status",
			width: 100,
			flex: 1,
			renderCell: ({ value }) => <ActiveButton status={value} />,
		},
		{
			field: "Options",
			headerName: "Options",
			width: 100,
			renderCell: (params) => (
				<TableOptions
					editOnClick={() => changeTypeHandler(params.row)}
				/>
			),
		},
	];

	function handleCommanToggle() {
		dispatch(openCommonPopup());
	}

	const bulkUploadHandler = () => {
		dispatch(closeCommonPopup());
		const payload = [];
		if (!excelFile) {
			toast.error("Please upload the excel file");
		}
		const workbook = XLSX.read(excelFile, { type: "buffer" });
		const worksheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[worksheetName];
		const excelData = XLSX.utils.sheet_to_json(worksheet);
		const today = moment().format("DD-MM-YYYY");
		for (let i = 0; i < excelData.length; i++) {
			if (
				typeof excelData[i].Port_Code !== "string" ||
				typeof excelData[i].Holiday_Name !== "string"
			) {
				toast.error("Invalid excel data");
				return false;
			} else if (
				!excelData[i].Port_Code ||
				!excelData[i].Date ||
				!excelData[i].Holiday_Name ||
				!excelData[i].Holiday_Name.trim()
			) {
				toast.error("Mandatory fields can not be empty");
				return false;
			} else if (!/^[A-Za-z\s]*$/.test(excelData[i].Holiday_Name)) {
				toast.error("Invalid Holiday name");
				return false;
			} else if (!(excelData[i].Port_Code.length === 5)) {
				toast.error("Invalid Port code");
				return false;
			} else if (!moment(excelData[i].Date, "DD-MM-YYYY").isValid()) {
				toast.error("Invalid Date");
				return false;
			} else if (
				!moment(excelData[i].Date, "DD-MM-YYYY").isSameOrAfter(
					moment(today, "DD-MM-YYYY")
				)
			) {
				toast.error("Holiday Dates must be Today or Future Dates");
				return false;
			} else if (
				typeof excelData[i].Status === "string"
					? !(
							excelData[i].Status === "1" ||
							excelData[i].Status === "2"
					  )
					: !(excelData[i].Status === 1 || excelData[i].Status === 2)
			) {
				toast.error("Invalid data in Status column");
				return false;
			} else if (
				!laneList.find((lane) => {
					return (
						lane.portCode.toLowerCase() ===
						excelData[i].Port_Code.toLowerCase()
					);
				})
			) {
				toast.error("Port Code does not exit in lane");
				return false;
			} else {
				payload.push({
					portCode: excelData[i].Port_Code,
					date: moment(excelData[i].Date, "DD-MM-YYYY").format(
						"MM-DD-YYYY"
					),
					name: excelData[i].Holiday_Name,
					createdBy,
					status: excelData[i].Status,
				});
			}
		}
		mutate(payload);
	};

	const downloadExcel = (file) => {
		const fileUrl = window.URL.createObjectURL(file);
		window.location.href = fileUrl;
	};

	if (holidayLoading || laneLoading) {
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
					<h3 className={classes.title}>Port Holiday Management</h3>
				</div>
				<div className={classes.buttondiv}>
					<button
						className={classes.button}
						onClick={() => {
							setType("insert");
							setPopup(true);
						}}>
						Add Holiday
					</button>
					<div>
						<input
							ref={fileRef}
							type="file"
							className={classes.uploadicon}
							onChange={handleFile}
						/>
					</div>
					<div className="d-flex center">
						<button
							onClick={() => fileRef.current.click()}
							className={classes.button}>
							Upload Xls/Xlsx
						</button>
					</div>

					<button
						disabled={!excelFile}
						onClick={() => handleCommanToggle()}
						className={`${classes.button} ${classes.submitdisabled}`}>
						Submit
					</button>
				</div>
			</div>
			<div
				style={{
					margin: "10px 0",
					display: "flex",
					gap: "10px",
					justifyContent: "flex-end",
				}}>
				<p
					style={{ cursor: "pointer" }}
					onClick={() => {
						downloadExcel(file);
					}}>
					{fileName}
				</p>
				{fileName && (
					<DeleteIcon
						sx={{
							cursor: "pointer",
							color: "red",
						}}
						onClick={() => {
							setFileName(null);
							setExcelFile(null);
						}}
					/>
				)}
				<a href={holidaySampleExcel} download="holidays.xls">
					Sample-Excel <MdDownload />
				</a>
			</div>
			<RightDrawer popup={popup} handleDrawer={toggleDrawer}>
				<AddAndEditPortHoliday
					holidayData={selectedRow}
					laneList={laneList}
					type={type}
					setPopup={setPopup}
				/>
			</RightDrawer>
			<div className={classes.searchdiv}>
				<div className={classes.searchbox}>
					<img src={searchlogo} alt="searchlogo" />
					<input
						onChange={(e) => setSearchValue(e.target.value)}
						type="text"
						placeholder="Search Holiday Name"
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
					rows={holidayList
						.filter((holiday) =>
							holiday.name
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
					rowsPerPageOptions={[10]}
					loading={holidayLoading}
					hideFooterSelectedRowCount={true}
				/>
			</div>
			<CommonPopup
				handleAgree={bulkUploadHandler}
				titleText={titleText}
				contentText={contentText}
			/>
		</div>
	);
}

export default PortHoliday;
