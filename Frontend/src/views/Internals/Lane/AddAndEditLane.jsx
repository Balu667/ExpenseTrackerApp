import { useState } from "react";
import { useDispatch } from "react-redux";
import { InputGroup, Form } from "react-bootstrap";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import { useInsertLane, useUpdateLane } from "../../../hooks/lane";
import { toast } from "react-toastify";
import { laneValidation } from "../../../validationSchema/laneValidation";
import Popup from "../../../components/ConfirmationPopup";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import classes from "./index.module.css";

const AddAndEditLane = ({ setPopup, type, countries, laneData }) => {
	let activeCountries = countries.filter((country) => country.status === 1);

	const createdBy = localStorage.getItem("allMasterId");

	const [alignment, setAlignment] = useState("left");

	const [sendData, setSendData] = useState(null);

	const handleAlignment = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	const dispatch = useDispatch();

	const titleText = type === "insert" ? "Add Lane ?" : "Update Lane ?";

	const contentText =
		type === "insert"
			? "Are you sure that you want to add this lane"
			: "Are you sure that you want to update this lane";

	const {
		handleSubmit,
		formState: { errors },
		watch,
		control,
	} = useForm({
		resolver: yupResolver(laneValidation),
		mode: "onTouched",
		defaultValues: {
			country: type === "edit" ? laneData.country : "",
			type: type === "edit" ? laneData.type : 1,
			portName: type === "edit" ? laneData.portName : "",
			portCode: type === "edit" ? laneData.portCode : "",
			bookingCode:
				type === "edit" ? `${laneData?.bookingCode ?? ""}` : "",
			fee: type === "edit" ? (laneData.fee ? laneData.fee : "") : "",
			status: type === "edit" ? `${laneData.status}` : "1",
		},
	});

	const onSuccessFunctions = (response) => {
		toast.success(response);
		setPopup(false);
	};

	const { mutate } =
		type === "edit"
			? useUpdateLane(onSuccessFunctions)
			: useInsertLane(onSuccessFunctions);

	function handleToggle(data) {
		setSendData(data);
		dispatch(openPopup());
	}

	const onSubmit = () => {
		if (type === "edit") {
			sendData.id = laneData._id;
		}
		if (sendData.type === "2") {
			sendData.bookingCode = "";
			sendData.fee = 0;
		}
		sendData.createdBy = createdBy;
		mutate(sendData);
		dispatch(closePopup());
	};

	return (
		<form onSubmit={handleSubmit(handleToggle)} className={classes.addDiv}>
			<div>
				<div className={classes.addDivHeading}>
					<div>
						<h3 className={classes.addtitle}>
							{type === "insert" ? "Add Lane" : "Edit Lane"}
						</h3>
					</div>
					<CloseIcon
						type="button"
						onClick={() => setPopup(false)}
						style={{ cursor: "pointer" }}
					/>
				</div>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="country" className="formlabel">
						Country
					</Form.Label>
					<Controller
						name="country"
						control={control}
						render={({ field }) => (
							<Form.Select
								{...field}
								id="country"
								className={`formcontrol ${classes.addLaneSelect}`}>
								<option hidden value="">
									Choose Country
								</option>
								{activeCountries.length > 0 &&
									activeCountries.map((country) => (
										<option
											key={country._id}
											value={country._id}>
											{country.countryName}
										</option>
									))}
							</Form.Select>
						)}
					/>
					{errors.country && (
						<span className="error">{errors.country.message}</span>
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
								style={{ textTransform: "capitalize" }}
								{...field}
								id="type"
								value={watch("type")}
								className="formcontrol">
								<option value={1}>gateway</option>
								<option value={2}>destination</option>
							</Form.Select>
						)}
					/>
					{errors.type && (
						<span className="error">{errors.type.message}</span>
					)}
				</Form.Group>
				<div className={classes.portalign}>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="portnametxt" className="formlabel">
							Port Name
						</Form.Label>
						<Controller
							name="portName"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="portName"
									className="formcontrol"
									placeholder="Enter Port Name"
								/>
							)}
						/>
						{errors.portName && (
							<span className="error">
								{errors.portName.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="portCode" className="formlabel">
							Port Code
						</Form.Label>
						<Controller
							name="portCode"
							control={control}
							render={({ field }) => (
								<Form.Control
									maxLength={5}
									{...field}
									style={{ textTransform: "uppercase" }}
									type="text"
									id="portCode"
									className="formcontrol"
									placeholder="Enter Port Code"
								/>
							)}
						/>
						{errors.portCode && (
							<span className="error">
								{errors.portCode.message}
							</span>
						)}
					</Form.Group>
				</div>
				{Number(watch("type")) === 1 && (
					<Form.Group className="pt-2">
						<Form.Label htmlFor="fee" className="formlabel">
							Gateway Fee Amount
						</Form.Label>
						<Controller
							name="fee"
							control={control}
							render={({ field }) => (
								<InputGroup>
									<Form.Control
										{...field}
										type="number"
										id="fee"
										className="formcontrol"
										placeholder="Enter Gateway Fee Amount"
									/>
									<InputGroup.Text>USD</InputGroup.Text>
								</InputGroup>
							)}
						/>
						{errors.fee && (
							<span className="error">{errors.fee.message}</span>
						)}
					</Form.Group>
				)}
				{Number(watch("type")) === 1 && (
					<Form.Group className="pt-2">
						<Form.Label htmlFor="bookingCode" className="formlabel">
							Gateway Code
						</Form.Label>
						<Controller
							name="bookingCode"
							control={control}
							render={({ field }) => (
								<Form.Control
									type="text"
									style={{ textTransform: "capitalize" }}
									{...field}
									placeholder="Enter Gateway Code"
									id="bookingCode"
									className="formcontrol"
								/>
							)}
						/>
						{errors.bookingCode && (
							<span className="error">
								{errors.bookingCode.message}
							</span>
						)}
					</Form.Group>
				)}
				<div className="pt-4">
					<ToggleButtonGroup
						sx={{ margin: "0 0 20px 0", width: "100%" }}
						value={alignment}
						exclusive
						onChange={handleAlignment}
						aria-label="text alignment"
						className="togglebtn">
						<Controller
							name="status"
							control={control}
							render={({ field }) => (
								<ToggleButton
									{...field}
									sx={{ width: "50%" }}
									selected={field.value === "1"}
									className="togglechildbtn"
									value="1"
									aria-label="left aligned">
									Active
								</ToggleButton>
							)}
						/>
						<Controller
							name="status"
							control={control}
							render={({ field }) => (
								<ToggleButton
									sx={{ width: "50%" }}
									{...field}
									selected={field.value === "2"}
									className={classes.togglechildbtn}
									onChange={(e) => field.onChange(e)}
									value="2"
									aria-label="centered">
									Deactive
								</ToggleButton>
							)}
						/>
					</ToggleButtonGroup>
				</div>
			</div>
			<div>
				<button type="submit" className={classes.savebtn}>
					{type === "insert" ? "Save Lane" : "Update Lane"}
				</button>
			</div>
			<Popup
				handleAgree={onSubmit}
				titleText={titleText}
				contentText={contentText}
			/>
		</form>
	);
};

export default AddAndEditLane;
