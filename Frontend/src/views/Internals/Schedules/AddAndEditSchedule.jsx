import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import { scheduleValidation } from "../../../validationSchema/scheduleValidation";
import { useInsertSchedule, useUpdateSchedule } from "../../../hooks/schedule";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { keyMatchLoop } from "../../../helper";
import { toast } from "react-toastify";
import { openPopup, closePopup } from "../../../redux/slices/popupSlice";
import Popup from "../../../components/ConfirmationPopup";

const AddAndEditSchedule = ({
	laneList,
	cfsList,
	holidayList,
	isEdit,
	editData,
	onCloseButtonClick,
}) => {
	const createdBy = localStorage.getItem("allMasterId");
	const [alignment, setAlignment] = useState("left");
	const [sendPayload, setSendPayload] = useState(null);
	const handleAlignment = (event, newAlignment) => {
		setAlignment(newAlignment);
	};
	const dispatch = useDispatch();
	const titleText = isEdit ? " Edit Schedule ?" : " Add Schedule ?";
	const contentText = isEdit
		? "Are you sure, You want to Edit this Schedule ?"
		: "Are you sure, You want to Add this Schedule ?";

	const onSuccessFunctions = (response) => {
		toast.success(response);
		if (!isEdit) {
			reset();
		}
		onCloseButtonClick();
	};

	const disableOriginCutOffDates = (date) => {
		if (watch("pol")) {
			const pol = keyMatchLoop("_id", laneList, watch("pol")).portCode;

			const holidayArray = holidayList
				.filter(
					(holiday) =>
						holiday.portCode === pol && holiday.status === 1
				)
				.map((holiday) => moment(holiday.date));

			if (moment(date).toDate().getDay() === 0) {
				return true;
			}

			return holidayArray.some((holiday) => holiday.isSame(date, "day"));
		}
	};

	const disableDestinationCutOffDates = (date) => {
		if (watch("pod")) {
			const pod = keyMatchLoop("_id", laneList, watch("pod")).portCode;
			const holidayArray = holidayList
				.filter(
					(holiday) =>
						holiday.portCode === pod && holiday.status === 1
				)
				.map((holiday) => moment(holiday.date));

			if (moment(date).toDate().getDay() === 0) {
				return true;
			}

			return holidayArray.some((holiday) => holiday.isSame(date, "day"));
		}
	};

	const { mutate, isLoading } = isEdit
		? useUpdateSchedule(onSuccessFunctions)
		: useInsertSchedule(onSuccessFunctions);

	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
		clearErrors,
		setValue,
		watch,
	} = useForm({
		resolver: yupResolver(
			scheduleValidation(
				disableOriginCutOffDates,
				disableDestinationCutOffDates
			)
		),
		mode: "onTouched",
		defaultValues: {
			pol: isEdit ? editData.pol : "",
			pod: isEdit ? editData.pod : "",
			container: isEdit ? editData.container : "",
			volume: isEdit ? editData.volume : "",
			weight: isEdit ? editData.weight : "",
			vessel: isEdit ? editData.vessel : "",
			voyage: isEdit ? editData.voyage : "",
			serviceName: isEdit ? editData.serviceName : "",
			etd: isEdit ? moment(editData.etd) : null,
			eta: isEdit ? moment(editData.eta) : null,
			bookingCutOff: isEdit ? moment(editData.bookingCutOff) : null,
			originCfsCutOff: isEdit ? moment(editData.originCfsCutOff) : null,
			destinationCfsCutOff: isEdit
				? moment(editData.destinationCfsCutOff)
				: null,
			originCfsName: isEdit
				? keyMatchLoop("_id", cfsList, editData.originCfsName).cfsName
				: "",
			originCfsBranch: isEdit ? editData.originCfsBranch : "",
			destinationCfsName: isEdit
				? keyMatchLoop("_id", cfsList, editData.destinationCfsName)
						.cfsName
				: "",
			destinationCfsBranch: isEdit ? editData.destinationCfsBranch : "",
			originCfsClosingtime: isEdit
				? moment(editData.originCfsClosingtime, "HH:mm a")
				: null,
			destinationCfsClosingtime: isEdit
				? moment(editData.destinationCfsClosingtime, "HH:mm a")
				: null,
			status: isEdit ? `${editData.status}` : "1",
		},
	});

	function containerVolume() {
		if (watch("container") !== "") {
			if (watch("container") === "40 HC") {
				return {
					volume: 58,
					weight: 28000,
				};
			} else {
				return {
					volume: 28,
					weight: 24000,
				};
			}
		}
	}

	const onSubmit = async (data) => {
		const payload = { ...data };
		payload.originCfsName = watch("originCfsBranch");
		payload.destinationCfsName = watch("destinationCfsBranch");
		payload.originCfsClosingtime = moment(
			payload.originCfsClosingtime
		).format("HH:mm");
		payload.destinationCfsClosingtime = watch(
			"destinationCfsClosingtime"
		).format("HH:mm");
		payload.createdBy = createdBy;
		if (isEdit) {
			payload.id = editData._id;
			payload.scheduleId = editData.scheduleId;
		}
		setSendPayload(payload);
		dispatch(openPopup());
	};

	const submitData = () => {
		mutate(sendPayload);
		dispatch(closePopup());
	};

	const findOriginCfsName = () => {
		let requiredoriginName;
		if (watch("pol")) {
			requiredoriginName = keyMatchLoop(
				"_id",
				laneList,
				watch("pol")
			)._id;
		}

		return requiredoriginName;
	};

	const findDestinationCfsName = () => {
		let requiredDestinationName;
		if (watch("pod")) {
			requiredDestinationName = keyMatchLoop(
				"_id",
				laneList,
				watch("pod")
			)._id;
		}

		return requiredDestinationName;
	};

	return (
		<div>
			<form className="add_div" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<div className="add_div-heading">
						<div>
							{isEdit ? (
								<h3>Edit Schedule</h3>
							) : (
								<h3>Add Schedule</h3>
							)}
							{isEdit && (
								<p className="scheduleid">
									#{editData.scheduleId}
								</p>
							)}
						</div>
						<CloseIcon
							onClick={() => onCloseButtonClick()}
							style={{ cursor: "pointer" }}
						/>
					</div>
					<div className="inputflex">
						<Form.Group className="pt-2 setwidth">
							<Form.Label htmlFor="pol" className="formlabel">
								POL
							</Form.Label>
							<Controller
								name="pol"
								control={control}
								render={({ field }) => (
									<Form.Select
										{...field}
										onChange={(e) => {
											field.onChange(e);
											setValue("etd", null);
											setValue("originCfsCutOff", null);
											setValue("bookingCutOff", null);
										}}
										id="pol"
										disabled={isEdit}
										className="formcontrol">
										<option hidden>Choose POL</option>
										{laneList &&
											laneList
												.filter(
													(lane) =>
														lane.type === 1 &&
														lane.status === 1
												)
												.map((lane) => (
													<option
														value={lane._id}
														key={lane._id}>
														{lane.portCode.toUpperCase()}
													</option>
												))}
									</Form.Select>
								)}
							/>
							{errors.pol && (
								<span className="error">
									{errors.pol.message}
								</span>
							)}
						</Form.Group>
						<Form.Group className="pt-2 setwidth">
							<Form.Label htmlFor="pod" className="formlabel">
								POD
							</Form.Label>
							<Controller
								name="pod"
								control={control}
								render={({ field }) => (
									<Form.Select
										{...field}
										id="pod"
										onChange={(e) => {
											field.onChange(e);
											setValue(
												"destinationCfsCutOff",
												null
											);
											setValue("eta", null);
										}}
										disabled={isEdit}
										className="formcontrol">
										<option hidden>Choose POD</option>
										{laneList &&
											laneList
												.filter(
													(lane) =>
														lane.type === 2 &&
														lane.status === 1
												)
												.map((lane) => (
													<option
														value={lane._id}
														key={lane._id}>
														{lane.portCode.toUpperCase()}
													</option>
												))}
									</Form.Select>
								)}
							/>
							{errors.pod && (
								<span className="error">
									{errors.pod.message}
								</span>
							)}
						</Form.Group>
					</div>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="container" className="formlabel">
							Container
						</Form.Label>
						<Controller
							name="container"
							control={control}
							render={({ field }) => (
								<Form.Select
									{...field}
									id="container"
									disabled={isEdit}
									onChange={(e) => {
										field.onChange(e);
										setValue(
											"volume",
											containerVolume().volume
										);
										setValue(
											"weight",
											containerVolume().weight
										);
										clearErrors("volume");
										clearErrors("weight");
									}}
									className="formcontrol">
									<option hidden>Choose Container</option>
									<option value="20 ft">20ft</option>
									<option value="40 HC">40HC</option>
								</Form.Select>
							)}
						/>
						{errors.container && (
							<span className="error">
								{errors.container.message}
							</span>
						)}
					</Form.Group>
					<div className="inputflex">
						<Form.Group className="pt-2 setwidth">
							<Form.Label htmlFor="volume" className="formlabel">
								Total Volume
							</Form.Label>
							<Controller
								name="volume"
								control={control}
								render={({ field }) => (
									<InputGroup>
										<Form.Control
											{...field}
											type="text"
											id="volume"
											className="formcontrol volumedisabled"
											disabled
										/>
										<InputGroup.Text>CBM</InputGroup.Text>
									</InputGroup>
								)}
							/>
							{errors.volume && (
								<span className="error">
									{errors.volume.message}
								</span>
							)}
						</Form.Group>
						<Form.Group className="pt-2 setwidth">
							<Form.Label htmlFor="weight" className="formlabel">
								Total Weight
							</Form.Label>
							<Controller
								name="weight"
								control={control}
								render={({ field }) => (
									<InputGroup>
										<Form.Control
											{...field}
											type="text"
											id="weight"
											className="formcontrol volumedisabled"
											disabled
										/>
										<InputGroup.Text>Kg</InputGroup.Text>
									</InputGroup>
								)}
							/>
							{errors.weight && (
								<span className="error">
									{errors.weight.message}
								</span>
							)}
						</Form.Group>
					</div>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="vessel" className="formlabel">
							Vessel
						</Form.Label>
						<Controller
							name="vessel"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="vessel"
									className="formcontrol"
									placeholder="Enter Vessel"
								/>
							)}
						/>
						{errors.vessel && (
							<span className="error">
								{errors.vessel.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="voyage" className="formlabel">
							Voyage
						</Form.Label>
						<Controller
							name="voyage"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="voyage"
									className="formcontrol"
									placeholder="Enter Voyage"
								/>
							)}
						/>
						{errors.voyage && (
							<span className="error">
								{errors.voyage.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="serviceName" className="formlabel">
							Service Name
						</Form.Label>
						<Controller
							name="serviceName"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="serviceName"
									className="formcontrol"
									placeholder="Enter Service Name"
								/>
							)}
						/>
						{errors.serviceName && (
							<span className="error">
								{errors.serviceName.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="etd" className="formlabel">
							ETD
						</Form.Label>
						<Controller
							name="etd"
							control={control}
							render={({ field }) => (
								<DatePicker
									{...field}
									className="datepicker"
									value={field.value}
									minDate={moment()}
									id="etd"
									views={["year", "month", "day"]}
									format="DD-MM-YYYY"
									disabled={watch("pol") === ""}
								/>
							)}
						/>
						{errors.etd && (
							<span className="error">{errors.etd.message}</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="bookingCutOff"
							className="formlabel">
							Booking CutOff Date
						</Form.Label>
						<Controller
							name="bookingCutOff"
							control={control}
							render={({ field }) => (
								<DatePicker
									{...field}
									type="date"
									className="datepicker"
									minDate={moment()}
									format="DD-MM-YYYY"
									id="bookingCutOff"
									disabled={watch("pol") === ""}
								/>
							)}
						/>
						{errors.bookingCutOff && (
							<span className="error">
								{errors.bookingCutOff.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="originCfsCutOff"
							className="formlabel">
							Origin CFS CutOff Date
						</Form.Label>
						<Controller
							name="originCfsCutOff"
							control={control}
							render={({ field }) => (
								<DatePicker
									{...field}
									className="datepicker"
									type="date"
									minDate={moment()}
									format="DD-MM-YYYY"
									id="originCfsCutOff"
									shouldDisableDate={disableOriginCutOffDates}
									disabled={watch("pol") === ""}
								/>
							)}
						/>
						{errors.originCfsCutOff && (
							<span className="error">
								{errors.originCfsCutOff.message}
							</span>
						)}
					</Form.Group>

					<Form.Group className="pt-2">
						<Form.Label htmlFor="eta" className="formlabel">
							ETA
						</Form.Label>
						<Controller
							name="eta"
							control={control}
							render={({ field }) => (
								<DatePicker
									className="datepicker"
									{...field}
									type="date"
									minDate={moment()}
									id="eta"
									views={["year", "month", "day"]}
									format="DD-MM-YYYY"
									disabled={watch("pod") === ""}
								/>
							)}
						/>
						{errors.eta && (
							<span className="error">{errors.eta.message}</span>
						)}
					</Form.Group>

					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="destinationCfsCutOff"
							className="formlabel">
							Destination CFS Cargo Delivery Date
						</Form.Label>
						<Controller
							name="destinationCfsCutOff"
							control={control}
							render={({ field }) => (
								<DatePicker
									className="datepicker"
									{...field}
									type="date"
									disabled={watch("pod") === ""}
									format="DD-MM-YYYY"
									minDate={moment()}
									id="destinationCfsCutOff"
									shouldDisableDate={
										disableDestinationCutOffDates
									}
								/>
							)}
						/>
						{errors.destinationCfsCutOff && (
							<span className="error">
								{errors.destinationCfsCutOff.message}
							</span>
						)}
					</Form.Group>

					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="originCfsName"
							className="formlabel">
							Origin CFS Name
						</Form.Label>
						<Controller
							name="originCfsName"
							control={control}
							render={({ field }) => (
								<Form.Select
									{...field}
									id="originCfsName"
									onChange={(e) => {
										field.onChange(e);
										setValue("originCfsBranch", "");
									}}
									className="formcontrol">
									<option hidden>
										Choose Origin CFS Name
									</option>
									{cfsList &&
										cfsList
											.filter(
												(cfs) =>
													cfs.type === 1 &&
													cfs.status === 1 &&
													cfs.gateway ===
														findOriginCfsName()
											)
											.map((cfs) => (
												<option
													value={cfs.cfsName}
													key={cfs._id}>
													{cfs.cfsName}
												</option>
											))}
								</Form.Select>
							)}
						/>
						{errors.originCfsName && (
							<span className="error">
								{errors.originCfsName.message}
							</span>
						)}
					</Form.Group>
					{watch("originCfsName") !== "" && (
						<Form.Group className="pt-2">
							<Form.Label
								htmlFor="originCfsBranch"
								className="formlabel">
								Origin CFS Branch
							</Form.Label>
							<Controller
								name="originCfsBranch"
								control={control}
								render={({ field }) => (
									<Form.Select
										{...field}
										id="originCfsBranch"
										className="formcontrol">
										<option hidden>
											Choose Origin CFS Name
										</option>
										{watch("originCfsName") &&
											cfsList
												.filter(
													(originCfs) =>
														originCfs.cfsName ===
															watch(
																"originCfsName"
															) &&
														originCfs.status === 1
												)
												.map((originCfs) => (
													<option
														value={originCfs._id}
														key={originCfs._id}>
														{originCfs.cfsBranch}
													</option>
												))}
									</Form.Select>
								)}
							/>
							{errors.originCfsBranch && (
								<span className="error">
									{errors.originCfsBranch.message}
								</span>
							)}
						</Form.Group>
					)}
					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="originCfsClosingtime"
							className="formlabel">
							Origin CFS Closing Time
						</Form.Label>
						<Controller
							name="originCfsClosingtime"
							control={control}
							render={({ field }) => (
								<MobileTimePicker
									className="timeinput"
									{...field}
									ampm={false}
									id="originCfsClosingtime"
								/>
							)}
						/>
						{errors.originCfsClosingtime && (
							<span className="error">
								{errors.originCfsClosingtime.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="destinationCfsName"
							className="formlabel">
							Destination CFS Name
						</Form.Label>
						<Controller
							name="destinationCfsName"
							control={control}
							render={({ field }) => (
								<Form.Select
									{...field}
									onChange={(e) => {
										field.onChange(e);
										setValue("destinationCfsBranch", "");
									}}
									id="destinationCfsName"
									className="formcontrol">
									<option hidden>
										Choose Destination CFS Name
									</option>
									{cfsList &&
										cfsList
											.filter(
												(cfs) =>
													cfs.type === 2 &&
													cfs.status === 1 &&
													cfs.destination ===
														findDestinationCfsName()
											)
											.map((cfs) => (
												<option
													value={cfs.cfsName}
													key={cfs._id}>
													{cfs.cfsName}
												</option>
											))}
								</Form.Select>
							)}
						/>
						{errors.destinationCfsName && (
							<span className="error">
								{errors.destinationCfsName.message}
							</span>
						)}
					</Form.Group>
					{watch("destinationCfsName") !== "" && (
						<Form.Group className="pt-2">
							<Form.Label
								htmlFor="destinationCfsBranch"
								className="formlabel">
								Destination CFS Branch
							</Form.Label>
							<Controller
								name="destinationCfsBranch"
								control={control}
								render={({ field }) => (
									<Form.Select
										{...field}
										id="destinationCfsBranch"
										className="formcontrol">
										<option hidden>
											Choose Destination CFS Name
										</option>
										{watch("destinationCfsName") &&
											cfsList
												.filter(
													(destinationCfs) =>
														destinationCfs.cfsName ===
														watch(
															"destinationCfsName"
														)
												)
												.map((destinationCfs) => (
													<option
														value={
															destinationCfs._id
														}
														key={
															destinationCfs._id
														}>
														{
															destinationCfs.cfsBranch
														}
													</option>
												))}
									</Form.Select>
								)}
							/>
							{errors.destinationCfsBranch && (
								<span className="error">
									{errors.destinationCfsBranch.message}
								</span>
							)}
						</Form.Group>
					)}
					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="destinationCfsClosingtime"
							className="formlabel">
							Destination Available Time
						</Form.Label>
						<Controller
							name="destinationCfsClosingtime"
							control={control}
							render={({ field }) => (
								<MobileTimePicker
									className="timeinput"
									{...field}
									ampm={false}
									id="destinationCfsClosingtime"
									placeholder="Choose Time"
								/>
							)}
						/>
						{errors.destinationCfsClosingtime && (
							<span className="error">
								{errors.destinationCfsClosingtime.message}
							</span>
						)}
					</Form.Group>
					<ToggleButtonGroup
						value={alignment}
						sx={{ width: "100%" }}
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
									className="togglechildbtn"
									selected={field.value === "1"}
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
									className="togglechildbtn"
									selected={
										field.value === "2" ||
										field.value === "3"
									}
									value="3"
									aria-label="centered">
									Inactive
								</ToggleButton>
							)}
						/>
					</ToggleButtonGroup>
				</div>
				<div className="pb-3 pt-3">
					<button disabled={isLoading} className="savebtn">
						Save Schedule
					</button>
				</div>
			</form>
			<Popup
				handleAgree={() => submitData()}
				titleText={titleText}
				contentText={contentText}
			/>
		</div>
	);
};

export default AddAndEditSchedule;
