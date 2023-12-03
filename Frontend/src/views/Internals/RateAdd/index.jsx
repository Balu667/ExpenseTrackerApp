import styles from "./style.module.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useState } from "react";
import Caution from "../../../assets/Images/caution.png";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styled from "@emotion/styled";
import { useCostheading } from "../../../hooks/costheading";
import { useCountries } from "../../../hooks/country";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../../components/Loader/Loader";
import { useSchedule } from "../../../hooks/schedule";
import { useLane } from "../../../hooks/lane";
import { keyMatchLoop } from "../../../helper";
import OriginRate from "./OriginRate";
import FreightRate from "./FreightRate";
import DestinationRate from "./DestinationRate";
import OtherRate from "./OtherRate";
import { yupResolver } from "@hookform/resolvers/yup";
import { rateValidation } from "../../../validationSchema/rateValidation";
import { convertPayload } from "./convertPayload";
import Popup from "../../../components/ConfirmationPopup";
import { openPopup } from "../../../redux/slices/popupSlice";
import { useInsertRate, useRates } from "../../../hooks/rate";

const CustomisedAutocomplete = styled(Autocomplete)`
	.Mui-expanded {
		outline: none;
	}
	& .MuiAutocomplete-root {
		border: none;
	}
	& .MuiAutocomplete-input {
		border: none !important;
		padding: 0px !important;
	}
	& .MuiAutocomplete-endAdornment {
		top: 0px;
		right: 0px;
	}
`;

