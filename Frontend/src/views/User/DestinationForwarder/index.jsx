import styles from "./index.module.css";
import AddressCard from "../../../components/AddressCard";
import Form from "react-bootstrap/Form";
import BookingFooter from "../../../components/BookingFooter/index";
import { Controller, useForm } from "react-hook-form";
import { destinationForwarderValidation } from "../../../validationSchema/destinationForwarderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../../components/Loader/Loader";
import { useCountries } from "../../../hooks/country";
import { convertFirstLettersAsUpperCase, keyMatchLoop } from "../../../helper";
import { useInsertDestination } from "../../../hooks/destinationForwarder";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
	handleDestinationFSaveFlag,
	insertConsigneeDetails,
} from "../../../redux/slices/checkoutSlice";
import { useSchedulesBasedRates } from "../../../hooks/cargoDetail";
import { useLane } from "../../../hooks/lane";
import useMediaQuery from "@mui/material/useMediaQuery";

function DestinationForwarder({ destinationFList }) {
	const [searchAndFilterValues, setSearchAndFilterValues] = useState("");

	const navigate = useNavigate();

	const dispatch = useDispatch();

	let userDetail = useSelector((state) => state.profile.profileData);

	const { scheduleId } = useParams();

	const { consigneeDetails, bookingId, dfSaveFlag, shipperDetails } =
		useSelector((state) => state.checkoutDetails);

	const mobileView = useMediaQuery("(max-width:765px)");

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { isDirty, errors },
	} = useForm({
		resolver: yupResolver(destinationForwarderValidation),
		mode: "onTouched",
		defaultValues: {
			doorNo: consigneeDetails ? consigneeDetails.doorNo : "",
			building: consigneeDetails ? consigneeDetails.building : "",
			street: consigneeDetails ? consigneeDetails.street : "",
			area: consigneeDetails ? consigneeDetails.area : "",
			city: consigneeDetails ? consigneeDetails.city : "",
			state: consigneeDetails ? consigneeDetails.state : "",
			name: consigneeDetails ? consigneeDetails.name : "",
			email: consigneeDetails ? consigneeDetails.email : "",
			mobile: consigneeDetails ? consigneeDetails.mobile : "",
			companyName: consigneeDetails ? consigneeDetails.companyName : "",
			country: consigneeDetails ? consigneeDetails.country : "",
			saveFlag: consigneeDetails
				? consigneeDetails.saveFlag === 1
					? true
					: Boolean(0)
				: true,
			phoneCodeLength: consigneeDetails
				? consigneeDetails.phoneCodeLength
				: "",
		},
	});

	useEffect(() => {
		if (isDirty === true) {
			dispatch(handleDestinationFSaveFlag(true));
			setValue("saveFlag", true);
		}
	}, [isDirty]);

	const watchFields = watch();

	const {
		data: countryList,
		isLoading: conutryLoading,
		isError,
		error,
		isSuccess: countrySuccess,
	} = useCountries();

	const {
		data: laneData,
		isLoading: laneLoading,
		isSuccess: laneSuccess,
	} = useLane();

	const {
		data: scheduleRatedata,
		isLoading: scheduleRateLoading,
		isSuccess: scheduleRateSuccess,
	} = useSchedulesBasedRates(scheduleId);

	const onInsertSuccess = (data) => {
		navigate(`/user/booking/${scheduleId}#4`);
	};

	const { mutate, isLoading: insertDestinationLoading } =
		useInsertDestination(onInsertSuccess);

	useEffect(() => {
		if (
			scheduleRateSuccess &&
			countrySuccess &&
			laneSuccess &&
			!consigneeDetails
		) {
			const destinationPod = scheduleRatedata[0].pod;
			const countryId = laneData.find(
				({ _id }) => _id === destinationPod
			).country;
			const countryData = countryList.find(
				({ _id }) => _id === countryId
			);
			setValue("country", countryData._id);
			setValue("phoneCodeLength", countryData.phCode);
			setValue("phoneNumberLength", countryData.phNumberFormat);
			setValue("countryCode", countryData.countryCode);
		}
	}, [scheduleRateSuccess, countrySuccess, laneSuccess]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (conutryLoading || scheduleRateLoading || laneLoading) {
		return <Loader />;
	}

	if (shipperDetails == null || bookingId == null) {
		return <Navigate to={"/user/dashboard"} replace={true} />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	const handleForm = (data) => {
		let postData = { ...data };
		postData.bookingId = bookingId;
		postData.createdBy = localStorage.getItem("allMasterId");
		postData.saveFlag = data.saveFlag === true ? 1 : 0;
		postData.status = 4;
		postData.legalName = userDetail.legalName;
		delete postData._id;
		dispatch(insertConsigneeDetails(postData));
		mutate(postData);
	};

	const handleClick = (e) => {
		dispatch(handleDestinationFSaveFlag(false));

		reset({
			...e,
			saveFlag: false,
			phoneCodeLength: watchFields.phoneCodeLength,
		});
	};

	const backButton = () => {
		navigate(`/user/booking/${scheduleId}#2`);
	};

	function returnFilteredArray(array) {
		let bid = bookingId;
		return array.filter(
			({ country, bookingId }) =>
				watchFields.country === country && bookingId !== bid
		);
	}

	const filteredArray = returnFilteredArray(destinationFList);

	return (
		<Form onSubmit={handleSubmit(handleForm)}>
			<div className={`container ${styles.pbcontiner}`}>
				{filteredArray.length !== 0 && (
					<div className={styles.mainbox}>
						<div className={styles.titlediv}>
							<h1>Saved Destination Forwarder</h1>
							<p>
								{filteredArray.length} - Destination Forwarders
								Added
							</p>
							<input
								type="text"
								placeholder="Search Forwarders"
								onChange={(e) =>
									setSearchAndFilterValues(e.target.value)
								}
							/>
						</div>
						<div className={styles.contentdiv}>
							<div className={styles.addresscard}>
								<Swiper
									slidesPerView={mobileView ? 1 : 2.5}
									spaceBetween={10}
									navigation={true}
									modules={[Navigation]}
									className="mySwiper">
									{filteredArray
										.filter((e) =>
											e.companyName
												.toLowerCase()
												.includes(
													searchAndFilterValues.toLowerCase()
												)
										)
										.map((e) => {
											const countryCode = keyMatchLoop(
												"_id",
												countryList,
												e.country
											)?.countryCode;
											return (
												<SwiperSlide key={e._id}>
													<AddressCard
														handleClick={() =>
															handleClick(e)
														}
														logistics={
															e.companyName
														}
														mail={e.email}
														phone={e.mobile}
														name={e.name}
														Ccode={countryCode}
													/>
												</SwiperSlide>
											);
										})}
								</Swiper>
							</div>
						</div>
					</div>
				)}
				<div className={styles.mainbox}>
					<div className={styles.titlediv}>
						<h1>Destination Forwarder Details</h1>
					</div>
					<div className={styles.contentdiv}>
						<div className={styles.formdiv}>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									className={styles.labels}
									htmlFor="name">
									Name
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="name"
											className={styles.formcontrol}
											placeholder="Enter name"
										/>
									)}
								/>
								{errors.name && (
									<span className="error">
										{errors.name.message}
									</span>
								)}
							</Form.Group>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									className={styles.labels}
									htmlFor="email">
									Email
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="email"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="area"
											className={styles.formcontrol}
											placeholder="Enter email"
										/>
									)}
								/>
								{errors.email && (
									<span className="error">
										{errors.email.message}
									</span>
								)}
							</Form.Group>
						</div>
						<div className={styles.formdiv}>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									className={styles.labels}
									htmlFor="mobile">
									Mobile Number
									<span style={{ color: "red" }}>*</span>
								</Form.Label>

								<Controller
									name="mobile"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="mobile"
											className={styles.formcontrol}
											placeholder="Enter Mobile Number with country code"
										/>
									)}
								/>
								{errors.mobile && (
									<span className="error">
										{errors.mobile.message}
									</span>
								)}
							</Form.Group>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									className={styles.labels}
									htmlFor="companyName">
									Company Name
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="companyName"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="companyName"
											className={styles.formcontrol}
											placeholder="Enter Company Name"
										/>
									)}
								/>
								{errors.companyName && (
									<span className="error">
										{errors.companyName.message}
									</span>
								)}
							</Form.Group>
						</div>
					</div>
				</div>
				<div className={styles.addressdiv}>
					<div className={styles.titlediv}>
						<h1>Destination Forwarder Address</h1>
						<p className={styles.fill}>Fill in your details</p>
					</div>
					<div className={styles.contentdiv}>
						<div className={styles.formdiv}>
							<Form.Group className={styles.doordiv}>
								<Form.Label
									className={styles.labels}
									htmlFor="doorNo">
									Door No.
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="doorNo"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="doorNo"
											className={styles.formcontrol}
											placeholder="Enter Door No"
										/>
									)}
								/>
								{errors.doorNo && (
									<span className="error">
										{errors.doorNo.message}
									</span>
								)}
							</Form.Group>
							<Form.Group className={styles.building}>
								<Form.Label
									className={styles.labels}
									htmlFor="building">
									Building
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="building"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="building"
											className={styles.formcontrol}
											placeholder="Enter Building"
										/>
									)}
								/>
								{errors.building && (
									<span className="error">
										{errors.building.message}
									</span>
								)}
							</Form.Group>
						</div>
						<div className={styles.formdiv}>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									className={styles.labels}
									htmlFor="street">
									Street
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="street"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="street"
											className={styles.formcontrol}
											placeholder="Enter Street"
										/>
									)}
								/>
								{errors.street && (
									<span className="error">
										{errors.street.message}
									</span>
								)}
							</Form.Group>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									className={styles.labels}
									htmlFor="area">
									Area / Locality
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="area"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="area"
											className={styles.formcontrol}
											placeholder="Enter Area"
										/>
									)}
								/>
								{errors.area && (
									<span className="error">
										{errors.area.message}
									</span>
								)}
							</Form.Group>
						</div>
						<div className={styles.formdiv}>
							<Form.Group className={styles.country}>
								<Form.Label
									className={styles.labels}
									htmlFor="country">
									Country
								</Form.Label>
								<Controller
									name="country"
									control={control}
									render={({ field }) => (
										<Form.Select
											{...field}
											id="country"
											className={styles.formcontrol}
											disabled>
											<option value="">
												Select Country
											</option>
											{countryList
												.filter(
													(country) =>
														country.countryCode !==
														"in"
												)
												.map((item) => (
													<option
														key={item._id}
														value={item._id}>
														{convertFirstLettersAsUpperCase(
															item.countryName
														)}
													</option>
												))}
										</Form.Select>
									)}
								/>
								{errors.country && (
									<span className="error">
										{errors.country.message}
									</span>
								)}
							</Form.Group>
							<Form.Group className={styles.state}>
								<Form.Label
									className={styles.State}
									htmlFor="state">
									State<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="state"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="state"
											className={styles.formcontrol}
											placeholder="Enter State"
										/>
									)}
								/>
								{errors.state && (
									<span className="error">
										{errors.state.message}
									</span>
								)}
							</Form.Group>
							<Form.Group className={styles.city}>
								<Form.Label
									className={styles.labels}
									htmlFor="city">
									City<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="city"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="city"
											className={styles.formcontrol}
											placeholder="Enter City"
										/>
									)}
								/>
								{errors.city && (
									<span className="error">
										{errors.city.message}
									</span>
								)}
							</Form.Group>
						</div>
						{dfSaveFlag && (
							<div className={styles.saveFlag}>
								<Controller
									name="saveFlag"
									control={control}
									render={({ field }) => (
										<Form.Check
											{...field}
											type="checkbox"
											id="saveFlag"
											checked={field.value}
											onChange={(e) =>
												field.onChange(e.target.checked)
											}
											label={
												"Save Details for the future use"
											}
										/>
									)}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<BookingFooter
				mutateState={insertDestinationLoading}
				onBackClick={backButton}
			/>
		</Form>
	);
}
export default DestinationForwarder;
