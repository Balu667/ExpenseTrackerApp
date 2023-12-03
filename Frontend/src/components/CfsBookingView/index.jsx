import styles from "./index.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { SummaryRateCard } from "../SummaryRateCard";
import { ReactComponent as BackButton } from "../../assets/Icons/back.svg";
import Loader from "../Loader/Loader";
import { openFileNewWindow } from "../../helper";
import { ForwarderCard } from "../ForwarderCard";
import { CheckoutCargoDetails } from "../CargoDetails";
import { useSchedulesBasedRates } from "../../hooks/cargoDetail";
import { MdLocationOn } from "react-icons/md";
import { milestoneSteps } from "../../assets/milestones";
import {
	useGetMilestoneData,
	useGetMilestoneFile,
	useUpdateMilestoneData,
} from "../../hooks/booking";
import Milestone from "../../components/Milestone";
import { useState } from "react";
import StepperPopup from "../../components/StepperPopup";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useGetSingleBookingFullDetailsByCfsId } from "../../hooks/cfsManagement";
import CheckoutFileView from "../CheckoutFileView";
import { Switch } from "@mui/material";
import { Form } from "react-bootstrap";

function CfsBookingView({ dcfs }) {
	const { scheduleId, bookingId } = useParams();
	let actionCount = 0;
	let activeStep = 0;
	const [milestonePayload, setMilestonePayload] = useState(null);
	const { role } = useSelector((state) => state.profile);
	const [popup, setPopup] = useState(false);
	const navigate = useNavigate();
	const [fileData, setFileData] = useState(null);
	const {
		register,
		handleSubmit,
		reset,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		mode: "onChange",
	});
	const { mutateAsync: getMilestoneFile } = useGetMilestoneFile();

	const { append, fields } = useFieldArray({
		name: "cargoDetails",
		control,
	});

	const watchFields = watch();

	const { data: fullData, isLoading: fullDataLoading } =
		useGetSingleBookingFullDetailsByCfsId(bookingId, scheduleId);

	const { isLoading: scheduleRateLoading, data: scheduleRateData } =
		useSchedulesBasedRates(scheduleId);

	const onMutateSuccessFunctions = () => {
		toast.success("Milestone Updated Successfully");
		setPopup(false);
		reset();
		setMilestonePayload(null);
		setFileData(null);
	};

	const { data: milestoneData, isLoading: milestoneLoading } =
		useGetMilestoneData(bookingId);

	const { mutate, isLoading: mutateLoading } = useUpdateMilestoneData(
		onMutateSuccessFunctions
	);

	function stepCheckOnClick(milestoneData) {
		let milestonePostObject = {
			currentStep: milestoneData,
		};
		milestonePostObject[milestoneData] = 1;
		setMilestonePayload(milestonePostObject);
		setPopup(true);
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

	function syncMilestone(data) {
		if (data != null) {
			const ocfsMilestones = ["msams03", "msams04", "msams07"];
			const dcfsMilestones = [
				"msams17",
				"msams18",
				"msams19",
				"msams20",
				"msams22",
			];
			for (let index = 0; index <= 22; index++) {
				const milestoneStep =
					data[`msams${index < 10 ? `0${index}` : index}`];
				const milestoneKey = `msams${index < 10 ? `0${index}` : index}`;
				if (milestoneStep != null) {
					if (milestoneStep === 2) {
						if (
							role === 6 &&
							ocfsMilestones.includes(milestoneKey)
						) {
							actionCount += 1;
						} else if (
							role === 7 &&
							dcfsMilestones.includes(milestoneKey)
						) {
							actionCount += 1;
						}
					}
					if (milestoneStep === 0 || milestoneStep === 3) {
						if (
							role === 6 &&
							ocfsMilestones.includes(milestoneKey)
						) {
							actionCount += 1;
						} else if (
							role === 7 &&
							dcfsMilestones.includes(milestoneKey)
						) {
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

	if (fullDataLoading || scheduleRateLoading || milestoneLoading) {
		return <Loader />;
	}

	syncMilestone(milestoneData);
	const label = { inputProps: { "aria-label": "Switch demo" } };

	return (
		<div className="container">
			<div className={styles.titlecon}>
				<span>
					<button
						onClick={() => navigate(-1)}
						className={styles.backbtn}>
						<BackButton />
						Back
					</button>
				</span>
				<h2 className={styles.title}>Booking Summary</h2>
			</div>
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
							milestoneData.msams12 === 1 &&
							dcfs && (
								<div>
									<Form.Label>Delivery Order Hold</Form.Label>
									<Switch
										{...label}
										disabled
										checked={milestoneData.msams21 === 3}
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
					bookingId={bookingId}
					profileRole={role}
					steps={milestoneSteps}
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
								<div className={styles.dotted} />
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
								<div className={styles.dotted} />
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
					type="cfs"
					scheduleData={scheduleRateData[0]}
				/>
			</div>
			<StepperPopup
				milestoneData={milestoneData}
				modalOpen={popup}
				handleClose={() => {
					setPopup(false);
					setFileData(null);
				}}
				titleText={"Complete the milestone?"}
				register={register}
				handleSubmit={handleSubmit}
				errors={errors}
				fields={fields}
				append={append}
				cargoDetails={fullData.cargoDetails[0]}
				cargoType={fullData.cargoDetails[0]?.cargoType}
				setValue={setValue}
				watchFields={watchFields}
				reset={reset}
				fileData={fileData}
				control={control}
				mutateLoading={mutateLoading}
				setFileData={setFileData}
				currentMilestone={milestonePayload}
				confirmOnClick={stepperPopupConfirmClick}
			/>
		</div>
	);
}
export default CfsBookingView;
