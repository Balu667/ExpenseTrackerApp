import styles from "./index.module.css";
import AddressCard from "../../../components/AddressCard";
import Form from "react-bootstrap/Form";
import BookingFooter from "../../../components/BookingFooter/index";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { notifyPartyValidation } from "../../../validationSchema/notifyPartyValidation";
import { useInsertNotifyParty } from "../../../hooks/notifyParty";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader/Loader";
import { useNavigate, useParams, Navigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
	handleNotifyCheckbox,
	insertNotifyPartyDetails,
} from "../../../redux/slices/checkoutSlice";
import { useCountries } from "../../../hooks/country";
import { keyMatchLoop } from "../../../helper";
import useMediaQuery from "@mui/material/useMediaQuery";

function NotifyParty({ notifySavedAddressList }) {
	const { notifyPartyDetails, bookingId, consigneeDetails, notifyCheckbox } =
		useSelector((state) => state.checkoutDetails);

	const mobileView = useMediaQuery("(max-width:765px)");

	const [searchAndFilterValues, setSearchAndFilterValues] = useState("");

	const [checkboxDisable, setCheckboxDisable] = useState(false);

	let userDetail = useSelector((state) => state.profile.profileData);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { scheduleId } = useParams();

	const {
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { isDirty, errors },
	} = useForm({
		resolver: yupResolver(notifyPartyValidation),
		mode: "onTouched",
		defaultValues: {
			doorNo: notifyPartyDetails
				? notifyPartyDetails.doorNo
				: consigneeDetails?.doorNo,
			building: notifyPartyDetails
				? notifyPartyDetails.building
				: consigneeDetails?.building,
			street: notifyPartyDetails
				? notifyPartyDetails.street
				: consigneeDetails?.street,
			area: notifyPartyDetails
				? notifyPartyDetails.area
				: consigneeDetails?.area,
			city: notifyPartyDetails
				? notifyPartyDetails.city
				: consigneeDetails?.city,
			state: notifyPartyDetails
				? notifyPartyDetails.state
				: consigneeDetails?.state,
			name: notifyPartyDetails
				? notifyPartyDetails.name
				: consigneeDetails?.name,
			email: notifyPartyDetails
				? notifyPartyDetails.email
				: consigneeDetails?.email,
			mobile: notifyPartyDetails
				? notifyPartyDetails.mobile
				: consigneeDetails?.mobile,
			companyName: notifyPartyDetails
				? notifyPartyDetails.companyName
				: consigneeDetails?.companyName,
			country: notifyPartyDetails
				? notifyPartyDetails.country
				: consigneeDetails?.country,
			saveFlag: notifyPartyDetails
				? notifyPartyDetails.saveFlag === 1
				: true,
			phoneCodeLength: notifyPartyDetails
				? notifyPartyDetails.phoneCodeLength
				: consigneeDetails?.phoneCodeLength,
		},
	});

	const inputChanged = isDirty;

	useEffect(() => {
		if (isDirty === true) {
			dispatch(handleNotifyCheckbox(false));
			setCheckboxDisable(false);
			setValue("saveFlag", true);
		}
	}, [inputChanged]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const {
		data: countryList,
		isLoading: countryLoading,
		isSuccess: countrySuccess,
	} = useCountries();

	const onInsertSuccess = (data) => {
		navigate(`/user/booking/${scheduleId}#5`);
	};

	const resetDestinationData = () => {
		if (consigneeDetails != null) {
			let countryName = keyMatchLoop(
				"_id",
				countryList,
				consigneeDetails.country
			).countryName;
			reset({
				...consigneeDetails,
				country: countryName,
				saveFlag: false,
			});
		}
	};

	useEffect(() => {
		if (countrySuccess && notifyPartyDetails == null) {
			dispatch(handleNotifyCheckbox(true));
			resetDestinationData();
		}
	}, [countrySuccess]);

	const { mutate, isLoading: insertNotifyLoading } =
		useInsertNotifyParty(onInsertSuccess);

	if (countryLoading) {
		return <Loader />;
	}

	if (consigneeDetails == null) {
		return <Navigate to="/user/dashboard" replace={true} />;
	}

	const handleSavedAddress = (address) => {
		dispatch(handleNotifyCheckbox(false));
		setCheckboxDisable(true);
		if (
			address.country.length === 24 &&
			address.country.indexOf(" ") === -1
		) {
			address.country = keyMatchLoop(
				"_id",
				countryList,
				address.country
			).countryName;
		}
		reset({
			...address,
			saveFlag: false,
			phoneCodeLength: address.phoneCodeLength,
			mobile: address.mobile.substring(address.phoneCodeLength),
		});
	};

	const onSubmit = (data) => {
		let postData = { ...data };
		postData.bookingId = bookingId;
		postData.createdBy = localStorage.getItem("allMasterId");
		postData.saveFlag = data.saveFlag === true ? 1 : 0;
		postData.legalName = userDetail.legalName;
		postData.status = 5;
		delete postData._id;
		dispatch(insertNotifyPartyDetails(postData));
		mutate(postData);
	};

	const backButton = () => {
		navigate(`/user/booking/${scheduleId}#3`);
	};

	const checkboxOnchange = (event) => {
		dispatch(handleNotifyCheckbox(event.target.checked));
		if (event.target.checked) {
			resetDestinationData();
		} else {
			reset({
				doorNo: "",
				building: "",
				street: "",
				area: "",
				city: "",
				state: "",
				name: "",
				email: "",
				mobile: "",
				emailFormat: "",
				companyName: "",
				country: "",
				saveFlag: true,
			});
		}
	};

	function returnFilteredArray(array) {
		let bid = bookingId;
		return array.filter(({ bookingId }) => bookingId !== bid);
	}

	const filteredArray = returnFilteredArray(notifySavedAddressList);

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<div className={`container ${styles.pbcontiner}`}>
				{filteredArray.length !== 0 && (
					<div className={styles.mainbox}>
						<div className={styles.titlediv}>
							<h1>Saved Notify Party</h1>
							<p>{filteredArray.length} - Notify Party Added</p>
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
									{notifySavedAddressList
										.filter(
											(e) =>
												e.companyName
													.toLowerCase()
													.includes(
														searchAndFilterValues.toLowerCase()
													) &&
												e.bookingId !== bookingId
										)
										.map((e, i) => {
											return (
												<SwiperSlide key={e._id}>
													<AddressCard
														handleClick={() =>
															handleSavedAddress(
																e
															)
														}
														logistics={
															e.companyName
														}
														mail={e.email}
														phone={e.mobile}
														name={e.name}
														Ccode={e.country}
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
						<h1>Notify Party Details</h1>
						<div className={styles.checkboxdiv}>
							<Form.Check
								type="checkbox"
								id="Destination"
								checked={notifyCheckbox}
								onChange={(event) => checkboxOnchange(event)}
							/>
							<label htmlFor="Destination">
								Same as Destination
							</label>
						</div>
					</div>

					<div className={styles.contentdiv}>
						<div className={styles.formdiv}>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									className={styles.labels}
									htmlFor="Name">
									Name<span style={{ color: "red" }}>*</span>
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
									Email<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="email"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="email"
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
											placeholder="Enter Mobile Number"
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
						<h1>Notify Party Address</h1>
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
											placeholder="Enter Building "
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
											placeholder="Enter area"
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
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="country"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											id="country"
											style={{
												textTransform: "capitalize",
											}}
											className={styles.formcontrol}
											placeholder="Enter country"
										/>
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
											placeholder="Enter state"
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
											placeholder="Enter city"
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

						{!notifyCheckbox && (
							<div className={styles.saveFlag}>
								{
									<Controller
										name="saveFlag"
										control={control}
										render={({ field }) => (
											<Form.Check
												{...field}
												type="checkbox"
												id="saveFlag"
												disabled={checkboxDisable}
												checked={field.value}
												onChange={(e) =>
													field.onChange(
														e.target.checked
													)
												}
												label={
													"Save Details for the future use"
												}
											/>
										)}
									/>
								}
							</div>
						)}
					</div>
				</div>
			</div>
			<BookingFooter
				mutateState={insertNotifyLoading}
				onBackClick={backButton}
			/>
		</Form>
	);
}
export default NotifyParty;
