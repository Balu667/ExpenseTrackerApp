import styles from "./index.module.css";
import AddressCard from "../../../../components/AddressCard";
import Form from "react-bootstrap/Form";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { notifyPartyValidation } from "../../../../validationSchema/npValidation";
import { useInsertNotifyParty } from "../../../../hooks/notifyParty";
import { useState } from "react";
import Loader from "../../../../components/Loader/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";

import { useSelector } from "react-redux";

import { useCountries } from "../../../../hooks/country";
import { keyMatchLoop } from "../../../../helper";
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";

function NotifyParty({ notifySavedAddressList }) {
	const [searchAndFilterValues, setSearchAndFilterValues] = useState("");

	const mobileView = useMediaQuery("(max-width:765px)");

	const [disable, setDisable] = useState(false);

	let userDetail = useSelector((state) => state.profile.profileData);

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(notifyPartyValidation),
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

	const { data: countryList, isLoading: countryLoading } = useCountries();

	const onInsertSuccess = (data) => {
		toast.success(data);
	};

	const { mutate } = useInsertNotifyParty(onInsertSuccess);

	if (countryLoading) {
		return <Loader />;
	}

	const handleSavedAddress = (address) => {
		setDisable(true);
		if (address.country.length === 24) {
			address.country = keyMatchLoop(
				"_id",
				countryList,
				address.country
			).countryName;
		}
		reset({ ...address });
	};

	const onSubmit = (data) => {
		let postData = { ...data };
		postData.createdBy = localStorage.getItem("allMasterId");
		postData.saveFlag = 1;
		postData.legalName = userDetail.legalName;
		delete postData.status;
		delete postData._id;
		mutate(postData);
		setDisable(false);
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.pbcontiner}>
				{notifySavedAddressList.length !== 0 && (
					<div className={styles.mainbox}>
						<div className={styles.titlediv}>
							<h1>Saved Notify Party</h1>
							<p>
								{notifySavedAddressList.length} - Notify Party
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
									{notifySavedAddressList
										.filter((e) =>
											e.companyName
												.toLowerCase()
												.includes(
													searchAndFilterValues.toLowerCase()
												)
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
export default NotifyParty;
