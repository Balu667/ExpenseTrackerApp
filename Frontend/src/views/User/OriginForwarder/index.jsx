import styles from "./index.module.css";
import { ReactComponent as Uploadicon } from "../../../assets/Icons/uploadicon.svg";
import AddressCard from "../../../components/AddressCard";
import Form from "react-bootstrap/Form";
import { useForm, Controller } from "react-hook-form";
import BookingFooter from "../../../components/BookingFooter/index";
import Loader from "../../../components/Loader/Loader";
import { originForwarderValidation } from "../../../validationSchema/originForwarderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import {
	convertFirstLettersAsUpperCase,
	fileReaderFunction,
	inputLengthRestriction,
	keyMatchLoop,
	openFileNewWindow,
	removeDuplicates,
} from "../../../helper";
import { useCountries } from "../../../hooks/country";
import {
	useCityData,
	useGetOFFileById,
	useInsertOrigin,
	useStateData,
} from "../../../hooks/originForwarder";
import { useNavigate, useParams, Navigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
	handleOriginFSaveFlag,
	insertShipperDetails,
} from "../../../redux/slices/checkoutSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";

function OriginForwarder({ originFList }) {
	const { shipperDetails, bookingId, ofSaveFlag, cargoDetails } = useSelector(
		(state) => state.checkoutDetails
	);
	const [gstFileValidate, setGstFileValidate] = useState(null);
	const [gstFile, setGstFile] = useState({
		gstPath: shipperDetails ? shipperDetails.gstPath : null,
		gstName: shipperDetails ? shipperDetails.gstName : null,
	});
	const [searchAndFilterValues, setSearchAndFilterValues] = useState("");
	const userDetail = useSelector((state) => state.profile.profileData);
	const [countryObject, setCountryObject] = useState({});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const mobileView = useMediaQuery("(max-width:765px)");
	const { scheduleId } = useParams();
	const {
		handleSubmit,
		control,
		watch,
		reset,
		setValue,
		formState: { isDirty, errors },
	} = useForm({
		resolver: yupResolver(originForwarderValidation),
		mode: "onTouched",
		defaultValues: {
			doorNo: shipperDetails ? shipperDetails.doorNo : "",
			building: shipperDetails ? shipperDetails.building : "",
			street: shipperDetails ? shipperDetails.street : "",
			area: shipperDetails ? shipperDetails.area : "",
			city: shipperDetails ? shipperDetails.city : "",
			state: shipperDetails ? shipperDetails.state : "",
			hblName: shipperDetails ? shipperDetails.hblName : "",
			name: shipperDetails ? shipperDetails.name : userDetail.fullName,
			pincode: shipperDetails ? shipperDetails.pincode : "",
			email: shipperDetails
				? shipperDetails.email.split("@")[0]
				: userDetail.email.split("@")[0],
			emailDomain: "",
			mobile: shipperDetails
				? shipperDetails.mobile.substring(3)
				: userDetail.mobileNumber,
			companyName: userDetail.legalName,
			saveFlag: shipperDetails ? shipperDetails.saveFlag : true,
		},
	});

	const onInsertSuccess = () => {
		navigate(`/user/booking/${scheduleId}#3`);
	};

	const {
		data: countryList,
		isLoading: countryLoading,
		isSuccess: countryListSuccess,
	} = useCountries();
	const { data: stateData } = useStateData();
	const { data: cityData } = useCityData(watch("state"));
	const { mutateAsync: filemutate, isLoading: isFileLoading } =
		useGetOFFileById();
	const { mutate, isLoading: insertOriginLoading } =
		useInsertOrigin(onInsertSuccess);

	useEffect(() => {
		if (countryListSuccess === true) {
			let countryData = countryList.filter(
				(e) => e.countryCode === "in"
			)[0];
			setCountryObject(countryData);
		}
	}, [countryListSuccess]);

	useEffect(() => {
		if (isDirty === true) {
			dispatch(handleOriginFSaveFlag(true));
			setValue("saveFlag", true);
		}
	}, [isDirty]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (countryLoading) {
		return <Loader />;
	}

	if (cargoDetails == null) {
		return <Navigate to="/user/dashboard" replace={true} />;
	}

	const handleClick = async (address) => {
		dispatch(handleOriginFSaveFlag(false));
		const resetData = { ...address };
		resetData.mobile = resetData.mobile.substring(3);
		resetData.emailFormat = userDetail.email.split("@")[1].toString();
		resetData.email = resetData.email.split("@")[0];
		resetData.saveFlag = false;
		reset({ ...resetData, hblName: "" });
		const fileData = await filemutate(address._id);
		setGstFileValidate(null);
		setGstFile({
			gstName: address.gstName,
			gstPath: fileData,
		});
	};

	const uploadHandler = (event) => {
		const errorMessage = {
			NoFileError: `Upload file first`,
			fileTypeErr: `Upload only Pdf`,
			fileSizeErr: `Upload file under 5 MB`,
		};
		fileReaderFunction({
			fileEvent: event,
			fileType: "pdf",
			fileSize: 1024 * 1024 * 5,
			errorMessage,
			fileRead: "readAsDataURL",
		})
			.then((data) => {
				setGstFileValidate("");
				setGstFile({
					gstName: data.fileName,
					gstPath: data.fileData,
				});
			})
			.catch((error) => {
				setGstFileValidate(error.message);
			});
	};

	const handleForm = (data) => {
		if (gstFile.gstPath === null) {
			return setGstFileValidate("Please Upload GST file");
		}
		let postData = { ...data };
		postData.country = countryList
			.filter((e) => e.countryCode === "in")
			.map((e) => e._id)
			.toString();
		postData.gstName = gstFile.gstName;
		postData.gstPath = gstFile.gstPath;
		postData.saveFlag = data.saveFlag ? 1 : 0;
		postData.status = 3;
		postData.mobile = `+91${data.mobile}`;
		postData.bookingId = bookingId;
		postData.legalName = userDetail.legalName;
		postData.email = data.email + "@" + userDetail.email.split("@")[1];
		delete postData._id;
		postData.createdBy = localStorage.getItem("allMasterId");
		dispatch(insertShipperDetails(postData));
		mutate(postData);
	};

	const removeFileHandler = () => {
		setGstFileValidate("Please Upload GST File");
		setGstFile({
			gstName: null,
			gstPath: null,
		});
	};

	const BackButton = () => {
		navigate(`/user/booking/${scheduleId}#1`);
	};
	const gstFileValidation = () => {
		if (gstFile.gstPath === null) {
			setGstFileValidate("Please Upload GST File");
		}
	};

	function returnFilteredArray(array) {
		let bid = bookingId;
		return array.filter(({ bookingId }) => bookingId !== bid);
	}
	const filteredArray = returnFilteredArray(originFList);

	const uniqueArray = removeDuplicates(filteredArray, "pincode");

	return (
		<Form onSubmit={handleSubmit(handleForm)}>
			<div className={`container ${styles.pbcontiner}`}>
				{uniqueArray.length !== 0 && (
					<div className={styles.mainbox}>
						<div className={styles.titlediv}>
							<h1>Saved Origin Forwarder</h1>
							<p>{uniqueArray.length} - Origin Forwarder Added</p>
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
									slidesPerView={mobileView ? 1 : 2.4}
									spaceBetween={10}
									navigation={true}
									modules={[Navigation]}
									className="mySwiper">
									{uniqueArray
										.filter(
											(e) =>
												e.city
													.toLowerCase()
													.includes(
														searchAndFilterValues.toLowerCase()
													) &&
												e.bookingId !== bookingId
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
														logistics={e.city}
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
				<div>
					<div className={styles.mainbox}>
						<div className={styles.titlediv}>
							<h1>Origin Forwarder Details</h1>
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
										htmlFor="Email">
										Email
										<span style={{ color: "red" }}>*</span>
									</Form.Label>
									<InputGroup>
										<Controller
											name="email"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="email"
													onChange={(value) => {
														field.onChange(value);
														if (value !== "") {
															setValue(
																"emailDomain",
																`@${
																	userDetail.email.split(
																		"@"
																	)[1]
																}`
															);
														}
													}}
													onKeyDown={(event) => {
														if (event.key === "@") {
															event.preventDefault();
														}
													}}
													className={`
														${styles.formcontrol} ${styles.emailtext}
														`}
													placeholder="Enter Email"
												/>
											)}
										/>
										<InputGroup.Text id="basic-addon2">
											@{userDetail.email.split("@")[1]}
										</InputGroup.Text>
									</InputGroup>
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

									<InputGroup>
										<InputGroup.Text
											id="basic-addon2"
											className={styles.countryCode}>
											+91
										</InputGroup.Text>
										<Controller
											name="mobile"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="mobile"
													maxLength={10}
													onChange={(event) =>
														field.onChange(
															event.target.value.replace(
																/[^\d]+/g,
																""
															)
														)
													}
													className={`${styles.formcontrol} ${styles.number}`}
													placeholder="Enter Mobile Number"
												/>
											)}
										/>
									</InputGroup>
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
									</Form.Label>
									<Controller
										name="companyName"
										control={control}
										render={({ field }) => (
											<Form.Control
												{...field}
												type="text"
												id="companyName"
												style={{
													textTransform: "capitalize",
												}}
												className={styles.formcontrol}
												disabled={true}
												placeholder="Enter legalName"
											/>
										)}
									/>
								</Form.Group>
							</div>
						</div>
					</div>

					<div className={styles.addressdiv}>
						<div className={styles.titlediv}>
							<h1>Origin Forwarder Address</h1>
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
												type="text"
												{...field}
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
												type="text"
												{...field}
												id="street"
												className={styles.formcontrol}
												placeholder="Enter Street "
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
												disabled={true}
												className={styles.formcontrol}
												value={countryObject._id}>
												<option
													key={countryObject._id}
													value={countryObject._id}>
													{countryObject.countryName &&
														convertFirstLettersAsUpperCase(
															countryObject.countryName
														)}
												</option>
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
											<Form.Select
												{...field}
												id="state"
												className={styles.formcontrol}>
												<option value={""}>
													Choose State
												</option>

												{stateData?.map((e, index) => {
													return (
														<option
															key={index}
															value={e}>
															{convertFirstLettersAsUpperCase(
																e
															)}
														</option>
													);
												})}
											</Form.Select>
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
										htmlFor="City">
										City
										<span style={{ color: "red" }}>*</span>
									</Form.Label>
									<Controller
										name="city"
										control={control}
										render={({ field }) => (
											<Form.Select
												{...field}
												id="city"
												className={styles.formcontrol}>
												<option value={""}>
													Choose City
												</option>
												{cityData?.map((e, index) => {
													return (
														<option
															key={index}
															value={e}>
															{convertFirstLettersAsUpperCase(
																e
															)}
														</option>
													);
												})}
											</Form.Select>
										)}
									/>
									{errors.city && (
										<span className="error">
											{errors.city.message}
										</span>
									)}
								</Form.Group>
								<Form.Group className={styles.city}>
									<Form.Label
										className={styles.labels}
										htmlFor="pincode">
										Pincode
										<span style={{ color: "red" }}>*</span>
									</Form.Label>
									<Controller
										name="pincode"
										control={control}
										render={({ field }) => (
											<Form.Control
												{...field}
												type="text"
												id="pincode"
												className={styles.formcontrol}
												placeholder="Enter pincode"
												onInput={(event) =>
													inputLengthRestriction(
														event,
														6
													)
												}
											/>
										)}
									/>
									{errors.pincode && (
										<span className="error">
											{errors.pincode.message}
										</span>
									)}
								</Form.Group>
							</div>
							{gstFile.gstPath === null && (
								<div className={styles.fileuploaddiv}>
									<div className={styles.uploadflex}>
										<Uploadicon />
										<div className={styles.uploadtxt}>
											<h4>
												Upload GST Certificate
												<span style={{ color: "red" }}>
													*
												</span>
											</h4>
											<p>
												PDF (Recommended) Upto 5MB
												Allowed
											</p>
										</div>
									</div>
									<div className={styles.uploadflex}>
										{isFileLoading ? (
											<CircularProgress size={20} />
										) : (
											<>
												<input
													type="file"
													id="Packaging"
													className={styles.hidden}
													onChange={uploadHandler}
												/>
												<label
													htmlFor="Packaging"
													className={
														styles.uploadfiles
													}>
													Upload File
												</label>
											</>
										)}
									</div>
								</div>
							)}
							<p className="errormsg">{gstFileValidate}</p>
							{gstFile.gstPath !== null && (
								<div className={styles.fileuploaddiv}>
									<div className={styles.uploadflex}>
										<Uploadicon />
										<div className={styles.uploadtxt}>
											<h4>Uploaded GST Certificate</h4>
											<p>
												PDF (Recommended) Upto 5MB
												Allowed
											</p>
										</div>
									</div>
									<div className={styles.uploadedflex}>
										<p
											onClick={() =>
												openFileNewWindow(
													gstFile.gstPath
												)
											}
											className={styles.filename}>
											{gstFile.gstName}
										</p>
										<button
											htmlFor="Packaging"
											type="button"
											onClick={() => removeFileHandler()}
											className={styles.removeButton}>
											Remove
										</button>
									</div>
								</div>
							)}
							{ofSaveFlag && (
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
								</div>
							)}
							<Form.Group className={styles.hbl}>
								<Form.Label
									className={styles.labels}
									htmlFor="hblName">
									Actual Shipper Name
									<span className={styles.spanlabel}>
										(as per HBL)
									</span>
									<span style={{ color: "red" }}>*</span>
								</Form.Label>
								<Controller
									name="hblName"
									control={control}
									render={({ field }) => (
										<Form.Control
											type="text"
											{...field}
											id="hblName"
											className={styles.formcontrol}
											placeholder="Enter Shipper Name"
										/>
									)}
								/>
								{errors.hblName && (
									<span className="error">
										{errors.hblName.message}
									</span>
								)}
							</Form.Group>
						</div>
					</div>
				</div>
			</div>
			<BookingFooter
				mutateState={insertOriginLoading}
				onBackClick={BackButton}
				gstFile={gstFile}
				gstFileValidate={gstFileValidate}
				gstFileValidation={gstFileValidation}
			/>
		</Form>
	);
}
export default OriginForwarder;