function Ratelist() {
	const sidebar = useSelector((state) => state.sidebar);
	const dispatch = useDispatch();

	const {
		register,
		watch,
		reset,
		setValue,
		control,
		formState: { errors, defaultValues },
		handleSubmit,
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(rateValidation),
		defaultValues: {
			scheduleId: null,
			OCFS: "",
			ODOC: "",
			OGBECBM: "",
			MROCFS: "",
			MRODOC: "",
			F: "",
			FGBECBM: "",
			FMBECBM: 0,
			DCFS: "",
			DDO: "",
			DGBECBM: "",
			MRDCFS: "",
			MRDDO: "",
			OR: 0,
			OCOMMR: 0,
			CDCFS: "",
			CDDO: "",
			OC: "usd",
			OMBECBM: 0,
			ROCFS: 0,
			RODOC: 0,
			MRF: "",
			RF: 0,
			DMBECBM: 0,
			RDCFS: 0,
			RDDO: 0,
			OCOMR: 0,
			isOtherCostHeadingExists: false,
		},
	});
	const watchFields = watch();
	const [fullCurrencyData, setFullCurrencyData] = useState({
		origin: {
			currencyData: null,
			currencyRate: null,
		},
		destination: {
			currencyData: null,
			currencyRate: null,
		},
		other: {
			costHeadingData: null,
			currencyData: null,
			currencyRate: null,
		},
	});

	const [sendPayload, setSendPayload] = useState(null);

	const { isLoading: scheduleLoading, data: scheduleData } = useSchedule();

	const { isLoading: costHeadingLoading, data: costheadingData } =
		useCostheading();

	const { isLoading: countryLoading, data: countryData } = useCountries();

	const { isLoading: laneLoading, data: laneData } = useLane();

	const { mutate, isLoading: postLoading } = useInsertRate();

	const { isLoading: rateLoading, data: rateData } = useRates();

	const onSubmit = async (data) => {
		data.OCC = fullCurrencyData.origin.currencyData;
		const payload = convertPayload(
			data,
			checkGreaterRate,
			checkDifferentRate,
			fullCurrencyData,
			checkLesserRate,
			currencyCovert
		);
		const postData = { data: [payload] };
		setSendPayload(postData);
		dispatch(openPopup());
	};
	function returnOptions(scheduleData, laneData) {
		return scheduleData.length > 0
			? scheduleData
					.filter(
						(e) =>
							e.status === 1 &&
							!rateData.some((rate) => rate.scheduleId === e._id)
					)
					.map((schedule) => {
						return {
							value: schedule._id,
							label: `${schedule.scheduleId}`,
							container: schedule.container,
							volume: schedule.volume,
							weight: schedule.weight,
							pol: schedule.pol,
							pod: schedule.pod,
						};
					})
			: [];
	}

	function updateCurrencyData(data) {
		const pol = data.pol;
		const pod = data.pod;
		const originCountry = keyMatchLoop("_id", laneData, pol).country;
		const originCurrency = keyMatchLoop("_id", countryData, originCountry);
		const destinationCountry = keyMatchLoop("_id", laneData, pod).country;
		const destinationCurrency = keyMatchLoop(
			"_id",
			countryData,
			destinationCountry
		);
		const costHeadingArray = costheadingData.filter(
			(costHeading) =>
				costHeading.status === 1 &&
				costHeading.country === destinationCountry
		);
		setValue("isOtherCostHeadingExists", costHeadingArray.length > 0);
		if (costHeadingArray.length > 0) {
			setValue("OCOMMR", "");
			setValue("OR", "");
		} else {
			setValue("OCOMMR", 0);
			setValue("OR", 0);
		}

		setFullCurrencyData({
			origin: {
				currencyRate: parseFloat(originCurrency.rate),
				currencyData: originCurrency.currency.toUpperCase(),
			},
			destination: {
				currencyRate: parseFloat(destinationCurrency.rate),
				currencyData: destinationCurrency.currency.toUpperCase(),
			},
			other: {
				costHeadingData:
					costHeadingArray.length > 0
						? costHeadingArray[0].costHeading
						: null,
				currencyRate: parseFloat(destinationCurrency.rate),
				currencyData: destinationCurrency.currency.toUpperCase(),
			},
		});
	}
	function nullCurrencyData() {
		setFullCurrencyData({
			origin: {
				currencyRate: null,
				currencyData: null,
			},
			destination: {
				currencyRate: null,
				currencyData: null,
			},
			other: {
				costHeadingData: null,
				currencyRate: null,
				currencyData: null,
			},
		});
	}

	function currencyCovert(number, currencyRate, currency) {
		if (currency === "usd") {
			return number;
		} else {
			const usdRate = countryData.filter(
				(country) => country.currency === "usd"
			)[0].rate;
			const inrValue = number * currencyRate;
			return roundNumber(Math.round(inrValue / usdRate));
		}
	}
	function checkGreaterRate(normalRate, marketRate, currenyRate, currency) {
		if (marketRate === "") {
			return 0;
		} else {
			if (normalRate > parseFloat(marketRate)) {
				return currencyCovert(normalRate, currenyRate, currency);
			} else {
				return currencyCovert(
					parseFloat(marketRate),
					currenyRate,
					currency
				);
			}
		}
	}

	function checkLesserRate(normalRate, marketRate, currenyRate, currency) {
		if (marketRate === "") {
			return 0;
		} else {
			if (normalRate < parseFloat(marketRate)) {
				return currencyCovert(normalRate, currenyRate, currency);
			} else {
				return currencyCovert(
					parseFloat(marketRate),
					currenyRate,
					currency
				);
			}
		}
	}

	function checkDifferentRate(normalRate, marketRate, currenyRate, currency) {
		const DifferentValue = parseFloat(marketRate) - normalRate;
		if (parseFloat(marketRate) - normalRate) {
			return currencyCovert(DifferentValue, currenyRate, currency);
		} else {
			return 0;
		}
	}

	function roundNumber(number) {
		const result = Math.round(number);
		if (result != null && result !== Infinity && !isNaN(result)) {
			return result;
		} else {
			return 0;
		}
	}
	function checkCBMExceeds(number, scheduleObject) {
		if (scheduleObject != null) {
			return number > scheduleObject.volume;
		} else {
			return false;
		}
	}

	function division(numerator, denominator) {
		const result = Math.round(numerator / denominator);
		return roundNumber(result);
	}

	const titleText = "Add Rate to this schedule ?";
	const contentText =
		"Are you sure that you want to add this Rate to this schedule, This action is irreversible and this rate cannot be altered?";

	if (
		costHeadingLoading ||
		countryLoading ||
		scheduleLoading ||
		laneLoading ||
		rateLoading
	) {
		return <Loader />;
	}
	const usdRates = countryData.filter(
		(country) => country.currency === "usd"
	)[0].rate;
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
					<h3 className={styles.title}>Add Rates</h3>
				</div>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.searchdiv}>
					<div className={styles.selectcon}>
						<div className={styles.schedulediv}>
							<div className={styles.scheduleid}>
								<p>Schedule ID</p>
								<Controller
									name="scheduleId"
									control={control}
									render={({ field }) => (
										<CustomisedAutocomplete
											{...field}
											disablePortal
											id="combo-box-demo"
											options={returnOptions(
												scheduleData,
												laneData
											)}
											getOptionLabel={(option) => {
												return option !== null
													? option.label
													: option;
											}}
											isOptionEqualToValue={(
												option,
												value
											) => option.value === value.value}
											onChange={(e, value) => {
												reset(
													() => ({
														...defaultValues,
														scheduleId: value,
													}),
													{ keepDefaultValues: true }
												);
												if (value !== null) {
													updateCurrencyData(value);
												} else {
													nullCurrencyData();
												}
											}}
											renderInput={(params) => (
												<TextField
													placeholder="Select Schedule ID"
													{...params}
												/>
											)}
										/>
									)}
								/>
							</div>
						</div>
					</div>
					<div className={styles.selectbox}>
						<div className={styles.selectboxitem}>
							<p>CBM</p>
							<h3>{watchFields.scheduleId?.volume}</h3>
						</div>
						<div
							className={`${styles.selectboxitem} ${styles.leftborder}`}>
							<p>Type</p>
							<h3>{watchFields.scheduleId?.container}</h3>
						</div>
						<div
							className={`${styles.selectboxitem} ${styles.leftborder}`}>
							<p>Weight</p>
							<h3>{watchFields.scheduleId?.weight}</h3>
						</div>
					</div>
				</div>
				{errors?.scheduleId && (
					<p className={styles.errormsg}>
						{errors.scheduleId.message}
					</p>
				)}
				{watchFields.scheduleId !== null && (
					<div className={styles.formsdiv}>
						<OriginRate
							register={register}
							division={division}
							fullCurrencyData={fullCurrencyData}
							watchFields={watchFields}
							setValue={setValue}
							roundNumber={roundNumber}
							errors={errors}
							checkCBMExceeds={checkCBMExceeds}
						/>
						<FreightRate
							register={register}
							division={division}
							fullCurrencyData={fullCurrencyData}
							watchFields={watchFields}
							errors={errors}
							setValue={setValue}
							checkCBMExceeds={checkCBMExceeds}
						/>
						<DestinationRate
							register={register}
							division={division}
							fullCurrencyData={fullCurrencyData}
							watchFields={watchFields}
							roundNumber={roundNumber}
							setValue={setValue}
							errors={errors}
							checkCBMExceeds={checkCBMExceeds}
						/>
						<OtherRate
							register={register}
							roundNumber={roundNumber}
							fullCurrencyData={fullCurrencyData}
							watchFields={watchFields}
							checkGreaterRate={checkGreaterRate}
							division={division}
							checkDifferentRate={checkDifferentRate}
							errors={errors}
							setValue={setValue}
						/>

						<div className={`${styles.origincon} ${styles.ptop3}`}>
							<div
								className={`${styles.costbox} ${styles.otherbox}`}>
								<h3
									className={`${styles.origintitle} ${styles.othertitle}`}>
									Final Preview - Start Price
								</h3>
								<div className={styles.origincontainer}>
									<div>
										<div className={styles.originflex}>
											<h1 className={styles.ocfs}>
												OCFS
											</h1>
											<div
												className={styles.finalvalflex}>
												<h3 className={styles.inrtxt}>
													USD
												</h3>
												<h3 className={styles.inrtxt}>
													{checkGreaterRate(
														watchFields.ROCFS,
														watchFields.MROCFS,
														fullCurrencyData.origin
															.currencyRate,
														fullCurrencyData.origin
															.currencyData
													)}{" "}
													$
												</h3>
											</div>
										</div>
										<div className={styles.originflex}>
											<h1 className={styles.ocfs}>
												ODOC
											</h1>
											<div
												className={styles.finalvalflex}>
												<h3 className={styles.inrtxt}>
													USD
												</h3>
												<h3 className={styles.inrtxt}>
													{checkLesserRate(
														watchFields.RODOC,
														watchFields.MRODOC,
														fullCurrencyData.origin
															.currencyRate,
														fullCurrencyData.origin
															.currencyData
													)}{" "}
													$
												</h3>
											</div>
										</div>
										<div className={styles.originflex}>
											<h1
												className={`${styles.ocfs} ${styles.totalval}`}>
												ORIGIN TOTAL
											</h1>
											<div
												className={styles.finalvalflex}>
												<h3
													className={`${styles.inrtxt} ${styles.totalval}`}>
													USD{" "}
												</h3>
												<h3
													className={`${styles.inrtxt} ${styles.totalval}`}>
													{checkGreaterRate(
														watchFields.ROCFS,
														watchFields.MROCFS,
														fullCurrencyData.origin
															.currencyRate,
														fullCurrencyData.origin
															.currencyData
													) +
														checkLesserRate(
															watchFields.RODOC,
															watchFields.MRODOC,
															fullCurrencyData
																.origin
																.currencyRate,
															fullCurrencyData
																.origin
																.currencyData
														)}{" "}
													$
												</h3>
											</div>
										</div>
										<div className={styles.originflex}>
											<h1
												className={`${styles.ocfs} ${styles.totalval}`}>
												Freight Rate
											</h1>
											<div
												className={styles.finalvalflex}>
												<h3
													className={`${styles.inrtxt} ${styles.totalval}`}>
													USD{" "}
												</h3>
												<h3
													className={`${styles.inrtxt} ${styles.totalval}`}>
													{Math.max(
														watchFields.RF,
														watchFields.MRF
													)}{" "}
													$
												</h3>
											</div>
										</div>
										<div className={styles.originflex}>
											<h1 className={styles.ocfs}>
												DCFS
											</h1>
											<div
												className={styles.finalvalflex}>
												<h3 className={styles.inrtxt}>
													USD{" "}
												</h3>
												<h3 className={styles.inrtxt}>
													{checkGreaterRate(
														watchFields.RDCFS,
														watchFields.MRDCFS,
														fullCurrencyData
															.destination
															.currencyRate,
														watchFields.CDCFS
													)}{" "}
													$
												</h3>
											</div>
										</div>
										<div className={styles.originflex}>
											<h1 className={styles.ocfs}>DDO</h1>
											<div
												className={styles.finalvalflex}>
												<h3 className={styles.inrtxt}>
													USD{" "}
												</h3>
												<h3 className={styles.inrtxt}>
													{checkLesserRate(
														watchFields.RDDO,
														watchFields.MRDDO,
														fullCurrencyData
															.destination
															.currencyRate,
														watchFields.CDDO
													)}{" "}
													$
												</h3>
											</div>
										</div>
										<div className={styles.originflex}>
											<h1
												className={`${styles.ocfs} ${styles.totalval}`}>
												DESTINATION TOTAL
											</h1>
											<div
												className={styles.finalvalflex}>
												<h3
													className={`${styles.inrtxt} ${styles.totalval}`}>
													USD{" "}
												</h3>
												<h3
													className={`${styles.inrtxt} ${styles.totalval}`}>
													{checkGreaterRate(
														watchFields.RDCFS,
														watchFields.MRDCFS,
														fullCurrencyData
															.destination
															.currencyRate,
														watchFields.CDCFS
													) +
														checkLesserRate(
															watchFields.RDDO,
															watchFields.MRDDO,
															fullCurrencyData
																.destination
																.currencyRate,
															watchFields.CDDO
														)}{" "}
													$
												</h3>
											</div>
										</div>
										{fullCurrencyData.other
											.costHeadingData && (
											<div className={styles.originflex}>
												<h1
													className={`${styles.ocfs} ${styles.elleps} text-uppercase`}>
													{
														fullCurrencyData.other
															.costHeadingData
													}{" "}
													Fee
												</h1>
												<div
													className={
														styles.finalvalflex
													}>
													<h3
														className={
															styles.inrtxt
														}>
														USD
													</h3>
													<h3
														className={
															styles.inrtxt
														}>
														{checkLesserRate(
															watchFields.OCOMR,
															watchFields.OCOMMR,
															usdRates,
															watchFields.OC
														)}{" "}
														$
													</h3>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className={styles.messagebox}>
								<img
									src={Caution}
									alt="Caution"
									className={styles.caution}
								/>
								<h1>Important!! </h1>
								<p>
									Rate Engine cannot be altered after
									confirmation!{" "}
								</p>
							</div>
							<div
								className={`${styles.compatebox} ${styles.otherbox}`}>
								<h3
									className={`${styles.origintitle} ${styles.othertitle}`}>
									Savings Calculator
								</h3>
								<div>
									<div className={styles.originflex}>
										<h1 className={styles.per}>OCFS</h1>
										<h3 className={styles.inrtxt}>
											{currencyCovert(
												watchFields.MROCFS,
												fullCurrencyData.origin
													.currencyRate,
												watchFields.OCC
											) -
												currencyCovert(
													watchFields.ROCFS,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												)}{" "}
											$
										</h3>
									</div>
									<div className={styles.originflex}>
										<h1 className={styles.per}>ODOC</h1>
										<h3 className={styles.inrtxt}>
											{currencyCovert(
												watchFields.MRODOC,
												fullCurrencyData.origin
													.currencyRate,
												watchFields.OCC
											) -
												currencyCovert(
													watchFields.RODOC,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												)}{" "}
											$
										</h3>
									</div>
									<div className={styles.originflex}>
										<h1
											className={`${styles.per} ${styles.totalval}`}>
											ORIGIN TOTAL
										</h1>
										<h3
											className={`${styles.inrtxt} ${styles.totalval}`}>
											{currencyCovert(
												watchFields.MROCFS,
												fullCurrencyData.origin
													.currencyRate,
												watchFields.OCC
											) -
												currencyCovert(
													watchFields.ROCFS,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												) +
												currencyCovert(
													watchFields.MRODOC,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												) -
												currencyCovert(
													watchFields.RODOC,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												)}{" "}
											$
										</h3>
									</div>
									<div className={styles.originflex}>
										<h1
											className={`${styles.per} ${styles.totalval}`}>
											Freight Rate
										</h1>
										<h3
											className={`${styles.inrtxt} ${styles.totalval}`}>
											{Math.round(
												watchFields.MRF - watchFields.RF
											)}{" "}
											$
										</h3>
									</div>
									<div className={styles.originflex}>
										<h1 className={styles.per}>DCFS</h1>
										<h3 className={styles.inrtxt}>
											{currencyCovert(
												watchFields.MRDCFS,
												fullCurrencyData.destination
													.currencyRate,
												watchFields.OCC
											) -
												currencyCovert(
													watchFields.RDCFS,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												)}{" "}
											$
										</h3>
									</div>
									<div className={styles.originflex}>
										<h1 className={styles.per}>DDO</h1>
										<h3 className={styles.inrtxt}>
											{currencyCovert(
												watchFields.MRDDO,
												fullCurrencyData.destination
													.currencyRate,
												watchFields.OCC
											) -
												currencyCovert(
													watchFields.RDDO,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												)}{" "}
											$
										</h3>
									</div>
									<div className={styles.originflex}>
										<h1
											className={`${styles.per} ${styles.totalval}`}>
											DESTINATION TOTAL
										</h1>
										<h3
											className={`${styles.inrtxt} ${styles.totalval}`}>
											{currencyCovert(
												watchFields.MRDCFS,
												fullCurrencyData.destination
													.currencyRate,
												watchFields.OCC
											) -
												currencyCovert(
													watchFields.RDCFS,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												) +
												currencyCovert(
													watchFields.MRDDO,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												) -
												currencyCovert(
													watchFields.RDDO,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												)}{" "}
											$
										</h3>
									</div>
									{fullCurrencyData.other.costHeadingData && (
										<div className={styles.originflex}>
											<h1
												className={`${styles.per} ${styles.elleps} text-uppercase`}>
												{
													fullCurrencyData.other
														.costHeadingData
												}{" "}
												Fee
											</h1>
											<h3 className={styles.inrtxt}>
												{currencyCovert(
													watchFields.OCOMMR,
													usdRates,
													watchFields.OCC
												) -
													currencyCovert(
														watchFields.OCOMR,
														usdRates,
														watchFields.OCC
													)}{" "}
												$
											</h3>
										</div>
									)}
									<div className={styles.originflex}>
										<h1
											className={`${styles.per} ${styles.totalval}`}>
											GRAND TOTAL
										</h1>
										<h3
											className={`${styles.inrtxt} ${styles.totalval}`}>
											{currencyCovert(
												watchFields.MROCFS,
												fullCurrencyData.origin
													.currencyRate,
												watchFields.OCC
											) -
												currencyCovert(
													watchFields.ROCFS,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												) +
												currencyCovert(
													watchFields.MRODOC,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												) -
												currencyCovert(
													watchFields.RODOC,
													fullCurrencyData.origin
														.currencyRate,
													watchFields.OCC
												) +
												Math.round(
													watchFields.MRF -
														watchFields.RF
												) +
												currencyCovert(
													watchFields.MRDCFS,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												) -
												currencyCovert(
													watchFields.RDCFS,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												) +
												currencyCovert(
													watchFields.MRDDO,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												) -
												currencyCovert(
													watchFields.RDDO,
													fullCurrencyData.destination
														.currencyRate,
													watchFields.OCC
												) +
												currencyCovert(
													watchFields.OCOMMR,
													usdRates,
													watchFields.OCC
												) -
												currencyCovert(
													watchFields.OCOMR,
													usdRates,
													watchFields.OCC
												)}{" "}
											$
										</h3>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.buttoncon}>
							<div className={styles.buttoncondiv}>
								<h4 className={styles.usdrates}>
									1{" "}
									{fullCurrencyData.destination.currencyData?.toUpperCase()}{" "}
									={" "}
									{fullCurrencyData.destination.currencyRate}{" "}
									INR
								</h4>
								{fullCurrencyData.destination.currencyData?.toLowerCase() !==
									"usd" && (
									<h4 className={styles.usdrates}>
										1 USD =
										{
											countryData.filter(
												(country) =>
													country.currency === "usd"
											)[0].rate
										}{" "}
										INR
									</h4>
								)}
							</div>
							<button
								disabled={postLoading}
								className={styles.savebtns}>
								Confirm
							</button>
						</div>
					</div>
				)}
			</form>
			<Popup
				handleAgree={() => mutate(sendPayload)}
				titleText={titleText}
				contentText={contentText}
			/>
		</div>
	);
}

export default Ratelist;
