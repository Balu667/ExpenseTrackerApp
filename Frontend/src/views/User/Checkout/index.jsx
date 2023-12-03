import styles from "./index.module.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
	useInsertCheckoutDetails,
	useUpdateBookingStatus,
} from "../../../hooks/booking";
import Loader from "../../../components/Loader/Loader";
import { useEffect, useState } from "react";
import { CheckoutCargoDetails } from "../../../components/CargoDetails";
import { ForwarderCard } from "../../../components/ForwarderCard";
import { useDispatch, useSelector } from "react-redux";
import { SummaryRateCard } from "../../../components/SummaryRateCard";
import {
	useInsertPreBooking,
	useSchedulesBasedRates,
} from "../../../hooks/cargoDetail";
import { toast } from "react-toastify";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import Popup from "../../../components/ConfirmationPopup";
import { useGetBookingList } from "../../../hooks/dashboard";
import {
	calculateCurrentPriceBySchedule,
	openFileNewWindow,
} from "../../../helper";
import { removeAllDetails } from "../../../redux/slices/checkoutSlice";
import CheckoutFileView from "../../../components/CheckoutFileView";
import FeedBackPopup from "../../../components/FeedbackPopup";

function Checkout() {
	const { scheduleId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const checkoutData = useSelector((state) => state.checkoutDetails);
	const userDetail = useSelector((state) => state.profile.profileData);
	const [checkbox, setCheckbox] = useState(true);
	const [feedBackPopup, setFeedBackPopup] = useState(false);

	const titleText = "Confirm Booking";
	const contentText = "Are you sure to proceed with the Confirmed Booking?";

	const onUpdateSuccessFunctions = () => {
		toast.success("Booking Confirmed Successfully");
		setFeedBackPopup(true);
	};

	const { mutateAsync: confirmBooking, isLoading: confirmBookingLoading } =
		useUpdateBookingStatus(onUpdateSuccessFunctions);

	const { mutate: insertCheckOut, isLoading: insertCheckoutLoading } =
		useInsertCheckoutDetails();

	const { mutateAsync: insertCargoDetails, isLoading: cargoLoading } =
		useInsertPreBooking();

	const {
		data: bookingList,
		isLoading: bookingLoading,
		isSuccess: bookingListSuccess,
	} = useGetBookingList();

	const {
		isLoading: scheduleRateLoading,
		data: scheduleRateData,
		isSuccess: scheduleSuccess,
	} = useSchedulesBasedRates(scheduleId);

	async function handleAgree(scheduleData) {
		if (checkbox === false) {
			return;
		}
		let sum =
			(scheduleData.originCurrentOCFS +
				scheduleData.frightCurrentPrice +
				scheduleData.destinationCurrentCFS) *
				checkoutData.cargoDetails.totalCbm +
			25 +
			scheduleData.finalRates.FDDO +
			scheduleData.finalRates.FODOC;
		if (scheduleData.otherCost?.OCOMName) {
			sum = sum + scheduleData.predictionRates.POR;
		}
		let payload = {
			bookingId: checkoutData.bookingId,
			status: 1,
			bookedPrice: {
				bookedTotal: Math.round(sum),
				bookedOCFS: scheduleData.originCurrentOCFS,
				bookedFreight: scheduleData.frightCurrentPrice,
				bookedDCFS: scheduleData.destinationCurrentCFS,
			},
		};
		let cargoPayload = {
			...checkoutData.cargoDetails,
			id: checkoutData.bookingId,
			totalPrice: Math.round(sum),
		};
		await insertCargoDetails(cargoPayload);
		await confirmBooking(payload);
		dispatch(closePopup());
		setFeedBackPopup(true);
	}

	function handleClose() {
		setFeedBackPopup(false);
		dispatch(removeAllDetails());
	}

	function openFile(data) {
		if (data != null && data !== "") {
			openFileNewWindow(data);
		}
	}

	function navigatePages(type) {
		switch (type) {
			case "back":
				navigate(`/user/booking/${scheduleId}#5`);
				break;
			case "cargo":
				navigate(`/user/booking/${scheduleId}#1`);
				break;
			case "of":
				navigate(`/user/booking/${scheduleId}#2`);
				break;
			case "df":
				navigate(`/user/booking/${scheduleId}#3`);
				break;
			case "np":
				navigate(`/user/booking/${scheduleId}#4`);
				break;
			default:
				break;
		}
	}

	const newScheduleData =
		bookingListSuccess && scheduleSuccess
			? calculateCurrentPriceBySchedule(bookingList, scheduleRateData[0])
			: null;

	function checkNullInCheckOutData(checkoutData) {
		return (
			checkoutData?.bookingId == null ||
			checkoutData?.cargoDetails == null ||
			checkoutData?.shipperDetails == null ||
			checkoutData?.consigneeDetails == null ||
			checkoutData?.notifyPartyDetails == null ||
			checkoutData?.bookingDocsDetails == null
		);
	}

	useEffect(() => {
		if (
			bookingListSuccess &&
			scheduleSuccess &&
			newScheduleData != null &&
			checkoutData?.cargoDetails != null
		) {
			let payload = { ...checkoutData };
			let sum =
				(newScheduleData.originCurrentOCFS +
					newScheduleData.frightCurrentPrice +
					newScheduleData.destinationCurrentCFS) *
					payload.cargoDetails.totalCbm +
				25 +
				newScheduleData.finalRates.FDDO +
				newScheduleData.finalRates.FODOC;
			if (newScheduleData.otherCost?.OCOMName) {
				sum = sum + newScheduleData.predictionRates.POR;
			}
			payload.createdBy = localStorage.getItem("allMasterId");
			payload.legalName = userDetail.legalName;
			payload.status = 7;
			insertCheckOut({
				...payload,
				cargoDetails: {
					...payload.cargoDetails,
					totalPrice: sum,
					bookedPrice: {
						bookedTotal: Math.round(sum),
						bookedOCFS: newScheduleData.originCurrentOCFS,
						bookedFreight: newScheduleData.frightCurrentPrice,
						bookedDCFS: newScheduleData.destinationCurrentCFS,
					},
				},
			});
		}
	}, [bookingListSuccess, scheduleSuccess]);

	if (checkNullInCheckOutData(checkoutData)) {
		return <Navigate to={"/user/mybookings#all"} replace={true} />;
	}

	if (
		insertCheckoutLoading ||
		scheduleRateLoading ||
		confirmBookingLoading ||
		bookingLoading ||
		cargoLoading
	) {
		return <Loader />;
	}

	return (
		<>
			<div className="container">
				<div className={styles.mainbox}>
					<div className={styles.titlediv}>
						<div className={styles.titlecon}>
							<h2 className={styles.title}>Checkout</h2>
						</div>
						<div className={styles.checkoutgriddiv}>
							<div>
								<h1 className={styles.headtitle}>
									Cargo Details
								</h1>
								<button
									className={styles.editbtn}
									onClick={() => navigatePages("cargo")}>
									Edit
								</button>
							</div>
							<div>
								<CheckoutCargoDetails
									data={checkoutData.cargoDetails}
									cargoType={checkoutData}
								/>
							</div>
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>
									Shipper Details
								</h1>
								<button
									className={styles.editbtn}
									onClick={() => navigatePages("of")}>
									Edit
								</button>
							</div>
							<ForwarderCard
								shipper={true}
								convert={true}
								data={checkoutData.shipperDetails}
							/>
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>
									Destination Details
								</h1>
								<button
									className={styles.editbtn}
									onClick={() => navigatePages("df")}>
									Edit
								</button>
							</div>
							<ForwarderCard
								convert={true}
								data={checkoutData.consigneeDetails}
							/>
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>
									Notify Party Details
								</h1>
								<button
									className={styles.editbtn}
									onClick={() => navigatePages("np")}>
									Edit
								</button>
							</div>
							<ForwarderCard
								data={checkoutData.notifyPartyDetails}
							/>
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>Documents</h1>
								<button
									className={styles.editbtn}
									onClick={() => navigatePages("back")}>
									Edit
								</button>
							</div>
							<div className={styles.checkoutflex}>
								<div className={styles.detailsdiv}>
									<p className={styles.detailsdivlabel}>
										Packing List
									</p>
									<div
										style={{ paddingTop: "10px" }}
										className={styles.dotted}
									/>
									<div>
										<CheckoutFileView
											fileArray={
												checkoutData?.bookingDocsDetails
													?.packingList
											}
											isBase64={true}
										/>
									</div>
								</div>
								<div className={styles.detailsdiv}>
									<p
										className={styles.detailsdivlabel}
										onClick={() =>
											openFile(
												checkoutData.bookingDocsDetails
													?.shippingBillPath
											)
										}>
										Shipping Bill
									</p>
									<div
										style={{ paddingTop: "10px" }}
										className={styles.dotted}
									/>
									<div>
										<CheckoutFileView
											fileArray={
												checkoutData?.bookingDocsDetails
													?.shippingBill
											}
											isBase64={true}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<SummaryRateCard
						cargoDetails={checkoutData.cargoDetails}
						scheduleData={newScheduleData}
						bookingList={bookingList}
						proceedOnClick={() => dispatch(openPopup())}
						type="checkout"
					/>
				</div>
			</div>
			<FeedBackPopup
				feedBackPopup={feedBackPopup}
				type="booking"
				handleClose={handleClose}
			/>
			<Popup
				titleText={titleText}
				contentText={contentText}
				checkbox={checkbox}
				setCheckbox={setCheckbox}
				handleAgree={() => handleAgree(newScheduleData)}
			/>
		</>
	);
}
export default Checkout;
