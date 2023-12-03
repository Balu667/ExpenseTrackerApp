import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import {
	useInsertPortHoliday,
	useUpdatePotHoliday,
} from "../../../hooks/portHoliday";
import { toast } from "react-toastify";
import { portHolidayValidation } from "../../../validationSchema/portHolidayValidation";
import moment from "moment/moment";
import Popup from "../../../components/ConfirmationPopup";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import classes from "./index.module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const AddAndEditPortHoliday = ({ setPopup, type, laneList, holidayData }) => {
	const createdBy = localStorage.getItem("allMasterId");

	const activeLanes =
		laneList.length > 0 && laneList.filter((lane) => lane.status === 1);

	const [alignment, setAlignment] = useState("left");

	const dispatch = useDispatch();

	const [payload, setPayload] = useState(null);

	const titleText = type === "insert" ? "Add Holiday ?" : "Update Holiday ?";

	const contentText =
		type === "insert"
			? "Are you sure that you want to add this Holiday"
			: "Are you sure that you want to update this Holiday";

	const handleAlignment = (event, newAlignment) => {
		setAlignment(newAlignment);
	};
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		resolver: yupResolver(portHolidayValidation),
		mode: "onTouched",
		defaultValues: {
			portCode: type === "edit" ? holidayData.portCode : "",
			date: type === "edit" ? moment(holidayData.date) : null,
			name: type === "edit" ? holidayData.name : "",
			status: type === "edit" ? `${holidayData.status}` : "1",
		},
	});

	const onSuccessFunctions = (response) => {
		toast.success(response);
		setPopup(false);
	};

	const { mutate } =
		type === "edit"
			? useUpdatePotHoliday(onSuccessFunctions)
			: useInsertPortHoliday(onSuccessFunctions);

	function handleToggle(data) {
		data.createdBy = createdBy;
		data.date = moment(data.date).format("MM-DD-YYYY");
		if (type === "edit") {
			data.id = holidayData._id;
		}
		setPayload(data);
		dispatch(openPopup());
	}

	const onSubmit = () => {
		if (type === "edit") {
			mutate(payload);
		} else {
			mutate([payload]);
		}
		dispatch(closePopup());
	};
	return (
		<form onSubmit={handleSubmit(handleToggle)} className={classes.addDiv}>
			<div>
				<div className={classes.addDivHeading}>
					<div>
						<h3 className={classes.addtitle}>
							{type === "insert"
								? "Add Port Holiday"
								: "Edit Port Holiday"}
						</h3>
					</div>
					<CloseIcon
						type="button"
						onClick={() => setPopup(false)}
						style={{ cursor: "pointer" }}
					/>
				</div>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="portCode" className="formlabel">
						Port Code
					</Form.Label>
					<Controller
						name="portCode"
						control={control}
						render={({ field }) => (
							<Form.Select
								{...field}
								style={{
									fontSize: "14px",
								}}
								type="text"
								id="portCode"
								className="formcontrol"
								placeholder="Enter Port Code">
								<option hidden value="">
									Choose Port code
								</option>
								{activeLanes.length > 0 &&
									activeLanes.map((lane) => (
										<option
											value={lane.portCode}
											key={lane._id}>
											{lane.portCode.toUpperCase()}
										</option>
									))}
							</Form.Select>
						)}
					/>
					{errors.portCode && (
						<span className="error">{errors.portCode.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="date" className="formlabel">
						Select Date
					</Form.Label>
					<Controller
						name="date"
						control={control}
						render={({ field }) => (
							<DatePicker
								{...field}
								className="datepicker form-control"
								value={field.value}
								slotProps={{
									textField: {
										readOnly: true,
									},
								}}
								disablePast
								id="etd"
								views={["year", "month", "day"]}
								format="DD-MM-YYYY"
							/>
						)}
					/>
					{errors.date && (
						<span className="error">{errors.date.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="name" className="formlabel">
						Holiday Name
					</Form.Label>
					<Controller
						name="name"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="name"
								className="formcontrol"
								placeholder="Enter Holiday Name"
							/>
						)}
					/>
					{errors.name && (
						<span className="error">{errors.name.message}</span>
					)}
				</Form.Group>
				<div className={classes.togglediv}>
					<ToggleButtonGroup
						sx={{ width: "100%" }}
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
									sx={{ width: "50%" }}
									{...field}
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
									{...field}
									sx={{ width: "50%" }}
									selected={field.value === "2"}
									className="togglechildbtn"
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
					{type === "insert" ? "Save Holiday" : "Update Holiday"}
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

export default React.memo(AddAndEditPortHoliday);
