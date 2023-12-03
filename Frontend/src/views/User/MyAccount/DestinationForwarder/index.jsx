import styles from "./index.module.css";
import AddressCard from "../../../../components/AddressCard/index";
import Form from "react-bootstrap/Form";
import { Controller, useForm } from "react-hook-form";
import { destinationForwarderValidation } from "../../../../validationSchema/dfValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../../../components/Loader/Loader";
import { useCountries } from "../../../../hooks/country";
import {
	convertFirstLettersAsUpperCase,
	keyMatchLoop,
} from "../../../../helper";
import { useInsertDestination } from "../../../../hooks/destinationForwarder";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";

function DestinationForwarder({ destinationFList }) {
	const mobileView = useMediaQuery("(max-width:765px)");
	const [searchAndFilterValues, setSearchAndFilterValues] = useState("");

	const [disable, setDisable] = useState(false);

	let userDetail = useSelector((state) => state.profile.profileData);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(destinationForwarderValidation),
		mode: "onTouched",
		defaultValues: {
			doorNo: "",
			building: "",
			street: "",
			area: "",
			city: "",
			state: "",
			name: "",
			email: "",
			mobile: "",
			companyName: "",
			country: "",
		},
	});

	const {
		data: countryList,
		isLoading: conutryLoading,
		isError,
		error,
	} = useCountries();

	const onInsertSuccess = (data) => {
		toast.success(data);
	};

	const { mutate } = useInsertDestination(onInsertSuccess);

	if (conutryLoading) {
		return <Loader />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}
	const handleClick = (address) => {
		setDisable(true);
		reset({
			...address,
		});
	};

	const handleForm = (data) => {
		let postData = { ...data };
		postData.createdBy = localStorage.getItem("allMasterId");
		postData.saveFlag = 1;
		delete postData.status;
		postData.legalName = userDetail.legalName;
		delete postData._id;
		mutate(postData);
		setDisable(false);
	};

	return (
		<Form onSubmit={handleSubmit(handleForm)}>
			<div className={styles.pbcontiner}>
				{destinationFList.length !== 0 && (
					<div className={styles.mainbox}>
						<div className={styles.titlediv}>
							<h1>Saved Destination Forwarder</h1>
							<p>
								{destinationFList.length} - Destination
								Forwarders Added
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
									{destinationFList
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

				{disable && (
					<div className={styles.addressdiv}>
						<div className={styles.titlediv}>
							<h1>Address</h1>
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
										State
										<span style={{ color: "red" }}>*</span>
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
										City
										<span style={{ color: "red" }}>*</span>
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
							<div className={styles.saveButton}>
								<button
									className={styles.closebtn}
									onClick={() => setDisable(!disable)}>
									Close
								</button>
								<button
									type="submit"
									className={styles.continuebtn}>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</Form>
	);
}
export default DestinationForwarder;
