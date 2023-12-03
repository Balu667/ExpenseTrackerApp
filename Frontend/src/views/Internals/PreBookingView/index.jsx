import styles from "./index.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { CheckoutCargoDetails } from "../../../components/CargoDetails";
import { SummaryRateCard } from "../../../components/SummaryRateCard";
import { useGetBookingList } from "../../../hooks/dashboard";
import { useSchedulesBasedRates } from "../../../hooks/cargoDetail";
import { calculateCurrentPriceBySchedule } from "../../../helper";
import MenuIcon from "@mui/icons-material/Menu";
import Loader from "../../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useGetBookingDetailsById } from "../../../hooks/booking";
import { useEffect, useState, useRef } from "react";
import { ReactComponent as BackButton } from "../../../assets/Icons/back.svg";

function BookingCheckout() {
	const { scheduleId, bookingId } = useParams();

	const dispatch = useDispatch();

	const sidebar = useSelector((state) => state.sidebar);

	const navigate = useNavigate();
	const [containerWidth, setContainerWidth] = useState(0);
	const containerDivRef = useRef(null);
	const updateWidth = () => {
		if (containerDivRef.current?.clientWidth !== containerWidth) {
			setContainerWidth(containerDivRef.current?.clientWidth);
		}
	};
	const resiseObserver = new ResizeObserver(updateWidth);

	useEffect(() => {
		if (containerDivRef.current != null) {
			resiseObserver.observe(containerDivRef.current);
		}
		return () => {
			resiseObserver.disconnect();
		};
	});

	const { data: fullData, isLoading: fullDataLoading } =
		useGetBookingDetailsById(bookingId);

	const {
		isLoading: scheduleRateLoading,
		data: scheduleRateData,
		isSuccess: scheduleSuccess,
	} = useSchedulesBasedRates(scheduleId);

	const {
		data: bookingList,
		isLoading: bookingLoading,
		isSuccess: bookingListSuccess,
	} = useGetBookingList();

	const newScheduleData =
		bookingListSuccess && scheduleSuccess
			? calculateCurrentPriceBySchedule(bookingList, scheduleRateData[0])
			: null;

	if (scheduleRateLoading || bookingLoading || fullDataLoading) {
		return <Loader />;
	}

	return (
		<div ref={containerDivRef} className={styles.container}>
			<div className={styles.titlecon}>
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
				<span>
					<button
						onClick={() => navigate(-1)}
						className={styles.backBtn}>
						{" "}
						<BackButton /> Back
					</button>
				</span>
			</div>
			<div>
				<h2 className={styles.title}>Pre Booking Summary</h2>
			</div>
			<div
				className={`${styles.mainbox} ${
					containerWidth < "1100" ? styles.mainboxdiv : ""
				}`}>
				<div
					className={`${styles.titlediv} ${
						containerWidth < "1100" ? styles.titledivres : ""
					}`}>
					<div className={styles.checkoutflexdiv}>
						<div className={styles.checkoutflex}>
							<h1 className={styles.headtitle}>
								Additional Details
							</h1>
						</div>
						<div className={styles.addDetailsDiv}>
							<div className="d-flex gap-2 align-items-center">
								<p className={styles.detailsdivlabel}>
									Booking ID
								</p>
								<div className={styles.dotted}></div>
								<p className={styles.idDisplay}>
									{fullData.bId}
								</p>
							</div>
						</div>
					</div>
					<div className={styles.checkoutgriddiv}>
						<div>
							<h1 className={styles.headtitle}>
								Booking Details
							</h1>
						</div>
						<div>
							<CheckoutCargoDetails data={fullData} />
						</div>
					</div>
					<div className="row"></div>
				</div>
				<SummaryRateCard
					cargoDetails={fullData}
					scheduleData={newScheduleData}
					bookingList={bookingList}
					type="prebooking"
					containerWidth={containerWidth < "1100"}
				/>
			</div>
		</div>
	);
}
export default BookingCheckout;
