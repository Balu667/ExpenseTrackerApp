import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Form, InputGroup } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { countryValidation } from "../../../validationSchema/countryValidation";
import { useInsertCoutries, useMutateCountries } from "../../../hooks/country";
import { toast } from "react-toastify";
import Popup from "../../../components/ConfirmationPopup";
import { AiOutlineClose } from "react-icons/ai";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

function AddAndEditCountry({
	alignment,
	regionData,
	handleAlignment,
	onCloseButtonClick,
	isEdit,
	editData,
}) {
	const createdBy = localStorage.getItem("allMasterId");
	const [sendPayload, setSendPayload] = useState(null);
	const dispatch = useDispatch();
	const {
		handleSubmit,
		reset,
		formState: { errors },
		control,
	} = useForm({
		resolver: yupResolver(countryValidation),
		mode: "onTouched",
		defaultValues: {
			countryName: isEdit ? editData.countryName : "",
			countryCode: isEdit ? editData.countryCode : "",
			region: isEdit ? editData.region : "",
			currency: isEdit ? editData.currency : "",
			rate: isEdit ? editData.rate : "",
			phCode: isEdit ? editData.phCode : "",
			phNumberFormat: isEdit ? editData.phNumberFormat : "",
			status: isEdit ? `${editData.status}` : "1",
		},
	});

	const titleText = `${isEdit ? "Edit" : "Add"} this country ?`;
	const contentText = `Are you sure that you want to ${
		isEdit ? "edit" : "add"
	} this country with the given data?`;

	const onSuccessFunctions = (response) => {
		toast.success(response);
		if (!isEdit) {
			reset();
		}
		onCloseButtonClick();
	};

	const { mutate } = isEdit
		? useMutateCountries(onSuccessFunctions)
		: useInsertCoutries(onSuccessFunctions);

	function handleAgree() {
		mutate(sendPayload);
		dispatch(closePopup());
	}

	const onSubmit = (data) => {
		if (isEdit) {
			data.id = editData._id;
		}
		data.createdBy = createdBy;
		setSendPayload(data);
		dispatch(openPopup());
	};

	return (
		<div className="add_div">
			<div className="add_div-heading">
				<h3>{isEdit ? "Edit Country" : "Add Country"}</h3>
				<button onClick={() => onCloseButtonClick()}>
					<AiOutlineClose />
				</button>
			</div>
			<Popup
				titleText={titleText}
				contentText={contentText}
				handleAgree={handleAgree}
			/>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="Country" className="formlabel">
						Country
					</Form.Label>
					<Controller
						name="countryName"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="Country"
								style={{ textTransform: "capitalize" }}
								className="formcontrol"
								placeholder="Enter Country"
							/>
						)}
					/>
					{errors.countryName && (
						<span className="error">
							{errors.countryName.message}
						</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="InputEmail1" className="formlabel">
						Country Code
					</Form.Label>
					<Controller
						name="countryCode"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								maxLength={2}
								id="InputEmail1"
								style={{ textTransform: "uppercase" }}
								className="formcontrol"
								placeholder="Enter Country Code"
							/>
						)}
					/>
					{errors.countryCode && (
						<span className="error">
							{errors.countryCode.message}
						</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="Region" className="formlabel">
						Region
					</Form.Label>
					<Controller
						name="region"
						control={control}
						render={({ field }) => (
							<Form.Select
								{...field}
								style={{ textTransform: "capitalize" }}
								id="Region"
								className="formcontrol">
								<option value={""}>Choose Region</option>
								{regionData.map((e, index) => (
									<option key={index} value={e.toLowerCase()}>
										{e}
									</option>
								))}
							</Form.Select>
						)}
					/>
					{errors.region && (
						<span className="error">{errors.region.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="Currency" className="formlabel">
						Currency
					</Form.Label>
					<Controller
						name="currency"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								maxLength={3}
								style={{ textTransform: "uppercase" }}
								id="Currency"
								className="formcontrol"
								placeholder="Enter Currency"
							/>
						)}
					/>
					{errors.currency && (
						<span className="error">{errors.currency.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="ExchangeRate" className="formlabel">
						Exchange Rate
					</Form.Label>
					<Controller
						name="rate"
						control={control}
						render={({ field }) => (
							<InputGroup>
								<Form.Control
									type="text"
									{...field}
									id="ExchangeRate"
									className="formcontrol"
									placeholder="Enter Exchange Rate"
								/>
								<InputGroup.Text>INR</InputGroup.Text>
							</InputGroup>
						)}
					/>
					{errors.rate && (
						<span className="error">{errors.rate.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="phonecode" className="formlabel">
						Phone Code
					</Form.Label>
					<Controller
						name="phCode"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="phonecode"
								className="formcontrol"
								placeholder="Enter Phone Code"
							/>
						)}
					/>
					{errors.phCode && (
						<span className="error">{errors.phCode.message}</span>
					)}
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="numberFormat" className="formlabel">
						Number Format
					</Form.Label>
					<Controller
						name="phNumberFormat"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="numberFormat"
								className="formcontrol"
								placeholder="Enter Phone Number"
							/>
						)}
					/>
					{errors.phNumberFormat && (
						<span className="error">
							{errors.phNumberFormat.message}
						</span>
					)}
				</Form.Group>
				<div className="pt-4">
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
									{...field}
									sx={{ width: "50%" }}
									selected={field.value === "2"}
									className="togglechildbtn"
									value="2"
									aria-label="centered">
									Deactive
								</ToggleButton>
							)}
						/>
					</ToggleButtonGroup>
				</div>
				<div className="pt-3 pb-3">
					<button className="savebtn">Save Country</button>
				</div>
			</Form>
		</div>
	);
}

export default AddAndEditCountry;
