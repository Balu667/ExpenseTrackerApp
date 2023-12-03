import styles from "./index.module.css";
import searchlogo from "../../../assets/Images/searchlogo.png";
import PreBooking from "../../../components/PreBooking";
import Booked from "../../../components/BookedCards";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import {
	useGetBookingList,
	useLegalNameBookingList,
} from "../../../hooks/dashboard";
import moment from "moment/moment";
import { useLane } from "../../../hooks/lane";
import { calculateCurrentPriceBySchedule, keyMatchLoop } from "../../../helper";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import EmptyBooking from "../../../components/EmptyBooking";
import { useBookingById } from "../../../hooks/cargoDetail";
import { setSelectedCard } from "../../../redux/slices/myBookingsCardSlice";
import {
	insertBookingId,
	removeAllDetails,
} from "../../../redux/slices/checkoutSlice";

function Booking() {
	let userDetail = useSelector((state) => state.profile.profileData);
	const [searchValue, setSearchValue] = useState("");
	const navigate = useNavigate();
	const { hash } = useLocation();
	const bookingType = hash ? hash.slice(1) : "all";
	const dispatch = useDispatch();
	let preBooking = 0;
	let booking = 0;
	let paymentCompletedBooking = 0;

	const { data: bookingsdata, isLoading: bookingsLoading } =
		useLegalNameBookingList(
			{
				refetchInterval: false,
				refetchOnWindowFocus: false,
			},
			userDetail.legalName
		);

	const { data: bookingList, isLoading: bookingListLoading } =
		useGetBookingList();

	const { isLoading: laneLoading, data: laneList } = useLane({
		refetchInterval: false,
		refetchOnWindowFocus: false,
	});

	const { mutate: getBookingById, isLoading: getBookingByIdIsLoading } =
		useBookingById();

	const onBookedViewDetailsClick = (scheduleId, bookingId, bid) => {
		dispatch(setSelectedCard(bid));
		navigate(`/user/mybookings/${scheduleId}/${bookingId}`);
	};

	const onPreBookedViewDetailsClick = (scheduleId, bookingId, bId) => {
		dispatch(setSelectedCard(bId));
		dispatch(removeAllDetails());
		dispatch(insertBookingId(bookingId));
		navigate(`/user/booking/${scheduleId}#1`);
	};

	function returnFilteredArray(bookingArray) {
		return bookingArray
			.filter((booking) =>
				booking.bookingData.bId
					.toLowerCase()
					.replace(/\s/g, "")
					.includes(searchValue.toLowerCase().replace(/\s/g, ""))
			)
			.reverse();
	}

	useEffect(() => {
		if (bookingListLoading === false) {
			document.querySelector(".is-selected")?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [bookingListLoading]);

	if (
		bookingsLoading ||
		laneLoading ||
		bookingListLoading ||
		getBookingByIdIsLoading
	) {
		return <Loader />;
	}

	if (bookingsdata != null) {
		for (let i = 0; i < bookingsdata?.length; i += 1) {
			if (bookingsdata[i].bookingData.status === 2) {
				preBooking += 1;
			}

			if (bookingsdata[i].bookingData.status === 1) {
				booking += 1;
			}
			if (bookingsdata[i].bookingData.status === 9) {
				paymentCompletedBooking += 1;
			}
		}
	}

	const renderBookingArray = returnFilteredArray(bookingsdata);

	return (
		<div className={`container ${styles.containerdiv}`}>
			<div className={styles.headingdiv}>
				<div className={styles.titlediv}>
					<h3 className={`${styles.title} text-capitalize`}>
						{`${userDetail.legalName}'s`} Bookings
					</h3>
				</div>
			</div>
			<div className={styles.tapdiv}>
				<div
					onClick={() => {
						navigate("/user/mybookings#all");
					}}
					className={styles.flextapdiv}>
					<div
						className={`${styles.flextapdivtxt} ${
							bookingType === "all" ? styles.activenumber : ""
						}`}>
						<p>{preBooking + booking + paymentCompletedBooking}</p>
					</div>
					<button
						className={`${styles.flextapdivbutton} ${
							bookingType === "all" ? styles.activbtn : ""
						}`}>
						All
					</button>
				</div>
				<div
					onClick={() => {
						navigate("/user/mybookings#prebooking");
					}}
					className={styles.flextapdiv}>
					<div
						className={`${styles.flextapdivtxt} ${
							bookingType === "prebooking"
								? styles.activenumber
								: ""
						}`}>
						<p>{preBooking}</p>
					</div>
					<button
						className={`${styles.flextapdivbutton} ${
							bookingType === "prebooking" ? styles.activbtn : ""
						}`}>
						Pre Booking
					</button>
				</div>
				<div
					onClick={() => {
						navigate("/user/mybookings#booking");
					}}
					className={styles.flextapdiv}>
					<div
						className={`${styles.flextapdivtxt} ${
							bookingType === "booking" ? styles.activenumber : ""
						}`}>
						<p>{booking}</p>
					</div>
					<button
						className={`${styles.flextapdivbutton} ${
							bookingType === "booking" ? styles.activbtn : ""
						}`}>
						Booked
					</button>
				</div>
				<div
					onClick={() => {
						navigate("/user/mybookings#payment");
					}}
					className={styles.flextapdiv}>
					<div
						className={`${styles.flextapdivtxt} ${
							bookingType === "payment" ? styles.activenumber : ""
						}`}>
						<p>{paymentCompletedBooking}</p>
					</div>
					<button
						className={`${styles.flextapdivbutton} ${
							bookingType === "payment" ? styles.activbtn : ""
						}`}>
						Payment Completed
					</button>
				</div>
			</div>
			{preBooking + booking + paymentCompletedBooking > 0 ? (
				<div>
					<div className={styles.searchdiv}>
						<div className={styles.searchbox}>
							<img src={searchlogo} alt="searchlogo" />
							<input
								type="text"
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder="Search Bookings"
							/>
						</div>
					</div>

					<div className={styles.carddiv}>
						{renderBookingArray.length > 0 &&
							renderBookingArray.map((value, i) => {
								let polCode = keyMatchLoop(
									"_id",
									laneList,
									value.scheduleData.pol
								).portCode.toUpperCase();

								let polName = keyMatchLoop(
									"_id",
									laneList,
									value.scheduleData.pol
								).portName;

								let podCode = keyMatchLoop(
									"_id",
									laneList,
									value.scheduleData.pod
								).portCode.toUpperCase();

								let podName = keyMatchLoop(
									"_id",
									laneList,
									value.scheduleData.pod
								).portName;

								let scheduleData =
									calculateCurrentPriceBySchedule(
										bookingList,
										value.scheduleData
									);

								let defaultCbm = 1;
								let startPrice =
									(scheduleData.finalRates.FOCFS +
										scheduleData.finalRates.FF +
										scheduleData.finalRates.FDCFS) *
									defaultCbm;

								let predictedPrice =
									scheduleData.predictionRates.POCFS +
									scheduleData.predictionRates.PDCFS +
									scheduleData.predictionRates.PF;

								let currentPrice = Math.round(
									(scheduleData.originCurrentPrice +
										scheduleData.frightCurrentPrice +
										scheduleData.destinationCurrentPrice) *
										defaultCbm
								);

								const bookingFilled = Math.round(
									((scheduleData.volume -
										(scheduleData.volume -
											scheduleData.totalCbmBooked)) /
										scheduleData.volume) *
										100
								);

								switch (true) {
									case value.bookingData.status === 2 &&
										(bookingType === "all" ||
											bookingType === "prebooking"):
										return (
											<PreBooking
												bookingDate={
													value.bookingData.updatedAt
												}
												scheduleData={scheduleData}
												polCode={polCode}
												polName={polName}
												podCode={podCode}
												podName={podName}
												cbm={value.bookingData.totalCbm}
												startPrice={startPrice}
												currentPrice={currentPrice}
												predictedPrice={predictedPrice}
												bookingFees={25}
												CostHading={
													value.scheduleData
														.finalRates.FOR
												}
												CostHadingName={
													value.scheduleData
														?.otherCost?.OCOMName
												}
												nowValue={bookingFilled}
												ETD={moment(
													value.scheduleData.etd
												).format("DD-MM-YYYY")}
												bookingId={
													value.bookingData.bId
												}
												key={i}
												onViewDetailsClick={() => {
													getBookingById(
														value.bookingData._id
													);
													onPreBookedViewDetailsClick(
														value.bookingData
															.scheduleId,
														value.bookingData._id,
														value.bookingData.bId
													);
												}}
											/>
										);
									case value.bookingData.status === 1 &&
										(bookingType === "all" ||
											bookingType === "booking"):
										return (
											<Booked
												bookingDate={
													value.bookingData.updatedAt
												}
												bookingId={
													value.bookingData.bId
												}
												scheduleData={scheduleData}
												polCode={polCode}
												polName={polName}
												podCode={podCode}
												podName={podName}
												totalCbm={
													value.bookingData.totalCbm
												}
												totalPrice={
													value.bookingData.totalPrice
												}
												startPrice={startPrice}
												bookedPriceData={
													value.bookingData
														?.bookedPrice
												}
												currentPrice={currentPrice}
												predictedPrice={predictedPrice}
												bookingFees={25}
												CostHading={
													value.scheduleData
														.finalRates.FOR
												}
												CostHadingName={
													value.scheduleData.otherCost
														?.OCOMName
												}
												nowValue={bookingFilled}
												key={i}
												onViewDetailsClick={() =>
													onBookedViewDetailsClick(
														value.bookingData
															.scheduleId,
														value.bookingData._id,
														value.bookingData.bId
													)
												}
											/>
										);
									case value.bookingData.status === 9 &&
										(bookingType === "all" ||
											bookingType === "payment"):
										return (
											<Booked
												bookingId={
													value.bookingData.bId
												}
												scheduleData={scheduleData}
												portName={
													polName + " - " + podName
												}
												totalCbm={
													value.bookingData.totalCbm
												}
												totalPrice={
													value.bookingData.totalPrice
												}
												startPrice={startPrice}
												bookedPriceData={
													value.bookingData
														?.bookedPrice
												}
												polCode={polCode}
												polName={polName}
												podCode={podCode}
												podName={podName}
												currentPrice={currentPrice}
												predictedPrice={predictedPrice}
												bookingFees={25}
												CostHading={
													value.scheduleData
														.finalRates.FOR
												}
												CostHadingName={
													value.scheduleData.otherCost
														?.OCOMName
												}
												nowValue={bookingFilled}
												key={i}
												onViewDetailsClick={() =>
													onBookedViewDetailsClick(
														value.bookingData
															.scheduleId,
														value.bookingData._id,
														value.bookingData.bId
													)
												}
											/>
										);
									default:
										return null;
								}
							})}
					</div>
				</div>
			) : (
				<EmptyBooking />
			)}
		</div>
	);
}

export default Booking;
