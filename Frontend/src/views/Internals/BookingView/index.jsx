import styles from "./index.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { CheckoutCargoDetails } from "../../../components/CargoDetails";
import { ForwarderCard } from "../../../components/ForwarderCard";
import { SummaryRateCard } from "../../../components/SummaryRateCard";
import { useGetBookingList } from "../../../hooks/dashboard";
import { useSchedulesBasedRates } from "../../../hooks/cargoDetail";
import { useGetSingleBookingFullDetails } from "../../../hooks/bookingManagement";
import {
	calculateCurrentPriceBySchedule,
	openFileNewWindow,
} from "../../../helper";
import MenuIcon from "@mui/icons-material/Menu";
import Loader from "../../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import Milestone from "../../../components/Milestone/index";
import { MdLocationOn } from "react-icons/md";
import { IconButton } from "@mui/material";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import InvoiceComponent from "../../../components/InvoiceComponent";
import { milestoneSteps } from "../../../assets/milestones";
import { useEffect, useRef, useState } from "react";
import {
	useGetMilestoneData,
	useGetMilestoneFile,
	useUpdateMilestoneData,
} from "../../../hooks/booking";
import StepperPopup from "../../../components/StepperPopup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ReactComponent as BackButton } from "../../../assets/Icons/back.svg";
import Switch from "@mui/material/Switch";
import { Form } from "react-bootstrap";
import CheckoutFileView from "../../../components/CheckoutFileView";

function BookingCheckout() {
	const { scheduleId, bookingId } = useParams();
	const dispatch = useDispatch();
	const sidebar = useSelector((state) => state.sidebar);
	const { role } = useSelector((state) => state.profile);
	let actionCount = 0;
	let activeStep = 0;
	const [milestonePayload, setMilestonePayload] = useState(null);
	const [popup, setPopup] = useState(false);
	const [fileData, setFileData] = useState(null);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const { mutateAsync: getMilestoneFile } = useGetMilestoneFile();

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
		useGetSingleBookingFullDetails(bookingId);

	function syncMilestone(data) {
		if (data != null) {
			const otMilestones = [
				"msams02",
				"msams05",
				"msams06",
				"msams10",
				"msams13",
				"msams15",
				"msams16",
				"msams21",
			];
			for (let index = 0; index <= 22; index++) {
				const milestoneStep =
					data[`msams${index < 10 ? `0${index}` : index}`];
				const milestoneKey = `msams${index < 10 ? `0${index}` : index}`;
				if (milestoneStep != null) {
					if (
						milestoneStep === 2 &&
						otMilestones.includes(milestoneKey)
					) {
						actionCount += 1;
					}
					if (milestoneStep === 0) {
						if (otMilestones.includes(milestoneKey)) {
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
	const onMutateSuccessFunctions = () => {
		toast.success("Milestone Updated Successfully");
		reset();
		setPopup(false);
		setMilestonePayload(null);
		setFileData(null);
	};

	const { data: milestoneData, isLoading: milestoneLoading } =
		useGetMilestoneData(bookingId);

	const { mutate, isLoading: mutateLoading } = useUpdateMilestoneData(
		onMutateSuccessFunctions
	);

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

	function stepCheckOnClick(milestoneData) {
		let milestonePostObject = {
			currentStep: milestoneData,
		};
		milestonePostObject[milestoneData] = 1;
		setMilestonePayload(milestonePostObject);
		setPopup(true);
	}

	function stepperPopupSkipOnClick() {
		let postPayload = {
			bookingId,
			...milestonePayload,
		};
		postPayload.msams05 = 2;
		mutate(postPayload);
	}

	function stepperPopupConfirmClick(fileData, fieldData) {
		let postPayload = {
			bookingId,
			...milestonePayload,
		};
		postPayload[`${milestonePayload.currentStep}File`] = {
			...fileData,
		};
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

	const label = { inputProps: { "aria-label": "Switch demo" } };

	return (
		<div ref={containerDivRef} className={`container ${styles.bookview}`}>
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
						style={{ color: "black" }}
						onClick={() => navigate(-1)}
						className={styles.backBtn}>
						<BackButton /> Back
					</button>
				</span>
			</div>
			<div>
				<h2 className={styles.title}>Booking Summary</h2>
			</div>
			{role === 5 && (
				<>
					<InvoiceComponent paymentData={fullData?.paymentData} />

					<div className={styles.milestonediv}>
						<div className={styles.milestontxtdiv}>
							<MdLocationOn className={styles.loactionicon} />
							<div className={styles.orderHold}>
								<div className={styles.milestontxt}>
									<p className={styles.jdetails}>Milestone</p>
									<p className={styles.detected}>
										{actionCount} Action Pending
									</p>
								</div>
								{milestoneData.msams13 === 1 &&
									milestoneData.msams12 === 1 && (
										<div>
											<Form.Label>
												Delivery Order Hold
											</Form.Label>
											<Switch
												{...label}
												disabled
												checked={
													milestoneData.msams21 === 3
												}
											/>
										</div>
									)}
							</div>
						</div>
						<Milestone
							ata={scheduleRateData[0]?.aeta}
							atd={scheduleRateData[0]?.aetd}
							containerNo={scheduleRateData[0]?.containerNo}
							sealNo={scheduleRateData[0]?.sealNo}
							milestoneData={milestoneData}
							activeStep={activeStep}
							profileRole={role}
							steps={milestoneSteps}
							bookingId={bookingId}
							paymentData={fullData.paymentData}
							stepCheckOnClick={stepCheckOnClick}
						/>
					</div>
				</>
			)}
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
											fullData?.bookingDocsDetails
												?.packingList
										}
										openMilestoneFile={openMilestoneFile}
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
										openMilestoneFile={openMilestoneFile}
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
					containerWidth={containerWidth < "1100"}
				/>
			</div>
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
				currentMilestone={milestonePayload}
				mutateLoading={mutateLoading}
				setFileData={setFileData}
				confirmOnClick={stepperPopupConfirmClick}
				skipOnClick={stepperPopupSkipOnClick}
			/>
		</div>
	);
}
export default BookingCheckout;
