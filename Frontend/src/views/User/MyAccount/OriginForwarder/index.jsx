import styles from "./index.module.css";
import { ReactComponent as Uploadicon } from "../../../../assets/Icons/uploadicon.svg";
import AddressCard from "../../../../components/AddressCard";
import Form from "react-bootstrap/Form";
import { useForm, Controller } from "react-hook-form";
import Loader from "../../../../components/Loader/Loader";
import { originForwarderValidation } from "../../../../validationSchema/ofValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
	convertFirstLettersAsUpperCase,
	fileReaderFunction,
	inputLengthRestriction,
	keyMatchLoop,
	openFileNewWindow,
	removeDuplicates,
} from "../../../../helper";
import { useCountries } from "../../../../hooks/country";

import {
	useCityData,
	useGetOFFileById,
	useInsertOrigin,
	useStateData,
} from "../../../../hooks/originForwarder";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";

function OriginForwarder({ originFList, show }) {
	const [gstFileValidate, setGstFileValidate] = useState(null);
	const mobileView = useMediaQuery("(max-width:765px)");
	const [gstFile, setGstFile] = useState({
		gstPath: null,
		gstName: null,
	});

	const [disable, setDisable] = useState(false);

	const [searchAndFilterValues, setSearchAndFilterValues] = useState("");

	const userDetail = useSelector((state) => state.profile.profileData);

	const [countryObject, setCountryObject] = useState({});

	const {
		handleSubmit,
		control,
		watch,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(originForwarderValidation),
		mode: "onTouched",
		defaultValues: {
			doorNo: "",
			building: "",
			street: "",
			area: "",
			city: "",
			state: "",
			hblName: "",
			pincode: "",
		},
	});

	const onInsertSuccess = (data) => {
		toast.success(data);
	};

	const { data: stateData } = useStateData();

	const { data: cityData } = useCityData(watch("state"));

	const {
		data: countryList,
		isLoading: countryLoading,
		isSuccess: countryListSuccess,
	} = useCountries();

	const { mutateAsync: filemutate, isLoading: isFileLoading } =
		useGetOFFileById();

	const { mutate } = useInsertOrigin(onInsertSuccess);

	useEffect(() => {
		if (countryListSuccess === true) {
			let countryData = countryList.filter(
				(e) => e.countryCode === "in"
			)[0];
			setCountryObject(countryData);
		}
	}, [countryListSuccess]);

	if (countryLoading) {
		return <Loader />;
	}

	const handleClick = async (address) => {
		setDisable(true);
		const resetData = { ...address };
		reset(resetData);
		const fileData = await filemutate(address._id);
		setGstFile({
			gstName: address.gstName,
			gstPath: fileData,
		});
		setGstFileValidate("");
	};

	const uploadHandler = (event) => {
		let errorMessage = {
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
			return setGstFileValidate("Please upload GST file");
		}
		let postData = { ...data };
		postData.country = countryList
			.filter((e) => e.countryCode === "in")
			.map((e) => e._id)
			.toString();
		postData.gstName = gstFile.gstName;
		postData.gstPath = gstFile.gstPath;
		postData.saveFlag = 1;
		postData.legalName = userDetail.legalName;
		delete postData.status;
		delete postData._id;
		postData.createdBy = localStorage.getItem("allMasterId");
		mutate(postData);
		setDisable(false);
	};

	const removeFileHandler = () => {
		setGstFileValidate("Please Upload GST File");
		setGstFile({
			gstName: null,
			gstPath: null,
		});
	};

	const gstFileValidation = () => {
		if (gstFile.gstPath === null) {
			setGstFileValidate("Please Upload GST File");
		}
	};

	const uniqueArray = removeDuplicates(originFList, "pincode");

	return (
		<Form onSubmit={handleSubmit(handleForm)}>
			<div className={styles.pbcontiner}>
				{uniqueArray.length > 0 && (
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
									slidesPerView={mobileView ? 1 : 2.5}
									spaceBetween={10}
									navigation={true}
									modules={[Navigation]}
									className="mySwiper">
									{uniqueArray
										.filter((e) =>
											e.city
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
					{disable && (
						<div className={styles.addressdiv}>
							<div className={styles.titlediv}>
								<h1>Address</h1>
								<p className={styles.fill}>
									Fill in your details
								</p>
							</div>
							<div className={styles.contentdiv}>
								<div className={styles.formdiv}>
									<Form.Group className={styles.doordiv}>
										<Form.Label
											className={styles.labels}
											htmlFor="doorNo">
											Door No.
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="doorNo"
											control={control}
											render={({ field }) => (
												<Form.Control
													type="text"
													{...field}
													id="doorNo"
													className={
														styles.formcontrol
													}
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
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="building"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="building"
													className={
														styles.formcontrol
													}
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
											Street{" "}
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="street"
											control={control}
											render={({ field }) => (
												<Form.Control
													type="text"
													{...field}
													id="street"
													className={
														styles.formcontrol
													}
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
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="area"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="area"
													className={
														styles.formcontrol
													}
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
											Country{" "}
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="country"
											control={control}
											render={({ field }) => (
												<Form.Select
													{...field}
													id="country"
													disabled={true}
													className={
														styles.formcontrol
													}
													value={countryObject._id}>
													<option
														key={countryObject._id}
														value={
															countryObject._id
														}>
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
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="state"
											control={control}
											render={({ field }) => (
												<Form.Select
													{...field}
													id="state"
													onChange={(event) => {
														field.onChange(
															event.target.value
														);
														setValue("city", "");
													}}
													className={
														styles.formcontrol
													}>
													<option value={""}>
														Choose State
													</option>

													{stateData?.map(
														(e, index) => {
															return (
																<option
																	key={index}
																	value={e}>
																	{convertFirstLettersAsUpperCase(
																		e
																	)}
																</option>
															);
														}
													)}
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
											htmlFor="city">
											City
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="city"
											control={control}
											render={({ field }) => (
												<Form.Select
													{...field}
													id="city"
													className={
														styles.formcontrol
													}>
													<option value={""}>
														Choose City
													</option>

													{cityData?.map(
														(e, index) => {
															return (
																<option
																	key={index}
																	value={e}>
																	{convertFirstLettersAsUpperCase(
																		e
																	)}
																</option>
															);
														}
													)}
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
											<span style={{ color: "red" }}>
												*
											</span>
										</Form.Label>
										<Controller
											name="pincode"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="pincode"
													className={
														styles.formcontrol
													}
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
													Upload GST Certificate{" "}
													<span
														style={{
															color: "red",
														}}>
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
														className={
															styles.hidden
														}
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
												<h4>
													Uploaded GST Certificate
												</h4>
												<p>
													PDF (Recommended) Upto 5MB
													Allowed
												</p>
											</div>
										</div>
										<div className={styles.uploadedflex}>
											<p
												onClick={async () => {
													openFileNewWindow(
														gstFile.gstPath
													);
												}}
												className={styles.filename}>
												{gstFile.gstName}
											</p>
											<button
												htmlFor="Packaging"
												type="button"
												onClick={() =>
													removeFileHandler()
												}
												className={styles.removeButton}>
												Remove
											</button>
										</div>
									</div>
								)}

								<div className={styles.saveButton}>
									<button
										className={styles.closebtn}
										onClick={() => {
											setDisable(!disable);
											setGstFileValidate("");
										}}>
										Close
									</button>
									<button
										type="submit"
										className={styles.continuebtn}
										onClick={() => gstFileValidation()}>
										Save Changes
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Form>
	);
}
export default OriginForwarder;
