import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
	useSchedulesBasedRates,
	useInsertPreBooking,
	useUnhandledHsnCode,
} from "../../../hooks/cargoDetail";
import { useForm } from "react-hook-form";
import { useLane } from "../../../hooks/lane";
import Loader from "../../../components/Loader/Loader";
import BookingDetail from "../../../components/BookingDetail";
import { useGetBookingList } from "../../../hooks/dashboard";
import CargoDimension from "./CargoDimension";
import { useDispatch, useSelector } from "react-redux";
import PreBookingPopup from "./PreBookingPopup";
import {
	insertCargoDetails,
	removeAllDetails,
} from "../../../redux/slices/checkoutSlice";
import { CircularProgress } from "@mui/material";
import {
	calculateCurrentPriceBySchedule,
	convertIntoCm,
	roundToDecimal,
} from "../../../helper";

function PreBooking() {
	const [preBookingPopup, setPreBookingPopup] = useState(false);
	const [checkbox, setCheckbox] = useState(true);
	const [cargoType, setCargoType] = useState("stackable");
	const [finalCargoDetail, setFinalCargoDetail] = useState(null);
	const [measurementUnit, setMeasurementUnit] = useState({
		0: "CM",
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { scheduleId } = useParams();
	const userDetail = useSelector((state) => state.profile.profileData);
	const { cargoDetails, bookingId } = useSelector(
		(state) => state.checkoutDetails
	);

	const {
		register,
		control,
		handleSubmit,
		watch,
		reset,
		setValue,
		clearErrors,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			cargoDetails: [
				{
					packageType: "",
					metric: "CM",
					length: "",
					breadth: "",
					height: "",
					radius: "",
					weightPerPackage: "",
					noOfPackage: "",
					commodity: "",
					hsnCode: "",
					heightLimit: "",
				},
			],
		},
		mode: "onChange",
	});

	const watchFields = watch();

	const { isLoading: laneLoading, data: laneList } = useLane({
		refetchInterval: false,
		refetchOnWindowFocus: false,
	});

	const { isLoading: unHandledHsnLoading, data: unHandledHsnList } =
		useUnhandledHsnCode();

	const { mutate, isLoading } = useInsertPreBooking();

	const { isLoading: SchedulesBasedRatesLoading, data: SchedulesBasedRates } =
		useSchedulesBasedRates(scheduleId);

	const { data: bookingList, isLoading: bookingLoading } =
		useGetBookingList();

	useEffect(() => {
		if (cargoDetails !== null) {
			if (cargoDetails?.cargoType === "non-stackable") {
				setCargoType("non-stackable");
			}
			const newMeasurement = {};
			reset(cargoDetails);
			for (
				let index = 0;
				index < cargoDetails.cargoDetails.length;
				index++
			) {
				const element = cargoDetails.cargoDetails[index];
				newMeasurement[index] = element.metric;
			}
			setMeasurementUnit(newMeasurement);
		}
		window.scrollTo(0, 0);
	}, [cargoDetails]);

	if (
		laneLoading ||
		SchedulesBasedRatesLoading ||
		isLoading ||
		bookingLoading ||
		unHandledHsnLoading
	) {
		return <Loader />;
	}

	if (
		SchedulesBasedRates[0] != null &&
		(SchedulesBasedRates[0]?.status === 2 ||
			SchedulesBasedRates[0]?.status === 3)
	) {
		return <Navigate to={"/user/dashboard"} replace={true} />;
	}

	const addKeyValue = (key, value) => {
		let keyName = key;
		let valueName = value;
		if (key === "add") {
			keyName = Object.keys(measurementUnit).length;
			valueName = "CM";
		}
		setMeasurementUnit({ ...measurementUnit, [keyName]: valueName });
	};

	const removeKeyValue = (key) => {
		const { [key]: removedValue, ...newMeasurementUnit } = measurementUnit;
		setMeasurementUnit(newMeasurementUnit);
	};

	const length = watchFields.cargoDetails.map(({ length, metric }) =>
		convertIntoCm(length, metric)
	);

	const breadth = watchFields.cargoDetails.map(({ breadth, metric }) =>
		convertIntoCm(breadth, metric)
	);

	const height = watchFields.cargoDetails.map(({ height, metric }) =>
		convertIntoCm(height, metric)
	);

	const radius = watchFields.cargoDetails.map(({ radius, metric }) =>
		convertIntoCm(radius, metric)
	);

	const numberofPackages = watchFields.cargoDetails.map(
		({ noOfPackage }) => noOfPackage
	);

	const WeightofPackages = watchFields.cargoDetails.map(
		({ weightPerPackage }) => weightPerPackage
	);
	function totalCbmCalculation(array) {
		let volume = 0;
		let gross = 0;
		for (let index = 0; index < array.length; index++) {
			const type = array[index].packageType;
			if (type === "barrels" || type === "rolls") {
				if (array[index].weightPerPackage.length > 0) {
					volume +=
						(parseFloat(3.14) *
							radius[index] *
							radius[index] *
							height[index] *
							numberofPackages[index]) /
						1000000;
					gross += WeightofPackages[index] * numberofPackages[index];
				}
			} else if (type !== "barrels" && type !== "rolls") {
				if (array[index].weightPerPackage.length > 0) {
					volume +=
						(length[index] *
							breadth[index] *
							height[index] *
							numberofPackages[index]) /
						1000000;
					gross += WeightofPackages[index] * numberofPackages[index];
				}
			}
		}

		return { volume, gross };
	}

	let { gross, volume } = totalCbmCalculation(watchFields.cargoDetails);
	gross = isNaN(gross) ? 0 : gross;
	volume = isNaN(volume) ? 0 : volume;
	const grossCbm = isNaN(volume) ? 0 : gross / 1000;

	function OverViewCalculation() {
		return (
			<div className={styles.totalcbm}>
				<p>
					Total Volume <CbmCapacity />
				</p>
				<p>
					Total Gross weight <GrossCapacity />
				</p>
			</div>
		);
	}

	const finalVolume = (volume) => {
		if (volume === 0) {
			return 0;
		} else if (volume >= 1) {
			if (Number.isInteger(volume)) {
				return Number(volume);
			} else {
				return Number(volume).toFixed(1);
			}
		} else {
			return 1;
		}
	};

	function findGreaterNumber(charge, weightToCbm) {
		if (charge > weightToCbm) {
			return charge.toString();
		} else {
			return weightToCbm.toString();
		}
	}

	const setCargoDetailData = (data) => {
		for (let i = 0; i < data.cargoDetails.length; i++) {
			const weightPerPackage = parseInt(
				data.cargoDetails[i].weightPerPackage
			);
			const noOfPackage = parseInt(data.cargoDetails[i].noOfPackage);
			data.cargoDetails[i].weight = (
				weightPerPackage * noOfPackage
			).toString();
		}
		const postData = { ...data };
		const greaterCbm = findGreaterNumber(volume, grossCbm);
		postData.scheduleId = scheduleId;
		postData.cargoType = cargoType;
		postData.totalPrice = "0";
		postData.totalCbm = finalVolume(greaterCbm);
		postData.totalWt = gross.toString();
		postData.legalName = userDetail.legalName;
		postData.companyName = userDetail.legalName;
		postData.createdBy = localStorage.getItem("allMasterId");
		postData.currentPrice = {
			originCurrentPrice: scheduleRateData.originCurrentPrice,
			destinationCurrentPrice: scheduleRateData.destinationCurrentPrice,
			frightCurrentPrice: scheduleRateData.frightCurrentPrice,
		};
		if (bookingId) {
			postData.id = bookingId;
		}
		dispatch(insertCargoDetails(postData));
		setFinalCargoDetail(postData);
		mutate(postData);
	};

	let scheduleRateData = calculateCurrentPriceBySchedule(
		bookingList,
		SchedulesBasedRates[0]
	);
	let availableCbm =
		scheduleRateData.volume - scheduleRateData.totalCbmBooked;

	const preBookPopup = (data) => {
		setFinalCargoDetail(data);
		setPreBookingPopup(!preBookingPopup);
	};

	function continueBooking(data) {
		data.status = 8;
		setCargoDetailData(data);
		navigate(`/user/booking/${scheduleId}#2`);
	}

	const onPopupPreBooking = () => {
		if (checkbox === false) {
			return false;
		}
		finalCargoDetail.status = 2;
		setCargoDetailData(finalCargoDetail);
		navigate("/user/mybookings#all", { replace: true });
		dispatch(removeAllDetails());
	};

	const onPopupContinueBooking = () => {
		if (checkbox === false) {
			return false;
		}
		finalCargoDetail.status = 8;
		setCargoDetailData(finalCargoDetail);
		navigate(`/user/booking/${scheduleId}#2`);
	};

	const closeIcon = () => {
		setPreBookingPopup(!preBookingPopup);
	};

	const cbmButtonValidation = () => {
		if (gross > 4356) {
			return true;
		} else if (volume > 12) {
			return true;
		} else if (availableCbm < 12) {
			return volume > availableCbm || gross > 1000 * availableCbm;
		} else {
			return false;
		}
	};

	const CbmCapacity = () => {
		if (availableCbm < 12) {
			if (
				volume > availableCbm ||
				gross > 4356 ||
				gross / 1000 > availableCbm
			) {
				return (
					<span style={{ color: "red" }}>
						{finalVolume(volume >= grossCbm ? volume : grossCbm)}{" "}
						CBM
					</span>
				);
			} else {
				return (
					<span>
						{finalVolume(volume < grossCbm ? grossCbm : volume)} CBM
					</span>
				);
			}
		} else if (volume > 12) {
			return (
				<span style={{ color: "red" }}>
					{finalVolume(volume >= grossCbm ? volume : grossCbm)} CBM
				</span>
			);
		} else {
			return (
				<span>
					{finalVolume(volume < grossCbm ? grossCbm : volume)} CBM
				</span>
			);
		}
	};

	const GrossCapacity = () => {
		return (
			<span
				style={{
					color:
						gross > 4356 || gross / 1000 > availableCbm
							? "red"
							: "black",
				}}>
				{roundToDecimal(gross)} kg
			</span>
		);
	};

	const changeCargoType = (cargoType) => {
		setCargoType(cargoType);
	};

	return (
		<form>
			<div className="container">
				<div className={styles.mainbox}>
					<div className={styles.titlediv}>
						<h1>Shipment Details</h1>
					</div>
					<div className={styles.contentdiv}>
						<div className={styles.ratecard}>
							<BookingDetail
								bookingList={bookingList}
								laneList={laneList}
								scheduleData={SchedulesBasedRates[0]}
								type="cargoDetails"
							/>
						</div>
					</div>
				</div>
				<CargoDimension
					clearErrors={clearErrors}
					changeCargoType={changeCargoType}
					cargoType={cargoType}
					register={register}
					control={control}
					watch={watch}
					setValue={setValue}
					errors={errors}
					measurementUnit={measurementUnit}
					addKeyValue={addKeyValue}
					removeKeyValue={removeKeyValue}
					unHandledHsnList={unHandledHsnList}
				/>
			</div>
			<div className={styles.footer}>
				<div className={`container ${styles.footerdiv}`}>
					<div className={styles.footerflex}>
						<div className={styles.footerflexdiv}>
							<h1>Overview</h1>
							<p>of your booking</p>
						</div>
						<div
							className={styles.footercontainerdiv}
							style={{ marginLeft: "20px" }}>
							<OverViewCalculation />
						</div>
					</div>
					<div className={styles.footerbtns}>
						<button
							type="button"
							className={styles.prebookingbtn}
							onClick={handleSubmit(preBookPopup)}
							disabled={cbmButtonValidation()}>
							{isLoading ? (
								<CircularProgress size={15} />
							) : (
								"Pre-Book Now"
							)}
						</button>
						<button
							className={styles.continuebtn}
							type="button"
							onClick={handleSubmit(continueBooking)}
							disabled={
								cbmButtonValidation() ||
								isLoading ||
								isSubmitting
							}>
							{isLoading ? (
								<CircularProgress size={15} />
							) : (
								"Continue to Book"
							)}
						</button>
					</div>
				</div>
			</div>
			<PreBookingPopup
				handleSubmit={handleSubmit}
				checkbox={checkbox}
				setCheckbox={setCheckbox}
				open={preBookingPopup}
				close={() => setPreBookingPopup(false)}
				closeIcon={closeIcon}
				onPopupPreBooking={onPopupPreBooking}
				onPopupContinueBooking={onPopupContinueBooking}
				isLoading={isLoading}
			/>
		</form>
	);
}
export default PreBooking;
