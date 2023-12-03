import styles from "../RateAdd/style.module.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useLane } from "../../../hooks/lane";
import Loader from "../../../components/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useSchedule } from "../../../hooks/schedule";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useGetRateById, useUpdateRate } from "../../../hooks/rate";
import { AiOutlineClose } from "react-icons/ai";
import { useCountries } from "../../../hooks/country";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { rateValidation } from "../../../validationSchema/rateValidation";
import { useForm } from "react-hook-form";
import { convertPayload } from "./convertPayload";
import Popup from "../../../components/ConfirmationPopup";
import { openPopup } from "../../../redux/slices/popupSlice";

function Ratelist() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sidebar = useSelector((state) => state.sidebar);
	const [disabled, sertDisabled] = useState(true);
	const ProfileRole = useSelector((state) => state.profile.role);
	const [sendPayload, setSendPayload] = useState(null);
	const { isLoading: singleRateLoading, data: singleRateData } =
		useGetRateById(id);
	const {
		register,
		watch,
		setValue,
		reset,
		formState: { errors },
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
			isOtherCostHeadingExists: true,
		},
	});
	const watchFields = watch();

	function roundNumber(number) {
		const result = Math.round(number);
		if (result != null && result !== Infinity && !isNaN(result)) {
			return result;
		} else {
			return 0;
		}
	}

	function division(numerator, denominator) {
		const result = Math.round(numerator / denominator);
		return roundNumber(result);
	}

	const { isLoading: scheduleLoading, data: scheduleData } = useSchedule();

	const { isLoading: countryLoading, data: countryData } = useCountries();

	const { mutate, isLoading: postLoading } = useUpdateRate();

	const { isLoading: laneLoading, data: laneData } = useLane();

	const filteredScheduleData =
		scheduleLoading || singleRateLoading
			? []
			: scheduleData.filter((e) => e._id === singleRateData.scheduleId);

	function returnOptions(scheduleData, laneData) {
		return scheduleData.map((schedule) => {
			return {
				value: schedule._id,
				label: `${schedule.scheduleId}`,
				container: schedule.container,
				volume: schedule.volume,
				weight: schedule.weight,
				pol: schedule.pol,
				pod: schedule.pod,
			};
		});
	}

	useEffect(() => {
		if (singleRateLoading === false) {
			const resetData = {
				OCFS: singleRateData?.originCost?.OCFS,
				ODOC: singleRateData?.originCost?.ODOC,
				OGBECBM: singleRateData?.originBE?.OGBECBM,
				OMBECBM: singleRateData?.originBE?.OMBECBM,
				MROCFS: singleRateData?.originComparison?.MROCFS,
				MRODOC: singleRateData?.originComparison?.MRODOC,
				F: singleRateData?.freightCost?.F,
				FGBECBM: singleRateData?.freightBE?.FGBECBM,
				FMBECBM: singleRateData?.freightBE?.FMBECBM,
				DCFS: singleRateData?.destinationCost?.DCFS,
				DDO: singleRateData?.destinationCost?.DDO,
				DGBECBM: singleRateData?.destinationBE?.DGBECBM,
				MRDCFS: singleRateData?.destinationComparison?.MRDCFS,
				MRDDO: singleRateData?.destinationComparison?.MRDDO,
				OR: singleRateData?.otherCost?.OR,
				OCOMMR: singleRateData?.otherComparison?.OCOMMR,
				CDCFS: singleRateData?.destinationCost?.CDCFS,
				CDDO: singleRateData?.destinationCost?.CDDO,
				OC: "usd",
				ROCFS: singleRateData?.originComparison?.ROCFS,
				RODOC: singleRateData?.originComparison?.RODOC,
				MRF: singleRateData?.freightComparison?.MRF,
				RF: singleRateData?.freightComparison?.RF,
				DMBECBM: singleRateData?.destinationBE?.DMBECBM,
				RDCFS: singleRateData?.destinationComparison?.RDCFS,
				RDDO: singleRateData?.destinationComparison?.RDDO,
				OCOMR: singleRateData?.otherComparison?.OCOMR,
				OCC: singleRateData?.originCost?.OCC,
				isOtherCostHeadingExists: !!singleRateData?.otherCost?.OCOMName,
			};
			reset(resetData);
		}
	}, [singleRateLoading]);

	useEffect(() => {
		if (disabled === false) {
			window.scrollTo(0, 0);
		}
	}, [disabled]);

	if (
		singleRateLoading ||
		scheduleLoading ||
		laneLoading ||
		countryLoading ||
		postLoading
	) {
		return <Loader />;
	}

	const usdRates = countryData.filter(
		(country) => country.currency === "usd"
	)[0].rate;

	const destinationrate = countryData.filter(
		(country) =>
			country.currency ===
			singleRateData.destinationCost.CDCFS.toLowerCase()
	)[0].rate;

	const Originrate = countryData.filter(
		(country) =>
			country.currency === singleRateData.originCost.OCC.toLowerCase()
	)[0].rate;

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

	function checkCBMExceeds(number, scheduleObject) {
		if (scheduleObject != null) {
			return number > scheduleObject.volume;
		} else {
			return false;
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

	const onSubmit = async (data) => {
		const payload = convertPayload(
			data,
			singleRateData,
			checkGreaterRate,
			checkDifferentRate,
			checkLesserRate,
			currencyCovert,
			Originrate,
			destinationrate,
			usdRates
		);
		const postData = { data: [payload] };
		setSendPayload(postData);
		dispatch(openPopup());
	};

	const titleText = "Add Rate to this schedule ?";
	const contentText =
		"Are you sure that you want to add this Rate to this schedule, This action is irreversible and this rate cannot be altered?";

	return (
		<div className={styles.countrydiv}>
			<div className={styles.headingdiv}>
				<div className={styles.titlediv}>
					<div className={styles.ratedetailstxt}>
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
						<div className={styles.Ratessiv}>
							<h3 className={styles.title}>Rates Details</h3>
							<button
								className={styles.closebtn}
								onClick={() =>
									navigate(
										ProfileRole === 2
											? "/admin/rate"
											: "/rdt/rate"
									)
								}>
								<AiOutlineClose />
							</button>
						</div>
					</div>
				</div>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.searchdiv}>
					<div className={styles.selectcon}>
						<div className={styles.schedulediv}>
							<div
								className={`${styles.scheduleid} ${styles.viewscheduleid}`}>
								<p>Schedule ID</p>
								<input
									type="text"
									disabled={disabled}
									className={styles.scheduleinput}
									defaultValue={
										returnOptions(
											filteredScheduleData,
											laneData
										)[0].label
									}
								/>
							</div>
						</div>
					</div>
					<div className={styles.selectbox}>
						<div className={styles.selectboxitem}>
							<p>CBM</p>
							<h3>{filteredScheduleData[0]?.volume}</h3>
						</div>
						<div
							className={`${styles.selectboxitem} ${styles.leftborder}`}>
							<p>Type</p>
							<h3>{filteredScheduleData[0]?.container}</h3>
						</div>
						<div
							className={`${styles.selectboxitem} ${styles.leftborder}`}>
							<p>Weight</p>
							<h3>{filteredScheduleData[0]?.weight}</h3>
						</div>
					</div>
				</div>

				<div className={styles.formsdiv}>
					<div className={styles.origindiv}>
						<h1>Origin</h1>
						<div className={styles.origincon}>
							<div className={styles.costbox}>
								<h3 className={styles.origintitle}>Cost</h3>
								<div
									className={`${styles.origincontainer} ${styles.ptop3}`}>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>OCFS</h1>
										<div className={styles.costperdiv}>
											<h1
												className={`${styles.per} ${styles.perdoc}`}>
												Per Container
											</h1>
											<input
												name="OCC"
												{...register("OCC")}
												className={styles.occ}
												disabled={true}
											/>
										</div>
										<input
											type="number"
											name="OCFS"
											disabled={disabled}
											onWheel={() =>
												document.activeElement.blur()
											}
											{...register("OCFS", {
												onChange: (event) => {
													setValue(
														"ROCFS",
														division(
															event.target.value,
															watchFields.OGBECBM
														)
													);
													setValue(
														"OMBECBM",
														division(
															event.target.value,
															watchFields.MROCFS
														)
													);
												},
											})}
											className={`${styles.rateinput} ${
												errors?.OCFS
													? styles.errors
													: ""
											}`}
										/>
									</div>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>ODOC</h1>
										<div className={styles.costperdiv}>
											<h1
												className={`${styles.per} ${styles.perdoc}`}>
												Per Doc
											</h1>
											<input
												name="OCC"
												{...register("OCC")}
												className={styles.occ}
												disabled={true}
											/>
										</div>
										<input
											type="number"
											onWheel={() =>
												document.activeElement.blur()
											}
											name="ODOC"
											{...register("ODOC", {
												onChange: (event) => {
													setValue(
														"RODOC",
														roundNumber(
															event.target.value
														)
													);
												},
											})}
											className={`${styles.rateinput} ${
												errors?.ODOC
													? styles.errors
													: ""
											}`}
											disabled={disabled}
										/>
									</div>
								</div>
							</div>
							<div className={styles.breakebox}>
								<h3 className={styles.origintitle}>
									Breakeven
								</h3>
								<div
									className={`${styles.origincontainer} ${styles.ptop3}`}>
									<div className={styles.originflex}>
										<div className={styles.bediv}>
											<h1 className={styles.per}>
												General BE
											</h1>
										</div>
										<div className={styles.cbmdiv}>
											<input
												type="number"
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("OGBECBM", {
													onChange: (event) => {
														setValue(
															"ROCFS",
															division(
																watchFields.OCFS,
																event.target
																	.value
															)
														);
													},
												})}
												name="OGBECBM"
												className={`${styles.beinput} ${
													checkCBMExceeds(
														watchFields.OGBECBM,
														filteredScheduleData[0]
													)
														? styles.errors
														: ""
												}${
													errors?.OGBECBM
														? styles.errors
														: ""
												}`}
												disabled={disabled}
											/>
											<h3 className={styles.inrtxt}>
												CBM
											</h3>
										</div>
									</div>
									<div className={styles.originflex}>
										<div className={styles.bediv}>
											<h1 className={styles.per}>
												Market Rate BE
											</h1>
										</div>
										<div className={styles.cbmdiv}>
											<input
												disabled={true}
												type="number"
												{...register("OMBECBM")}
												name="OMBECBM"
												className={`${styles.beinput} ${
													checkCBMExceeds(
														watchFields.OMBECBM,
														filteredScheduleData[0]
													)
														? styles.errorstxt
														: ""
												}`}
											/>
											<h3 className={styles.inrtxt}>
												CBM
											</h3>
										</div>
									</div>
								</div>
							</div>
							<div className={styles.compatebox}>
								<h3 className={styles.origintitle}>
									Comparison
								</h3>
								<div className={styles.comparecon}>
									<div className={styles.comaprelable}>
										<h1
											className={`${styles.per} ${styles.comparetxt}`}>
											OCFS
										</h1>
										<h1
											className={`${styles.per} ${styles.ptop3}`}>
											ODOC
										</h1>
									</div>
									<div className={styles.comapreval}>
										<div className={styles.ratecompare}>
											<h3 className={styles.inrtxt}>
												Rate
											</h3>
											<h3 className={styles.inrtxt}>
												Market Rate
											</h3>
										</div>
										<div className={styles.ocfsvaldivdiv}>
											<input
												type="number"
												{...register("ROCFS")}
												name="ROCFS"
												className={styles.beinput}
												disabled={true}
											/>
											<input
												type="number"
												disabled={disabled}
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("MROCFS", {
													onChange: (event) => {
														setValue(
															"OMBECBM",
															division(
																watchFields.OCFS,
																event.target
																	.value
															),
															{
																shouldValidate: true,
															}
														);
													},
												})}
												name="MROCFS"
												className={`${
													styles.compareinput
												} ${
													errors?.MROCFS
														? styles.errors
														: ""
												}`}
											/>
										</div>
										<div className={styles.ocfsvaldivdiv}>
											<input
												type="number"
												name="RODOC"
												{...register("RODOC")}
												className={styles.beinput}
												disabled={true}
											/>
											<input
												type="number"
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("MRODOC")}
												name="MRODOC"
												className={`${styles.beinput} ${
													errors?.MRODOC
														? styles.errors
														: ""
												}`}
												disabled={disabled}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`${styles.origindiv} ${styles.ptop}`}>
						<h1>Freight</h1>
						<div className={styles.origincon}>
							<div className={styles.costbox}>
								<h3 className={styles.origintitle}>Cost</h3>
								<div
									className={`${styles.origincontainer} ${styles.ptop3}`}>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>
											Freight Rate
										</h1>
										<h1 className={styles.per}>
											Per Container
										</h1>
										<h3 className={styles.inrtxt}>USD </h3>
										<input
											type="number"
											onWheel={() =>
												document.activeElement.blur()
											}
											{...register("F", {
												onChange: (event) => {
													setValue(
														"RF",
														division(
															event.target.value,
															watchFields.FGBECBM
														),
														{ shouldValidate: true }
													);
													setValue(
														"FMBECBM",
														division(
															event.target.value,
															watchFields.MRF
														)
													);
												},
											})}
											className={`${styles.rateinput} ${
												errors?.F ? styles.errors : ""
											}`}
											name="F"
											disabled={disabled}
										/>
									</div>
								</div>
							</div>
							<div className={styles.breakebox}>
								<h3 className={styles.origintitle}>
									Breakeven
								</h3>
								<div
									className={`${styles.origincontainer} ${styles.ptop3}`}>
									<div className={styles.originflex}>
										<div className={styles.bediv}>
											<h1 className={styles.per}>
												General BE
											</h1>
										</div>
										<div className={styles.cbmdiv}>
											<input
												type="number"
												disabled={disabled}
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("FGBECBM", {
													onChange: (event) => {
														setValue(
															"RF",
															division(
																watchFields.F,
																event.target
																	.value
															)
														);
													},
												})}
												name="FGBECBM"
												className={`${styles.beinput} ${
													checkCBMExceeds(
														watchFields.FGBECBM,
														filteredScheduleData[0]
													)
														? styles.errors
														: ""
												}${
													errors?.FGBECBM
														? styles.errors
														: ""
												}`}
											/>
											<h3 className={styles.inrtxt}>
												CBM
											</h3>
										</div>
									</div>
									<div className={styles.originflex}>
										<div className={styles.bediv}>
											<h1 className={styles.per}>
												Market Rate BE
											</h1>
										</div>
										<div className={styles.cbmdiv}>
											<input
												type="number"
												{...register("FMBECBM")}
												name="FMBECBM"
												disabled={true}
												className={`${styles.beinput} ${
													checkCBMExceeds(
														watchFields.FMBECBM,
														filteredScheduleData[0]
													)
														? styles.errorstxt
														: ""
												}`}
											/>
											<h3 className={styles.inrtxt}>
												CBM
											</h3>
										</div>
									</div>
								</div>
							</div>
							<div className={styles.compatebox}>
								<h3 className={styles.origintitle}>
									Comparison
								</h3>
								<div className={styles.comparecon}>
									<div className={styles.comaprelable}>
										<h1
											className={`${styles.per} ${styles.comparetxt}`}>
											Freight Rate
										</h1>
									</div>
									<div className={styles.comapreval}>
										<div className={styles.ratecompare}>
											<h3 className={styles.inrtxt}>
												Rate
											</h3>
											<h3 className={styles.inrtxt}>
												Market Rate
											</h3>
										</div>
										<div className={styles.ocfsvaldivdiv}>
											<input
												type="number"
												name="RF"
												{...register("RF")}
												className={styles.compareinput}
												disabled={true}
											/>
											<input
												type="number"
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("MRF", {
													onChange: (event) => {
														setValue(
															"FMBECBM",
															division(
																watchFields.F,
																event.target
																	.value
															),
															{
																shouldValidate: true,
															}
														);
													},
												})}
												name="MRF"
												className={`${
													styles.compareinput
												} ${
													errors?.MRF
														? styles.errors
														: ""
												}`}
												disabled={disabled}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`${styles.origindiv} ${styles.ptop}`}>
						<h1>Destination</h1>
						<div className={styles.origincon}>
							<div className={styles.costbox}>
								<h3 className={styles.origintitle}>Cost</h3>
								<div
									className={`${styles.origincontainer} ${styles.ptop3}`}>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>DCFS</h1>
										<div
											className={
												styles.destinationperdiv
											}>
											<h1 className={styles.per}>
												Per Container
											</h1>
											<input
												name="CDCFS"
												{...register("CDCFS")}
												className={styles.rateinput}
												disabled={true}
											/>
										</div>
										<input
											type="number"
											onWheel={() =>
												document.activeElement.blur()
											}
											{...register("DCFS", {
												onChange: (event) => {
													setValue(
														"CDCFS",
														singleRateData.destinationCost.CDCFS.toUpperCase()
													);
													setValue(
														"CDDO",
														singleRateData.destinationCost.CDCFS.toUpperCase()
													);
													setValue(
														"RDCFS",
														division(
															event.target.value,
															watchFields.DGBECBM
														)
													);
													setValue(
														"DMBECBM",
														division(
															event.target.value,
															watchFields.MRDCFS
														),
														{ shouldValidate: true }
													);
												},
											})}
											name="DCFS"
											className={`${styles.rateinput} ${
												errors?.DCFS
													? styles.errors
													: ""
											}`}
											disabled={disabled}
										/>
									</div>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>DDO</h1>
										<div
											className={
												styles.destinationperdiv
											}>
											<h1 className={styles.per}>
												Per Doc
											</h1>
											<input
												name="CDDO"
												{...register("CDDO")}
												className={styles.rateinput}
												disabled={true}
											/>
										</div>
										<input
											type="number"
											onWheel={() =>
												document.activeElement.blur()
											}
											{...register("DDO", {
												onChange: (event) => {
													setValue(
														"RDDO",
														roundNumber(
															event.target.value
														)
													);
												},
											})}
											name="DDO"
											className={`${styles.rateinput} ${
												errors?.DDO ? styles.errors : ""
											}`}
											disabled={disabled}
										/>
									</div>
								</div>
							</div>
							<div className={styles.breakebox}>
								<h3 className={styles.origintitle}>
									Breakeven
								</h3>
								<div
									className={`${styles.origincontainer} ${styles.ptop3}`}>
									<div className={styles.originflex}>
										<div className={styles.bediv}>
											<h1 className={styles.per}>
												General BE
											</h1>
										</div>
										<div className={styles.cbmdiv}>
											<input
												type="number"
												disabled={disabled}
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("DGBECBM", {
													onChange: (event) => {
														setValue(
															"RDCFS",
															division(
																watchFields.DCFS,
																event.target
																	.value
															)
														);
													},
												})}
												name="DGBECBM"
												className={`${styles.beinput} ${
													checkCBMExceeds(
														watchFields.DGBECBM,
														filteredScheduleData[0]
													)
														? styles.errors
														: ""
												}${
													errors?.DGBECBM
														? styles.errors
														: ""
												}`}
											/>
											<h3 className={styles.inrtxt}>
												CBM
											</h3>
										</div>
									</div>
									<div className={styles.originflex}>
										<div className={styles.bediv}>
											<h1 className={styles.per}>
												Market Rate BE
											</h1>
										</div>
										<div className={styles.cbmdiv}>
											<input
												type="number"
												{...register("DMBECBM")}
												name="DMBECBM"
												disabled={true}
												className={`${styles.beinput} ${
													checkCBMExceeds(
														watchFields.DMBECBM,
														filteredScheduleData[0]
													)
														? styles.errorstxt
														: ""
												}`}
											/>
											<h3 className={styles.inrtxt}>
												CBM
											</h3>
										</div>
									</div>
								</div>
							</div>
							<div className={styles.compatebox}>
								<h3 className={styles.origintitle}>
									Comparison
								</h3>
								<div className={styles.comparecon}>
									<div className={styles.comaprelable}>
										<h1
											className={`${styles.per} ${styles.comparetxt}`}>
											DCFS
										</h1>
										<h1
											className={`${styles.per} ${styles.ptop3}`}>
											DDO
										</h1>
									</div>
									<div className={styles.comapreval}>
										<div className={styles.ratecompare}>
											<h3 className={styles.inrtxt}>
												Rate
											</h3>
											<h3 className={styles.inrtxt}>
												Market Rate
											</h3>
										</div>
										<div className={styles.ocfsvaldivdiv}>
											<input
												type="number"
												name="RDCFS"
												{...register("RDCFS")}
												className={styles.compareinput}
												disabled={true}
											/>
											<input
												type="number"
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("MRDCFS", {
													onChange: (event) => {
														setValue(
															"DMBECBM",
															division(
																watchFields.DCFS,
																event.target
																	.value
															),
															{
																shouldValidate: true,
															}
														);
													},
												})}
												name="MRDCFS"
												className={`${
													styles.compareinput
												} ${
													errors?.MRDCFS
														? styles.errors
														: ""
												}`}
												disabled={disabled}
											/>
										</div>
										<div className={styles.ocfsvaldivdiv}>
											<input
												type="number"
												name="RDDO"
												{...register("RDDO")}
												className={styles.compareinput}
												disabled={true}
											/>
											<input
												type="number"
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("MRDDO")}
												name="MRDDO"
												className={`${styles.beinput} ${
													errors?.MRDDO
														? styles.errors
														: ""
												}`}
												disabled={disabled}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{singleRateData?.otherCost?.OCOMName?.trim()?.length >
						0 && (
						<div className={`${styles.origindiv} ${styles.ptop}`}>
							<h1>Other</h1>
							<div className={styles.origincon}>
								<div className={styles.costbox}>
									<h3 className={styles.origintitle}>Cost</h3>
									<div
										className={`${styles.origincontainer} ${styles.ptop3}`}>
										<div className={styles.originflex}>
											<h1
												className={`${styles.ocfs} ${styles.elleps} text-uppercase`}>
												{
													singleRateData.otherCost
														.OCOMName
												}
											</h1>
											<h1 className={styles.per}>
												Per Doc
											</h1>
											<input
												type="text"
												{...register("OC")}
												name="OC"
												disabled={true}
												className={`${styles.rateinput} ${styles.captial}`}
											/>

											<input
												type="number"
												onWheel={() =>
													document.activeElement.blur()
												}
												{...register("OR", {
													onChange: (event) => {
														setValue(
															"OCOMR",
															roundNumber(
																event.target
																	.value
															)
														);
													},
												})}
												name="OR"
												className={`${
													styles.rateinput
												} ${
													errors?.OR
														? styles.errors
														: ""
												}`}
												disabled={disabled}
											/>
										</div>
									</div>
								</div>
								<div className={styles.compatebox}>
									<h3 className={styles.origintitle}>
										Comparison
									</h3>
									<div className={styles.comparecon}>
										<div className={styles.comaprelable}>
											<h1
												className={`${styles.per} ${styles.comparetxt} ${styles.elleps} text-uppercase`}>
												{
													singleRateData
														.otherComparison
														.OCOMName
												}
											</h1>
										</div>
										<div className={styles.comapreval}>
											<div className={styles.ratecompare}>
												<h3 className={styles.inrtxt}>
													Rate
												</h3>
												<h3 className={styles.inrtxt}>
													Market Rate
												</h3>
											</div>
											<div
												className={
													styles.ocfsvaldivdiv
												}>
												<input
													type="number"
													{...register("OCOMR")}
													name="OCOMR"
													className={
														styles.compareinput
													}
													disabled={true}
												/>
												<input
													type="number"
													onWheel={() =>
														document.activeElement.blur()
													}
													{...register("OCOMMR")}
													name="OCOMMR"
													className={`${
														styles.compareinput
													} ${
														errors?.OCOMMR
															? styles.errors
															: ""
													}`}
													disabled={disabled}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
					<div className={`${styles.origincon} ${styles.ptop3}`}>
						<div className={`${styles.costbox} ${styles.otherbox}`}>
							<h3
								className={`${styles.origintitle} ${styles.othertitle}`}>
								Final Preview - Start Price
							</h3>
							<div className={styles.origincontainer}>
								<div>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>OCFS</h1>
										<div className={styles.finalvalflex}>
											<h3 className={styles.inrtxt}>
												USD
											</h3>
											<h3 className={styles.inrtxt}>
												{checkGreaterRate(
													watchFields.ROCFS,
													watchFields.MROCFS,
													Originrate,
													singleRateData.originCost
														.OCC
												)}{" "}
												$
											</h3>
										</div>
									</div>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>ODOC</h1>
										<div className={styles.finalvalflex}>
											<h3 className={styles.inrtxt}>
												USD
											</h3>
											<h3 className={styles.inrtxt}>
												{checkLesserRate(
													watchFields.RODOC,
													watchFields.MRODOC,
													Originrate,
													singleRateData.originCost
														.OCC
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
										<div className={styles.finalvalflex}>
											<h3
												className={`${styles.inrtxt} ${styles.totalval}`}>
												USD{" "}
											</h3>
											<h3
												className={`${styles.inrtxt} ${styles.totalval}`}>
												{checkGreaterRate(
													watchFields.ROCFS,
													watchFields.MROCFS,
													Originrate,
													singleRateData.originCost
														.OCC
												) +
													checkLesserRate(
														watchFields.RODOC,
														watchFields.MRODOC,
														Originrate,
														singleRateData
															.originCost.OCC
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
										<div className={styles.finalvalflex}>
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
										<h1 className={styles.ocfs}>DCFS</h1>
										<div className={styles.finalvalflex}>
											<h3 className={styles.inrtxt}>
												USD{" "}
											</h3>
											<h3 className={styles.inrtxt}>
												{checkGreaterRate(
													watchFields.RDCFS,
													watchFields.MRDCFS,
													destinationrate,
													singleRateData
														.destinationCost.CDCFS
												)}{" "}
												$
											</h3>
										</div>
									</div>
									<div className={styles.originflex}>
										<h1 className={styles.ocfs}>DDO</h1>
										<div className={styles.finalvalflex}>
											<h3 className={styles.inrtxt}>
												USD{" "}
											</h3>
											<h3 className={styles.inrtxt}>
												{checkLesserRate(
													watchFields.RDDO,
													watchFields.MRDDO,
													destinationrate,
													singleRateData
														.destinationCost.CDCFS
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
										<div className={styles.finalvalflex}>
											<h3
												className={`${styles.inrtxt} ${styles.totalval}`}>
												USD{" "}
											</h3>
											<h3
												className={`${styles.inrtxt} ${styles.totalval}`}>
												{checkGreaterRate(
													watchFields.RDCFS,
													watchFields.MRDCFS,
													destinationrate,
													singleRateData
														.destinationCost.CDCFS
												) +
													checkLesserRate(
														watchFields.RDDO,
														watchFields.MRDDO,
														destinationrate,
														singleRateData
															.destinationCost
															.CDCFS
													)}{" "}
												$
											</h3>
										</div>
									</div>
									{singleRateData?.otherCost?.OCOMName?.trim()
										?.length > 0 && (
										<div className={styles.originflex}>
											<h1
												className={`${styles.ocfs} ${styles.elleps} text-uppercase`}>
												{
													singleRateData.otherCost
														.OCOMName
												}{" "}
												Fee
											</h1>
											<div
												className={styles.finalvalflex}>
												<h3 className={styles.inrtxt}>
													USD
												</h3>
												<h3 className={styles.inrtxt}>
													{checkLesserRate(
														watchFields.OCOMR,
														watchFields.OCOMMR,
														usdRates,
														"usd"
													)}{" "}
													$
												</h3>
											</div>
										</div>
									)}
								</div>
							</div>
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
											Originrate,
											watchFields.OCC
										) -
											currencyCovert(
												watchFields.ROCFS,
												Originrate,
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
											Originrate,
											watchFields.OCC
										) -
											currencyCovert(
												watchFields.RODOC,
												Originrate,
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
											Originrate,
											watchFields.OCC
										) -
											currencyCovert(
												watchFields.ROCFS,
												Originrate,
												watchFields.OCC
											) +
											currencyCovert(
												watchFields.MRODOC,
												Originrate,
												watchFields.OCC
											) -
											currencyCovert(
												watchFields.RODOC,
												Originrate,
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
											destinationrate,
											watchFields.OCC
										) -
											currencyCovert(
												watchFields.RDCFS,
												destinationrate,
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
											destinationrate,
											watchFields.OCC
										) -
											currencyCovert(
												watchFields.RDDO,
												destinationrate,
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
											destinationrate,
											watchFields.OCC
										) -
											currencyCovert(
												watchFields.RDCFS,
												destinationrate,
												watchFields.OCC
											) +
											currencyCovert(
												watchFields.MRDDO,
												destinationrate,
												watchFields.OCC
											) -
											currencyCovert(
												watchFields.RDDO,
												destinationrate,
												watchFields.OCC
											)}{" "}
										$
									</h3>
								</div>
								{singleRateData?.otherCost?.OCOMName?.trim()
									?.length > 0 && (
									<div className={styles.originflex}>
										<h1
											className={`${styles.per} ${styles.elleps} text-uppercase`}>
											{singleRateData.otherCost.OCOMName}{" "}
											Fee
										</h1>
										<h3 className={styles.inrtxt}>
											{checkDifferentRate(
												watchFields.OCOMR,
												watchFields.OCOMMR,
												usdRates,
												watchFields.OC
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
											Originrate,
											watchFields.OCC
										) -
											currencyCovert(
												watchFields.ROCFS,
												Originrate,
												watchFields.OCC
											) +
											currencyCovert(
												watchFields.MRODOC,
												Originrate,
												watchFields.OCC
											) -
											currencyCovert(
												watchFields.RODOC,
												Originrate,
												watchFields.OCC
											) +
											Math.round(
												watchFields.MRF - watchFields.RF
											) +
											currencyCovert(
												watchFields.MRDCFS,
												destinationrate,
												watchFields.OCC
											) -
											currencyCovert(
												watchFields.RDCFS,
												destinationrate,
												watchFields.OCC
											) +
											currencyCovert(
												watchFields.MRDDO,
												destinationrate,
												watchFields.OCC
											) -
											currencyCovert(
												watchFields.RDDO,
												destinationrate,
												watchFields.OCC
											) +
											checkDifferentRate(
												watchFields.OCOMR,
												watchFields.OCOMMR,
												usdRates,
												watchFields.OC
											)}{" "}
										$
									</h3>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.buttoncontainer}>
						<div>
							<h4 className={styles.usdrates}>
								1 {singleRateData.destinationCost.CDCFS} ={" "}
								{destinationrate} INR
							</h4>
							{singleRateData.destinationCost.CDCFS !== "USD" && (
								<h4 className={styles.usdrates}>
									1 USD = {usdRates} INR
								</h4>
							)}
						</div>
						{ProfileRole === 2 && singleRateData?.status === 2 && (
							<div
								className={`${styles.btns} ${
									disabled === false && styles.approve
								}`}>
								{disabled !== false && (
									<button
										className={styles.editbtns}
										type="button"
										onClick={() => sertDisabled(!disabled)}>
										Edit
									</button>
								)}
								<button className={styles.approvebtns}>
									Approve
								</button>
							</div>
						)}
					</div>
				</div>
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
