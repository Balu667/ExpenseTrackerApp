import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as BackButton } from "../../../assets/Icons/back.svg";
import { CheckoutCargoDetails } from "../../../components/CargoDetails";
import { ForwarderCard } from "../../../components/ForwarderCard";
import { SummaryRateCard } from "../../../components/SummaryRateCard";
import { useGetBookingList } from "../../../hooks/dashboard";
import { useSchedulesBasedRates } from "../../../hooks/cargoDetail";
import { useGetSingleBookingFullDetails } from "../../../hooks/bookingManagement";
import {
	calculateCurrentPriceBySchedule,
	keyMatchLoop,
	openFileNewWindow,
} from "../../../helper";
import Loader from "../../../components/Loader/Loader";
import Milestone from "../../../components/Milestone/index";
import { MdLocationOn } from "react-icons/md";
import StepperPopup from "../../../components/StepperPopup";
import Paymentpopup from "../../../components/PaymentPopup";
import { milestoneSteps } from "../../../assets/milestones";
import {
	useGetMilestoneData,
	useGetMilestoneFile,
	useUpdateMilestoneData,
} from "../../../hooks/booking";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLane } from "../../../hooks/lane";
import { useInsertInvoiceBybookingId } from "../../../hooks/invoice";
import Switch from "@mui/material/Switch";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import InvoiceComponent from "../../../components/InvoiceComponent";
import CheckoutFileView from "../../../components/CheckoutFileView";

