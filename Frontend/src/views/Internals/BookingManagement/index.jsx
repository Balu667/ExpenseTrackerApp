import styles from "./index.module.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useScheduleBasedBookings } from "../../../hooks/bookingManagement";
import { useLane } from "../../../hooks/lane";
import { keyMatchLoop, calculateCurrentPriceBySchedule } from "../../../helper";
import Loader from "../../../components/Loader/Loader";
import BookingDetail from "../../../components/BookingManagementBookings";
import moment from "moment";
import { useState } from "react";
import { MenuItem, Select } from "@mui/material";

function Booking() {
	const dispatch = useDispatch();
	const sidebar = useSelector((state) => state.sidebar);
	const { role } = useSelector((state) => state.profile);
	const [seacrhFilters, setSearchFilters] = useState({
		searchTerm: "",
		statusFilter: "",
	});
	const {
		isLoading: bookingScheduleLoading,
		data: bookingScheduleList,
		error: isBookingScheduleError,
	} = useScheduleBasedBookings();
	const {
		isLoading: laneLoading,
		data: laneList,
		error: isLaneError,
	} = useLane();

	function filterArray(array) {
		return array.filter(
			({ scheduleData: { scheduleId, status } }) =>
				scheduleId
					.toLowerCase()
					.replace(/\s/g, "")
					.includes(
						seacrhFilters.searchTerm
							.toLowerCase()
							.replace(/\s/g, "")
					) && `${status}`.includes(seacrhFilters.statusFilter)
		);
	}

	if (bookingScheduleLoading || laneLoading) {
		return <Loader />;
	}

	if (isBookingScheduleError) {
		return <div>{isBookingScheduleError}</div>;
	}

	if (isLaneError) {
		return <div>{isLaneError}</div>;
	}

	let bookingScheduleListOrderByEtd = bookingScheduleList.sort(function (
		left,
		right
	) {
		return moment
			.utc(left.scheduleData.etd)
			.diff(moment.utc(right.scheduleData.etd));
	});

	const leftCbm = (volume, bookingCbm) => {
		const bookedCbm = volume - bookingCbm;
		if (Number.isInteger(bookedCbm)) {
			return Number(bookedCbm);
		} else {
			return Number(bookedCbm).toFixed(2);
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
					<h3 className={styles.title}>Booking Management</h3>
				</div>
			</div>
			<div className={styles.searchdiv}>
				<div className={styles.chsearchbox}>
					<img src={searchlogo} alt="searchlogo" />
					<input
						type="text"
						onChange={(e) =>
							setSearchFilters({
								...seacrhFilters,
								searchTerm: e.target.value,
							})
						}
						placeholder="Search Schedule ID"
					/>
				</div>
				<div className={styles.selectbox}>
					<h4>Filter by</h4>
					<div>
						<Select
							variant="standard"
							displayEmpty
							onChange={(e) =>
								setSearchFilters({
									...seacrhFilters,
									statusFilter: e.target.value,
								})
							}
							value={seacrhFilters.statusFilter}
							sx={{ width: "40%" }}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="1">Active</MenuItem>
							<MenuItem value="2">Inactive</MenuItem>
						</Select>
					</div>
				</div>
			</div>
			<div className={styles.bookingdetailsdiv}>
				{bookingScheduleListOrderByEtd.length > 0 &&
					filterArray(bookingScheduleListOrderByEtd).map(
						(value, index) => {
							let pol;
							let pod;
							let etd;
							let eta;
							let scheduleData;
							let bookingData;
							let prebookings = [];
							let bookings = [];
							let paymentCompletedBookings = [];
							let bookingCbm = 0;
							let cbmFilledPercent;
							let startPrice;
							let currentPrice;
							let priceData;
							let predictedPrice;
							let polName;
							let podName;

							scheduleData = value.scheduleData;
							bookingData = value.bookingData;

							bookingData.map((value) => {
								if (value.status === 2) {
									prebookings.push(value);
								}

								if (value.status === 1) {
									bookingCbm += Number(value.totalCbm);
									bookings.push(value);
								}
								if (value.status === 9) {
									bookingCbm += Number(value.totalCbm);
									paymentCompletedBookings.push(value);
								}
								return 0;
							});

							pol = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pol
							).portCode.toUpperCase();
							polName = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pol
							).portName;
							pod = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pod
							).portCode.toUpperCase();
							podName = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pod
							).portName;
							etd = moment(scheduleData.etd).format("DD-MM-YYYY");
							eta = moment(scheduleData.eta).format("DD-MM-YYYY");
							cbmFilledPercent =
								100 -
								Math.round(
									((scheduleData.volume - bookingCbm) /
										scheduleData.volume) *
										100
								);

							startPrice =
								scheduleData.finalRates.FOCFS +
								scheduleData.finalRates.FF +
								scheduleData.finalRates.FDCFS;
							priceData = calculateCurrentPriceBySchedule(
								bookingData,
								scheduleData
							);

							startPrice =
								scheduleData.finalRates.FOCFS +
								scheduleData.finalRates.FF +
								scheduleData.finalRates.FDCFS;
							priceData = calculateCurrentPriceBySchedule(
								bookingData,
								scheduleData
							);
							currentPrice =
								priceData.originCurrentPrice +
								priceData.frightCurrentPrice +
								priceData.destinationCurrentPrice;
							predictedPrice =
								scheduleData.predictionRates.POCFS +
								scheduleData.predictionRates.PF +
								scheduleData.predictionRates.PDCFS;

							return (
								<BookingDetail
									key={index}
									scheduleId={`${scheduleData.scheduleId}`}
									polCode={pol}
									podCode={pod}
									polName={polName}
									podName={podName}
									cbm={leftCbm(
										scheduleData.volume,
										bookingCbm
									)}
									paymentCompleted={
										paymentCompletedBookings.length
									}
									startPrice={startPrice}
									currentPrice={currentPrice}
									predictedPrice={predictedPrice}
									chargeOne={prebookings.length}
									chargeTwo={bookings.length}
									nowValue={cbmFilledPercent}
									trendingStatus={1}
									ETD={`${etd}`}
									ETA={`${eta}`}
									url={
										role === 2
											? `/admin/bookinglist/${value._id}`
											: `/ot/bookinglist/${value._id}`
									}
								/>
							);
						}
					)}
			</div>
		</div>
	);
}

export default Booking;
