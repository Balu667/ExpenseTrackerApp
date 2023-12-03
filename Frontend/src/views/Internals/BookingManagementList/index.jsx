import styles from "./index.module.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useBookingManagement } from "../../../hooks/bookingManagement";
import { useGetAllUsers } from "../../../hooks/userManagement";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import Loader from "../../../components/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ContainerManagement from "./ContainerManagement";
import moment from "moment";
import { keyMatchLoop } from "../../../helper";
import { useScheduleOnce } from "../../../hooks/schedule";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function BookingManagementList() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sidebar = useSelector((state) => state.sidebar);
	const { role } = useSelector((state) => state.profile);
	const [bookingType, setBookingType] = useState("all");
	const { id } = useParams();
	const [seacrhTerm, setSearchTerm] = useState("");
	const [containerView, setContainerView] = useState(false);
	const [bookingCutOff, setBookingCutOff] = useState(null);

	const {
		isLoading: bookingLoading,
		data: bookingList,
		isSuccess: bookingSuccess,
		error: bookingErrors,
	} = useBookingManagement(id);

	const {
		isLoading: usersLoading,
		data: usersList,
		isSuccess: usersSuccess,
		error: usersErrors,
	} = useGetAllUsers([1]);

	const { isLoading: scheduleLoading, data: scheduleList } = useScheduleOnce({
		refetchInterval: false,
		refetchOnWindowFocus: false,
	});

	const scheduleDatas = () => {
		const scheduleData = keyMatchLoop("_id", scheduleList, id);
		setBookingCutOff(scheduleData.bookingCutOff);
	};

	useEffect(() => {
		if (scheduleList) {
			scheduleDatas();
		}
	}, [scheduleList]);

	const columns = [
		{
			field: "bookingid",
			headerName: "Booking ID",
			flex: 1,
			cellClassName: "scheduleStyle",
		},
		{
			field: "tv",
			headerName: "TOTAL VOLUME",
			flex: 1,
		},
		{
			field: "tw",
			headerName: "TOTAL WEIGHT",
			flex: 1,
		},
		{
			field: "company",
			headerName: "COMPANY",
			flex: 1,
		},
		{
			field: "user",
			headerName: "USER",
			flex: 1,
		},
		{
			field: "options",
			headerName: "VIEW",
			flex: 1,
			renderCell: (params) => {
				return (
					<button
						onClick={() =>
							navigate(
								role === 2
									? params.row.status === 1 ||
									  params.row.status === 9
										? `/admin/booking/${params.row.scheduleId}/${params.row.id}`
										: `/admin/prebooking/${params.row.scheduleId}/${params.row.id}`
									: params.row.status === 1 ||
									  params.row.status === 9
									? `/ot/booking/${params.row.scheduleId}/${params.row.id}`
									: `/ot/prebooking/${params.row.scheduleId}/${params.row.id}`
							)
						}
						className={styles.viewinfo}>
						View Info
					</button>
				);
			},
		},
	];
	let rows = [];
	let prebooking = [];
	let booking = [];
	let paymentCompletedBooking = [];
	let amendmentBookings = [];

	if (bookingSuccess && usersSuccess) {
		bookingList.map((value, i) => {
			let userName = "";
			let singleUserData = usersList.filter((userValue) => {
				return userValue._id === value.createdBy;
			});

			if (singleUserData.length > 0) {
				userName = singleUserData[0].fullName;
			}

			if (value.amendmentStatus) {
				amendmentBookings.push({
					id: value._id,
					scheduleId: value.scheduleId,
					bookingid: value.bId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
					status: value.status,
				});
			}

			if (value.status === 2) {
				prebooking.push({
					id: value._id,
					scheduleId: value.scheduleId,
					bookingid: value.bId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
					status: value.status,
				});
				rows.push({
					id: value._id,
					scheduleId: value.scheduleId,
					bookingid: value.bId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
					status: value.status,
				});
			}

			if (value.status === 9) {
				paymentCompletedBooking.push({
					id: value._id,
					scheduleId: value.scheduleId,
					bookingid: value.bId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
					status: value.status,
				});
				rows.push({
					id: value._id,
					scheduleId: value.scheduleId,
					bookingid: value.bId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
					status: value.status,
				});
			}

			if (value.status === 1) {
				booking.push({
					id: value._id,
					scheduleId: value.scheduleId,
					bookingid: value.bId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
					status: value.status,
				});
				rows.push({
					id: value._id,
					scheduleId: value.scheduleId,
					bookingid: value.bId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
					status: value.status,
				});
			}
			return false;
		});
	}

	function filterArray(array) {
		return array
			.reverse()
			.filter((item) =>
				item?.company
					.toLowerCase()
					.replace(/\s/g, "")
					.includes(seacrhTerm.toLowerCase().replace(/\s/g, ""))
			);
	}

	if (bookingLoading || usersLoading) {
		return <Loader />;
	}

	if (bookingErrors || usersErrors) {
		return (
			<>
				{bookingErrors} {usersErrors}
			</>
		);
	}
	const changeView = () => {
		setContainerView(!containerView);
	};

	const getBookingTypeData = (type) => {
		let data = [];
		switch (type) {
			case "all":
				data = rows;
				break;
			case "prebooking":
				data = prebooking;
				break;
			case "booking":
				data = booking;
				break;
			case "payment":
				data = paymentCompletedBooking;
				break;
			case "amendment":
				data = amendmentBookings;
				break;
			default:
				return null;
		}
		return data;
	};

	return (
		<div className={styles.countrydiv}>
			<div className="container">
				<div className={styles.backbtndiv}>
					<button
						className={styles.backbtn}
						onClick={() => navigate("/admin/booking")}>
						<ChevronLeftIcon /> Back
					</button>
				</div>
				<div className={styles.titledivs}>
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

					<div className={styles.tapdiv}>
						<div className={styles.btnitems}>
							<div
								onClick={() => setBookingType("all")}
								className={styles.flextapdiv}>
								<div
									className={
										bookingType === "all"
											? `${styles.activenumber} ${styles.flextapdivtxt}`
											: `${styles.flextapdivtxt}`
									}>
									<p>
										{prebooking.length +
											booking.length +
											paymentCompletedBooking.length}
									</p>
								</div>
								<button
									className={
										bookingType === "all"
											? `${styles.activbtn}`
											: ""
									}>
									All
								</button>
							</div>
							<div
								onClick={() => setBookingType("prebooking")}
								className={styles.flextapdiv}>
								<div
									className={
										bookingType === "prebooking"
											? `${styles.activenumber} ${styles.flextapdivtxt}`
											: `${styles.flextapdivtxt}`
									}>
									<p>{prebooking.length}</p>
								</div>
								<button
									className={
										bookingType === "prebooking"
											? `${styles.activbtn}`
											: ""
									}>
									Pre Booking
								</button>
							</div>
							<div
								onClick={() => setBookingType("booking")}
								className={styles.flextapdiv}>
								<div
									className={
										bookingType === "booking"
											? `${styles.activenumber} ${styles.flextapdivtxt}`
											: `${styles.flextapdivtxt}`
									}>
									<p>{booking.length}</p>
								</div>
								<button
									className={
										bookingType === "booking"
											? `${styles.activbtn}`
											: ""
									}>
									Booked
								</button>
							</div>
							<div
								onClick={() => setBookingType("payment")}
								className={styles.flextapdiv}>
								<div
									className={
										bookingType === "payment"
											? `${styles.activenumber} ${styles.flextapdivtxt}`
											: `${styles.flextapdivtxt}`
									}>
									<p>{paymentCompletedBooking.length}</p>
								</div>
								<button
									className={
										bookingType === "payment"
											? `${styles.activbtn}`
											: ""
									}>
									Payment Completed
								</button>
							</div>
							<div
								onClick={() => setBookingType("amendment")}
								className={styles.flextapdiv}>
								<div
									className={
										bookingType === "amendment"
											? `${styles.activenumber} ${styles.flextapdivtxt}`
											: `${styles.flextapdivtxt}`
									}>
									<p>{amendmentBookings.length}</p>
								</div>
								<button
									className={
										bookingType === "amendment"
											? `${styles.activbtn}`
											: ""
									}>
									Amendment
								</button>
							</div>
						</div>
					</div>
				</div>
				{containerView ? (
					<ContainerManagement
						changeView={changeView}
						scheduleLoading={scheduleLoading}
						scheduleList={scheduleList}
						id={id}
					/>
				) : (
					<div>
						<div className={styles.searchdiv}>
							<div className={styles.chsearchbox}>
								<img src={searchlogo} alt="searchlogo" />
								<input
									type="text"
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									placeholder="Search Company Name"
								/>
							</div>
							<div>
								<button
									className={styles.containermanagement}
									disabled={
										!moment().isAfter(bookingCutOff, "day")
									}
									onClick={() => changeView()}>
									Container Management
								</button>
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
								style={{ textTransform: "capitalize" }}
								getRowId={(row) => row.id}
								columns={columns}
								rows={filterArray(
									getBookingTypeData(bookingType)
								)}
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
					</div>
				)}
			</div>
		</div>
	);
}

export default BookingManagementList;
