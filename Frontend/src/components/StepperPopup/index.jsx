import { useState } from "react";
import styles from "./index.module.css";
import { ReactComponent as Uploadicon } from "../../assets/Icons/uploadicon.svg";
import { AiOutlineClose } from "react-icons/ai";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";
import { convertIntoCm, fileReaderFunction } from "../../helper";
import FileView from "../Fileview";
import {
	Dialog,
	CircularProgress,
	Switch,
	FormGroup,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import moment from "moment";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import DimensionAmendment from "../DimensionAmendment";

export default function StepperPopup({
	confirmOnClick,
	handleClose,
	modalOpen,
	titleText,
	register,
	handleSubmit,
	fileData,
	currentMilestone,
	errors,
	setFileData,
	mutateLoading,
	skipOnClick,
	control,
	cargoDetails,
	cargoType,
	fields,
	reset,
	setValue,
	watchFields,
}) {
	const [fileError, setFileError] = useState("");
	const [amendementSwitch, setAmendmentSwitch] = useState(false);
	const [checkbox, setCheckbox] = useState(true);

	function uploadHandler(event) {
		const errorMessage = {
			NoFileError: "Please Upload file",
			fileTypeErr: "Upload only PDF",
			fileSizeErr: "File size should not be more than 5 MB",
		};
		fileReaderFunction({
			fileEvent: event,
			fileType: "pdf",
			fileSize: 1024 * 1024 * 5,
			errorMessage,
			fileRead: "readAsDataURL",
		})
			.then((fileObject) => {
				setFileError("");
				if (fileObject.length > 0) {
					let files = fileObject.map((file) => {
						return {
							fileName: file.fileName,
							filePath: file.fileData,
						};
					});
					setFileData(files);
				} else {
					if (currentMilestone.currentStep === "msams09") {
						setFileData([
							{
								fileName: fileObject.fileName,
								filePath: fileObject.fileData,
							},
						]);
					} else {
						setFileData({
							fileName: fileObject.fileName,
							filePath: fileObject.fileData,
						});
					}
				}
			})
			.catch((error) => {
				setFileError(error.message);
			});
	}

	function checkFileNotNeededSteps(currentStep) {
		return (
			currentStep !== "msams03" &&
			currentStep !== "msams17" &&
			currentStep !== "msams18" &&
			currentStep !== "msams20" &&
			currentStep !== "msams22"
		);
	}

	function totalCbmCalculation(dimensionArray) {
		let volume = 0;
		let gross = 0;
		const length = dimensionArray.map(({ length, metric }) =>
			convertIntoCm(length, metric)
		);

		const breadth = dimensionArray.map(({ breadth, metric }) =>
			convertIntoCm(breadth, metric)
		);

		const height = dimensionArray.map(({ height, metric }) =>
			convertIntoCm(height, metric)
		);

		const radius = dimensionArray.map(({ radius, metric }) =>
			convertIntoCm(radius, metric)
		);

		const numberofPackages = dimensionArray.map(
			({ noOfPackage }) => noOfPackage
		);

		const WeightofPackages = dimensionArray.map(
			({ weightPerPackage }) => weightPerPackage
		);

		for (let index = 0; index < dimensionArray.length; index++) {
			const type = dimensionArray[index].packageType;
			if (type === "barrels" || type === "rolls") {
				if (dimensionArray[index].weightPerPackage.length > 0) {
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
				if (dimensionArray[index].weightPerPackage.length > 0) {
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

		volume = gross / 1000 > volume ? gross / 1000 : volume;

		return { volume, gross };
	}

	function onSubmit(fieldData) {
		if (checkbox === false && currentMilestone?.currentStep === "msams12") {
			return false;
		}
		if (
			fileData === null &&
			checkFileNotNeededSteps(currentMilestone?.currentStep) &&
			currentMilestone?.currentStep !== "msams12"
		) {
			setFileError("Please Upload File");
		} else {
			setFileError("");
			if (currentMilestone?.currentStep === "msams20") {
				delete fieldData.cargoDetails;
				fieldData.cargoDeliveryDate = moment(
					fieldData.cargoDeliveryDate
				).format("DD-MM-YYYY");
			}
			if (
				currentMilestone?.currentStep === "msams04" &&
				amendementSwitch === true
			) {
				const { volume, gross } = totalCbmCalculation(
					fieldData.cargoDetails
				);
				fieldData.cargoDetails = fieldData.cargoDetails.map(
					(dimension) => ({
						...dimension,
						weight:
							dimension.weightPerPackage * dimension.noOfPackage,
					})
				);
				fieldData.cargoType = cargoType;
				fieldData.volume = volume;
				fieldData.totalWt = gross;
			}
			if (
				currentMilestone?.currentStep === "msams04" &&
				amendementSwitch === false
			) {
				fieldData = null;
			}
			if (currentMilestone?.currentStep === "msams22") {
				delete fieldData.cargoDetails;
				fieldData.cargoGatewayDate = moment(
					fieldData.cargoGatewayDate
				).format("YYYY-MM-DD HH:mm");
			}
			confirmOnClick(fileData, fieldData);
		}
	}

	const deleteAllFiles = (name) => {
		const fileArray = fileData.filter((file) => file.fileName !== name);
		if (fileArray.length === 0) {
			setFileData(null);
		} else {
			setFileData(fileArray);
		}
	};

	const deleteSingleFile = () => {
		setFileData(null);
	};

	const validateShippingBill = (value) => {
		const trimmedValue = value.trim();
		if (!trimmedValue) {
			return "Enter valid Shipping Bill Number";
		}
		return true;
	};

	return (
		<Dialog
			open={modalOpen}
			fullWidth
			maxWidth="xs"
			onClose={() => {
				handleClose();
				setFileError("");
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<div className={styles.popupdiv}>
				<div className={styles.headdiv}>
					<h1>{titleText}</h1>
					<button
						className={styles.closebtn}
						onClick={() => {
							handleClose();
							setFileError("");
						}}>
						<AiOutlineClose />
					</button>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					{currentMilestone?.currentStep === "msams04" && (
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										checked={amendementSwitch}
										onChange={(event) =>
											setAmendmentSwitch(
												event.target.checked
											)
										}
									/>
								}
								label="Has Dimension Deviations?"
								labelPlacement="start"
							/>
						</FormGroup>
					)}

					{currentMilestone?.currentStep === "msams04" &&
						amendementSwitch && (
							<DimensionAmendment
								cargoDetails={cargoDetails}
								cargoType={cargoType}
								reset={reset}
								control={control}
								errors={errors}
								fields={fields}
								setValue={setValue}
								watchFields={watchFields}
							/>
						)}
					{currentMilestone?.currentStep === "msams09" && (
						<div>
							<label htmlFor="bill" className={styles.label}>
								Shipping Bill
							</label>
							<input
								type="text"
								id="bill"
								placeholder="Enter Shipping Bill"
								{...register("shippingBillNo", {
									required: "Shipping Bill is Required",
									validate: validateShippingBill,
								})}
								className={styles.shippingpill}
							/>
							{errors.shippingBillNo && (
								<p className="error">
									{errors.shippingBillNo.message}
								</p>
							)}
							<label htmlFor="date" className={styles.label}>
								Shipping Date
							</label>
							<Controller
								name="shippingBillDate"
								rules={{
									required: "Shipping Bill Date is Required",
								}}
								control={control}
								render={({ field }) => (
									<DatePicker
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										format="DD-MM-YYYY"
										disablePast
										{...field}
										className={styles.shippingpill}
									/>
								)}
							/>
							{errors.shippingBillDate && (
								<p className="error">
									{errors.shippingBillDate.message}
								</p>
							)}
						</div>
					)}

					{currentMilestone?.currentStep === "msams20" && (
						<div>
							<label htmlFor="">
								Cargo Available for Delivery Date
							</label>
							<Controller
								name="cargoDeliveryDate"
								control={control}
								rules={{
									required: "Cargo Delivery Date is Required",
								}}
								render={({ field }) => (
									<DatePicker
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										format="DD-MM-YYYY"
										disablePast
										{...field}
										onChange={(e) => field.onChange(e)}
									/>
								)}
							/>
							{errors.cargoDeliveryDate && (
								<p className="error">
									{errors.cargoDeliveryDate.message}
								</p>
							)}
						</div>
					)}
					{currentMilestone?.currentStep === "msams22" && (
						<div>
							<label htmlFor="">
								Cargo Gateway Out confirmed
							</label>
							<Controller
								name="cargoGatewayDate"
								rules={{
									required: "Date and Time is Required",
								}}
								control={control}
								render={({ field }) => (
									<MobileDateTimePicker
										ampm={false}
										sx={{
											width: "100%",
										}}
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										format="DD-MM-YYYY HH:MM"
										{...field}
										onChange={(e) => field.onChange(e)}
										disablePast
									/>
								)}
							/>
							{errors.cargoGatewayDate && (
								<p className="error">
									{errors.cargoGatewayDate.message}
								</p>
							)}
						</div>
					)}
					{checkFileNotNeededSteps(currentMilestone?.currentStep) &&
						modalOpen && (
							<div className={styles.filediv}>
								{fileData === null || fileData.length === 0 ? (
									<>
										<input
											multiple={
												currentMilestone?.currentStep ===
												"msams09"
											}
											type="file"
											id="file"
											onChange={uploadHandler}
											className={styles.fileinput}
										/>
										<label
											className={styles.upload}
											htmlFor="file">
											<Uploadicon
												className={styles.uploadicon}
											/>
											Upload{" "}
											{currentMilestone?.currentStep ===
												"msams12" && "(Optional)"}
										</label>
									</>
								) : (
									<FileView
										fileData={fileData}
										deleteOnClick={
											fileData.length > 0
												? (name) => deleteAllFiles(name)
												: () => deleteSingleFile()
										}
									/>
								)}
								<p className="error">{fileError}</p>
							</div>
						)}

					{currentMilestone?.currentStep === "msams12" && (
						<>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									gap: "4px",
									marginTop: "10px",
									alignItems: "center",
								}}>
								<Checkbox
									size="small"
									checked={checkbox}
									onChange={(e) =>
										setCheckbox(e.target.checked)
									}
									style={{
										marginLeft: "4px",
										color: "#f3cf00",
									}}
								/>
								<a
									target="__blank"
									className={styles.terms}
									href={"/user/termsconditons"}
									style={{ textDecoration: "none" }}>
									Terms & Conditions
								</a>
							</div>
							{!checkbox && (
								<p style={{ color: "red" }}>
									You must accept the terms and conditions
								</p>
							)}
						</>
					)}
					<div>
						<button type="submit" className={styles.confirmbtn}>
							{mutateLoading ? (
								<CircularProgress size={20} />
							) : (
								"Confirm"
							)}
						</button>
						{currentMilestone?.currentStep === "msams05" && (
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									skipOnClick();
								}}
								className={styles.confirmbtn}>
								{mutateLoading ? (
									<CircularProgress size={20} />
								) : (
									"Skip"
								)}
							</button>
						)}
					</div>
				</form>
			</div>
		</Dialog>
	);
}
