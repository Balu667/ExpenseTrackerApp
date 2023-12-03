import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	origincfsValidation,
	DestinationcfsValidation,
} from "../../../../validationSchema/cfsValidation";
import {
	originEditcfsValidation,
	DestinationEditcfsValidation,
} from "../../../../validationSchema/cfseditValidation";
import {
	useInsertCfs,
	useMutateCfs,
	getCfsTeamDetails,
} from "../../../../hooks/cfsManagement";
import { toast } from "react-toastify";
import { ReactComponent as Uploadicon } from "../../../../assets/Images/Uploadicon.svg";
import { useEffect, useState } from "react";
import { fileReaderFunction, openFileNewWindow } from "../../../../helper";
import {
	openCommonPopup,
	closeCommonPopup,
} from "../../../../redux/slices/commonPopupSlice";
import CommonPopup from "../../../../components/CommonPopup";
import { useDispatch } from "react-redux";
import { ReactComponent as CloseIcon } from "../../../../assets/Icons/closeIcon.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "../../../../components/Loader/Loader";
import styles from "./index.module.css";

function AddAndEditCountry({
	onCloseButtonClick,
	isEdit,
	editData,
	lane,
	country,
}) {
	const createdBy = localStorage.getItem("allMasterId");

	const [uploadFile, setUploadFile] = useState([]);

	const {
		data: cfsDetail,
		isLoading,
		isSuccess,
	} = getCfsTeamDetails(editData?._id);

	useEffect(() => {
		if (isSuccess) {
			let cfsCertificateArray = cfsDetail?.cfsCertificate
				? cfsDetail.cfsCertificate.map(({ fileName, filePath }) => {
						return { fileName, fileData: filePath };
				  })
				: [];
			setUploadFile(cfsCertificateArray);
		}
	}, [isSuccess]);

	const [sendData, setSendData] = useState(null);
	const dispatch = useDispatch();
	const titleText = isEdit ? "Update CFS Info?" : "Add CFS";
	const contentText = isEdit
		? "Are you sure that you want to update CFS"
		: "Are you sure that you want to Add CFS";

	const handlePopup = (data) => {
		setSendData(data);
		dispatch(openCommonPopup());
	};

	const {
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
		control,
	} = useForm({
		resolver: async (data, context, options) => {
			if (isEdit) {
				if (data.type === "1") {
					return yupResolver(originEditcfsValidation)(
						data,
						context,
						options
					);
				} else {
					return yupResolver(DestinationEditcfsValidation)(
						data,
						context,
						options
					);
				}
			} else {
				if (data.type === "1") {
					return yupResolver(origincfsValidation)(
						data,
						context,
						options
					);
				} else {
					return yupResolver(DestinationcfsValidation)(
						data,
						context,
						options
					);
				}
			}
		},
		mode: "onTouched",
		defaultValues: {
			countryName: isEdit ? editData.countryName : "",
			type: isEdit ? editData.type.toString() : "",
			gateway: isEdit ? editData.gateway : "",
			destination: isEdit ? editData.destination : "",
			cfsName: isEdit ? editData.cfsName : "",
			cfsBranch: isEdit ? editData.cfsBranch : "",
			fullName: isEdit ? editData.fullName : "",
			email: isEdit ? editData.email : "",
			address: isEdit ? editData.address : "",
			mobileNo: isEdit ? editData.mobileNo : "+",
			freeDays: isEdit ? editData?.freeDays ?? "" : "",
			cfsCertificate: isEdit ? editData.cfsCertificate : "",
			phoneNumberCode: isEdit
				? country.find((e) => e._id === editData.countryName).phCode
				: "",
			phoneNumberLength: isEdit
				? country.find((e) => e._id === editData.countryName)
						.phNumberFormat
				: "",
		},
	});

	const onSuccessFunctions = (response) => {
		toast.success(response);
		if (!isEdit) {
			reset();
		}
		onCloseButtonClick();
	};
	const watchFields = watch();
	const { mutate, isLoading: cfsIsLoading } = isEdit
		? useMutateCfs(onSuccessFunctions)
		: useInsertCfs(onSuccessFunctions);

	const onSubmit = () => {
		dispatch(closeCommonPopup());
		if (sendData.type === "1") {
			sendData.destination = "N/A";
		}
		if (sendData.type === "2") {
			sendData.gateway = "N/A";
		}
		if (isEdit) {
			sendData.id = editData._id;
			sendData.status = editData.status;
		}
		sendData.cfsCertificate = uploadFile;
		sendData.createdBy = createdBy;
		mutate(sendData);
	};

	const uploadMultipleFileFunction = async (event) => {
		const errorMessage = {
			NoFileError: `Upload file first`,
			fileTypeErr: `Upload only Pdf`,
			fileSizeErr: "Please upload file",
		};
		try {
			let fileDataArray = await fileReaderFunction({
				fileEvent: event,
				errorMessage,
				fileType: "pdf",
				noLimit: true,
			});
			if (fileDataArray.length > 0) {
				fileDataArray = fileDataArray.map(({ fileName, fileData }) => {
					return { fileName, fileData };
				});
				setUploadFile([...uploadFile, ...fileDataArray]);
			} else {
				setUploadFile([...uploadFile, fileDataArray]);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			event.target.value = "";
		}
	};

	const removeFileHandler = (array, index) => {
		setUploadFile(array.filter((file, i) => i !== index));
	};

	if (cfsIsLoading || (isEdit && isLoading)) {
		return <Loader />;
	}

	return (
		<div className={styles.adddiv}>
			<div className={styles.adddivheading}>
				<h3>{isEdit ? "Edit CFS Management" : "Add CFS Management"}</h3>
				<CloseIcon
					type="button"
					onClick={() => onCloseButtonClick()}
					style={{ cursor: "pointer" }}
				/>
			</div>
			<Form onSubmit={handleSubmit(handlePopup)}>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="countryName" className="formlabel">
						Country
					</Form.Label>
					<Controller
						name="countryName"
						control={control}
						render={({ field }) => (
							<Form.Select
								style={{ textTransform: "capitalize" }}
								{...field}
								id="country"
								onChange={(value) => {
									field.onChange(value);
									if (value !== "") {
										const countryData = country.find(
											(e) => e._id === value.target.value
										);
										setValue(
											"phoneNumberCode",
											countryData.phCode
										);
										setValue(
											"phoneNumberLength",
											countryData.phNumberFormat
										);
									}
								}}
								className={styles.formcontrol}>
								<option value={""} hidden>
									Choose Country
								</option>
								{country.map((e, i) => {
									return (
										<option value={e._id} key={e._id}>
											{e.countryName}
										</option>
									);
								})}
							</Form.Select>
						)}
					/>
					{errors.countryName && (
						<span className="error">
							{errors.countryName.message}
						</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="type" className="formlabel">
						Type
					</Form.Label>
					<Controller
						name="type"
						control={control}
						render={({ field }) => (
							<Form.Select
								{...field}
								id="type"
								disabled={isEdit}
								className={styles.formcontrol}>
								<option value={""} hidden>
									Choose Type
								</option>
								<option value={"1"}>Origin CFS</option>
								<option value={"2"}>Destination CFS</option>
							</Form.Select>
						)}
					/>
					{errors.type && (
						<span className="error">{errors.type.message}</span>
					)}
				</Form.Group>
				{watchFields.type === "1" && (
					<Form.Group className="pt-2">
						<Form.Label htmlFor="Region" className="formlabel">
							Gateway
						</Form.Label>
						<Controller
							name="gateway"
							control={control}
							render={({ field }) => (
								<Form.Select
									className={`formcontrol ${styles.cfsdropdown}`}
									{...field}
									id="gateway"
									disabled={isEdit}>
									<option hidden value={""}>
										Choose Type
									</option>
									{lane
										.filter(
											(e) =>
												e.type === 1 &&
												e.status === 1 &&
												e.country ===
													watchFields.countryName
										)
										.map((e, i) => {
											return (
												<option
													value={e._id}
													key={e._id}>
													{e.portName}
												</option>
											);
										})}
								</Form.Select>
							)}
						/>
						{errors.gateway && (
							<span className="error">
								{errors.gateway.message}
							</span>
						)}
					</Form.Group>
				)}
				{watchFields.type === "2" && (
					<>
						<Form.Group className="pt-2">
							<Form.Label
								htmlFor="destination"
								className="formlabel">
								Destination
							</Form.Label>
							<Controller
								name="destination"
								control={control}
								render={({ field }) => (
									<Form.Select
										className={`formcontrol ${styles.cfsdropdown}`}
										{...field}
										id="destination"
										disabled={isEdit}>
										<option value={""} hidden>
											Choose Type
										</option>
										{lane
											.filter(
												(e) =>
													e.type === 2 &&
													e.status === 1 &&
													e.country ===
														watchFields.countryName
											)
											.map((e, i) => {
												return (
													<option
														value={e._id}
														key={e._id}>
														{e.portName}
													</option>
												);
											})}
									</Form.Select>
								)}
							/>
							{errors.destination && (
								<span className="error">
									{errors.destination.message}
								</span>
							)}
						</Form.Group>
						<Form.Group className="pt-2">
							<Form.Label
								htmlFor="freeDays"
								className="formlabel">
								CFS Storage Free Days
							</Form.Label>
							<Controller
								name="freeDays"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="number"
										placeholder="Enter Storage Free days"
									/>
								)}
							/>
							{errors.freeDays && (
								<span className="error">
									{errors.freeDays.message}
								</span>
							)}
						</Form.Group>
					</>
				)}
				<div className="d-flex gap-2">
					<Form.Group className="pt-2">
						<Form.Label htmlFor="Currency" className="formlabel">
							CFS Name
						</Form.Label>
						<Controller
							name="cfsName"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="cfsName"
									className={styles.formcontrol}
									placeholder="Enter CFS Name"
								/>
							)}
						/>
						{errors.cfsName && (
							<span className="error">
								{errors.cfsName.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="ExchangeRate"
							className="formlabel">
							CFS Branch Name
						</Form.Label>
						<Controller
							name="cfsBranch"
							control={control}
							render={({ field }) => (
								<Form.Control
									type="text"
									{...field}
									id="cfsBranch"
									className={styles.formcontrol}
									placeholder="Enter CFS Branch Name"
								/>
							)}
						/>
						{errors.cfsBranch && (
							<span className="error">
								{errors.cfsBranch.message}
							</span>
						)}
					</Form.Group>
				</div>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="phonecode" className="formlabel">
						Full Name
					</Form.Label>
					<Controller
						name="fullName"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="fullName"
								className={styles.formcontrol}
								placeholder="Enter Full Name"
							/>
						)}
					/>
					{errors.fullName && (
						<span className="error">{errors.fullName.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="numberFormat" className="formlabel">
						Email Address
					</Form.Label>
					<Controller
						name="email"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="email"
								disabled={isEdit}
								className={styles.formcontrol}
								placeholder="Enter Email Address"
							/>
						)}
					/>
					{errors.email && (
						<span className="error">{errors.email.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="numberFormat" className="formlabel">
						Address
					</Form.Label>
					<Controller
						name="address"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="address"
								className={styles.formcontrol}
								placeholder="Enter Address"
							/>
						)}
					/>
					{errors.address && (
						<span className="error">{errors.address.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="numberFormat" className="formlabel">
						Mobile Number
					</Form.Label>
					<Controller
						name="mobileNo"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="numberFormat"
								className={styles.formcontrol}
								placeholder="Enter Mobile Number"
								maxLength={
									watchFields.phoneNumberCode.length +
									watchFields.phoneNumberLength.length
								}
							/>
						)}
					/>
					{errors.mobileNo && (
						<span className="error">{errors.mobileNo.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="Certificate" className="formlabel">
						CFS Certificate
					</Form.Label>
					<Form.Label
						htmlFor="fileupload"
						className={`formlabel ${styles.uploadlabel}`}>
						<Uploadicon /> Upload
					</Form.Label>
					<input
						type="file"
						className={styles.hidden}
						id="fileupload"
						multiple
						onChange={(event) => uploadMultipleFileFunction(event)}
					/>
					{uploadFile.map((e, i) => {
						return (
							<div className={styles.filecontainer} key={i}>
								<p
									onClick={() =>
										openFileNewWindow(e.fileData)
									}
									className={styles.filename}>
									{e.fileName}
								</p>
								<div>
									<DeleteIcon
										sx={{
											cursor: "pointer",
											color: "red",
										}}
										onClick={() =>
											removeFileHandler(uploadFile, i)
										}
									/>
								</div>
							</div>
						);
					})}
				</Form.Group>
				<div className="pt-3 pb-3">
					<button
						type="submit"
						className={styles.savebtn}
						disabled={cfsIsLoading}>
						Save CFS
					</button>
				</div>
			</Form>
			<div>
				<CommonPopup
					handleAgree={onSubmit}
					titleText={titleText}
					contentText={contentText}
				/>
			</div>
		</div>
	);
}

export default AddAndEditCountry;