function BookingCheckout() {
	let pol, pod;
	const { scheduleId, bookingId } = useParams();
	const navigate = useNavigate();
	let activeStep = 0;
	let actionCount = 0;
	const [popupOpen, setPopupOpen] = useState(false);
	const [milestonePayload, setMilestonePayload] = useState(null);
	const [popup, setPopup] = useState(false);
	const [fileData, setFileData] = useState(null);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm();

	const { data: fullData, isLoading: fullDataLoading } =
		useGetSingleBookingFullDetails(bookingId);

	const { mutateAsync: getMilestoneFile } = useGetMilestoneFile();

	const {
		isLoading: scheduleRateLoading,
		data: scheduleRateData,
		isSuccess: scheduleSuccess,
	} = useSchedulesBasedRates(scheduleId);

	const onSuccessFunctions = (data) => {
		toast.success(data);
		setPopupOpen(false);
	};

	const { mutate: invoiceMutate } =
		useInsertInvoiceBybookingId(onSuccessFunctions);

	const { data: laneList } = useLane();

	const {
		data: bookingList,
		isLoading: bookingLoading,
		isSuccess: bookingListSuccess,
	} = useGetBookingList();

	useEffect(() => {
		if (
			fullData?.bookingDocsDetails?.shippingBill?.length > 0 &&
			milestonePayload?.currentStep === "msams09"
		) {
			setFileData(fullData.bookingDocsDetails.shippingBill);
		}
	}, [fullData, milestonePayload]);

	function syncMilestone(data) {
		if (data != null) {
			const userMilestones = ["msams08", "msams09", "msams11", "msams12"];
			for (let index = 0; index <= 22; index++) {
				const milestoneStep =
					data[`msams${index < 10 ? `0${index}` : index}`];
				const milestoneKey = `msams${index < 10 ? `0${index}` : index}`;
				if (milestoneStep != null) {
					if (
						milestoneStep === 2 &&
						userMilestones.includes(milestoneKey)
					) {
						actionCount += 1;
					}
					if (milestoneStep === 0) {
						if (userMilestones.includes(milestoneKey)) {
							actionCount += 1;
						}
						activeStep = index - 1;
						break;
					}
				} else {
					continue;
				}
			}
			if (data.msams22 === 1) {
				activeStep = 22;
			}
		}
	}

	const { data: milestoneData, isLoading: milestoneLoading } =
		useGetMilestoneData(bookingId);
	const onMutateSuccessFunctions = () => {
		toast.success("Milestone Updated Successfully");
		reset();
		setPopup(false);
		setMilestonePayload(null);
		setFileData(null);
	};

	const { mutate, isLoading: mutateLoading } = useUpdateMilestoneData(
		onMutateSuccessFunctions
	);

	const { role } = useSelector((state) => state.profile);

	function stepCheckOnClick(milestoneData) {
		let milestonePostObject = {
			currentStep: milestoneData,
		};
		milestonePostObject[milestoneData] = 1;
		setMilestonePayload(milestonePostObject);
		setPopup(true);
	}

	function stepperPopupConfirmClick(fileData, fieldData) {
		let postPayload = {
			bookingId,
			...milestonePayload,
		};

		if (fileData?.length == null) {
			postPayload[`${milestonePayload.currentStep}File`] = {
				...fileData,
			};
		} else {
			postPayload[`${milestonePayload.currentStep}File`] = fileData;
		}

		postPayload[`${milestonePayload.currentStep}Data`] = {
			...fieldData,
		};
		mutate(postPayload);
	}

	function checkMilestoneFileExists(
		milestoneFile,
		shipperFile,
		returnCondition
	) {
		if (milestoneFile.length > 0) {
			return returnCondition ? true : milestoneFile;
		} else {
			return returnCondition ? false : shipperFile;
		}
	}

	async function openMilestoneFile(file) {
		const fileData = await getMilestoneFile({
			bookingId,
			file,
		});
		openFileNewWindow(fileData);
	}

	const handleClose = () => {
		setPopupOpen(false);
	};

	const confirmPayment = (data) => {
		invoiceMutate(data);
	};

	const handleSwitch = (e) => {
		if (e.target.checked === true) {
			mutate({ bookingId, msams21: 3 });
		}
		if (e.target.checked === false) {
			mutate({ bookingId, msams21: 0 });
		}
	};

	const newScheduleData =
		bookingListSuccess && scheduleSuccess
			? calculateCurrentPriceBySchedule(bookingList, scheduleRateData[0])
			: null;

	if (
		scheduleRateLoading ||
		bookingLoading ||
		fullDataLoading ||
		milestoneLoading
	) {
		return <Loader />;
	}

	syncMilestone(milestoneData);

	pol = keyMatchLoop("_id", laneList, scheduleRateData[0].pol).portCode;

	pod = keyMatchLoop("_id", laneList, scheduleRateData[0].pod).portCode;

	const label = { inputProps: { "aria-label": "Switch demo" } };

	return (
		<>
			<div className={`container ${styles.containerdiv}`}>
				<div className={styles.titletext}>
					<span>
						<button
							onClick={() => navigate("/user/mybookings")}
							className={styles.backBtn}>
							<BackButton /> Back
						</button>
					</span>
					<h2 className={styles.title}>Booking Summary</h2>
				</div>
				<InvoiceComponent
					paymentData={fullData.paymentData}
					setPopupOpen={setPopupOpen}
				/>
				<div className={styles.milestonediv}>
					<div className={styles.milestoneDivCheckbox}>
						<div className={styles.milestontxtdiv}>
							<MdLocationOn className={styles.loactionicon} />
							<div className={styles.milestontxt}>
								<p className={styles.jdetails}>Milestone</p>
								<p className={styles.detected}>
									{actionCount} Action Pending
								</p>
							</div>
						</div>
						<></>
						{milestoneData.msams13 === 1 &&
							milestoneData.msams12 === 1 && (
								<div>
									<Form.Label>Delivery Order Hold</Form.Label>
									<Switch
										{...label}
										disabled={milestoneData.msams21 === 1}
										checked={milestoneData.msams21 === 3}
										onChange={(e) => handleSwitch(e)}
									/>
								</div>
							)}
					</div>

					<Milestone
						ata={scheduleRateData[0]?.aeta}
						atd={scheduleRateData[0]?.aetd}
						containerNo={scheduleRateData[0]?.containerNo}
						sealNo={scheduleRateData[0]?.sealNo}
						milestoneData={milestoneData}
						activeStep={activeStep}
						profileRole={role}
						paymentData={fullData.paymentData}
						steps={milestoneSteps}
						bookingId={bookingId}
						stepCheckOnClick={stepCheckOnClick}
					/>
				</div>
				<div className={styles.mainbox}>
					<div className={styles.titlediv}>
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
										{milestoneData.bId}
									</p>
								</div>
								{milestoneData?.msams04Data && (
									<div>
										<CheckoutCargoDetails
											data={milestoneData?.msams04Data}
										/>
									</div>
								)}
							</div>
						</div>
						<div className={styles.checkoutgriddiv}>
							<div>
								<h1 className={styles.headtitle}>
									Booking Details
								</h1>
							</div>
							<div>
								<CheckoutCargoDetails
									data={fullData.cargoDetails[0]}
								/>
							</div>
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>
									Shipper Details
								</h1>
							</div>
							<ForwarderCard
								shipper={true}
								convert={true}
								data={fullData.shipperDetails}
							/>
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>
									Destination Details
								</h1>
							</div>
							<ForwarderCard
								convert={true}
								data={fullData.consigneeDetails}
							/>
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>
									Notify Party Details
								</h1>
							</div>
							<ForwarderCard data={fullData.notifyPartyDetails} />
						</div>
						<div className={styles.checkoutflexdiv}>
							<div className={styles.checkoutflex}>
								<h1 className={styles.headtitle}>Documents</h1>
							</div>
							<div className={styles.checkoutflex}>
								<div
									className={`${styles.detailsdiv} ${styles.detailsdivs}`}>
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
												fullData?.bookingDocsDetails
													?.packingList
											}
											openMilestoneFile={
												openMilestoneFile
											}
										/>
									</div>
								</div>
								<div className={styles.detailsdiv}>
									<p className={styles.detailsdivlabel}>
										Shipping Bill
									</p>
									<div
										style={{ paddingTop: "10px" }}
										className={styles.dotted}
									/>
									<div>
										<CheckoutFileView
											fileArray={checkMilestoneFileExists(
												milestoneData?.msams09File,
												fullData?.bookingDocsDetails
													?.shippingBill,
												false
											)}
											openMilestoneFile={
												openMilestoneFile
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<SummaryRateCard
						cargoDetails={fullData.cargoDetails[0]}
						scheduleData={newScheduleData}
						bookingList={bookingList}
						type="viewBooking"
					/>
					<StepperPopup
						modalOpen={popup}
						handleClose={() => {
							setPopup(false);
							setFileData(null);
						}}
						titleText={"Complete the milestone?"}
						register={register}
						handleSubmit={handleSubmit}
						errors={errors}
						fileData={fileData}
						mutateLoading={mutateLoading}
						setFileData={setFileData}
						control={control}
						currentMilestone={milestonePayload}
						confirmOnClick={stepperPopupConfirmClick}
					/>
					<Paymentpopup
						bId={fullData.paymentData.bId}
						handleClose={handleClose}
						modalOpen={popupOpen}
						portName={`${pol} - ${pod}`}
						bookingId={fullData.paymentData.bookingId}
						confirmClick={confirmPayment}
					/>
				</div>
			</div>
		</>
	);
}
export default BookingCheckout;
