import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	addCostHeadingSchema,
	editCostHeadingSchema,
} from "../../../validationSchema/costHeadingValidation";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { Checkbox } from "@mui/material";
import {
	useUpdateCostheading,
	useInsertCostheading,
} from "../../../hooks/costheading";
import { keyMatchLoop } from "../../../helper";
import Popup from "../../../components/ConfirmationPopup";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import classes from "./index.module.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			textTransform: "capitalize",
		},
	},
};

const AddAndEditCostHeading = ({
	type,
	costHeadingData,
	setPopup,
	countries,
}) => {
	const [alignment, setAlignment] = useState("left");

	const [payload, setPayload] = useState(null);

	const createdBy = localStorage.getItem("allMasterId");

	const dispatch = useDispatch();

	const [status, setStatus] = useState(
		type === "insert" ? 1 : costHeadingData.status
	);

	const titleText =
		type === "insert" ? "Add Cost Heading ?" : "Update Cost Heading ?";

	const contentText =
		type === "insert"
			? "Are you sure that you want to add this Cost Heading ?"
			: "Are you sure that you want to update this Cost Heading ?";

	const {
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			sacCode: type === "insert" ? "" : costHeadingData.sacCode,
			costHeading: type === "insert" ? "" : costHeadingData.costHeading,
			country:
				type === "insert"
					? []
					: keyMatchLoop("_id", countries, costHeadingData.country)
							.countryName,
		},
		mode: "onTouched",
		resolver:
			type === "insert"
				? yupResolver(addCostHeadingSchema)
				: yupResolver(editCostHeadingSchema),
	});

	const onSuccessFunctions = (response) => {
		toast.success(response);
		setPopup(false);
	};

	const countryIdArrayConvertCountryNameArray = (arr1, arr2, key) => {
		const arr3 = [];
		for (let i = 0; i < arr1.length; i++) {
			for (let j = 0; j < arr2.length; j++) {
				if (arr1[i] === arr2[j][key]) {
					arr3.push(countries[j]._id);
					break;
				}
			}
		}
		return arr3;
	};

	const { mutate } =
		type === "edit"
			? useUpdateCostheading(onSuccessFunctions)
			: useInsertCostheading(onSuccessFunctions);

	function handleToggle(data) {
		const payload = { ...data };
		if (type === "edit") {
			payload.id = costHeadingData._id;
			payload.country = [costHeadingData.country];
		} else {
			const countryNames = countryIdArrayConvertCountryNameArray(
				data.country,
				countries,
				"countryName"
			);
			payload.country = countryNames;
		}
		payload.createdBy = createdBy;
		payload.status = status;
		setPayload(payload);
		dispatch(openPopup());
	}

	const costHeadingSubmitHandler = async () => {
		mutate(payload);
		dispatch(closePopup());
	};

	const handleAlignment = (e) => {
		e.preventDefault();
		setAlignment(e.target.value);
	};

	return (
		<form className={classes.addDiv} onSubmit={handleSubmit(handleToggle)}>
			<div>
				<div className={classes.addDivHeading}>
					<h3>
						{type === "insert"
							? "Add Cost Heading"
							: "Edit Cost Heading"}
					</h3>
					<CloseIcon
						type="button"
						onClick={() => setPopup(false)}
						style={{ cursor: "pointer" }}
					/>
				</div>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="saccode" className="formlabel">
						SAC Code
					</Form.Label>
					<Controller
						name="sacCode"
						control={control}
						render={({ field }) => (
							<Form.Control
								maxLength={6}
								{...field}
								type="text"
								id="saCcode"
								className="formcontrol"
								placeholder="Enter SAC Code"
							/>
						)}
					/>
					<p className={classes.error}>{errors.sacCode?.message}</p>
				</Form.Group>
				<Form.Group className="pt-2">
					<Form.Label htmlFor="costHeading" className="formlabel">
						Cost Heading
					</Form.Label>
					<Controller
						name="costHeading"
						control={control}
						render={({ field }) => (
							<Form.Control
								maxLength={20}
								{...field}
								type="text"
								id="costHeading"
								className="formcontrol"
								placeholder="Enter Cost Heading"
							/>
						)}
					/>
					<p className={classes.error}>
						{errors.costHeading?.message}
					</p>
				</Form.Group>
				{type === "edit" ? (
					<Form.Group className="pt-2">
						<Form.Label id="demo-multiple-checkbox-label">
							Applicable Countries
						</Form.Label>
						<Controller
							control={control}
							name="country"
							render={({ field }) => (
								<Form.Control
									style={{ textTransform: "capitalize" }}
									disabled
									{...field}
									type="text"
									id="country"
									className="formcontrol"
									placeholder="Enter Cost Heading"
								/>
							)}
						/>
						<p className={classes.error}>
							{errors.country?.message}
						</p>
					</Form.Group>
				) : (
					<Form.Group className="pt-2">
						<Form.Label id="applicableCountries">
							Applicable Countries
						</Form.Label>
						<Controller
							control={control}
							name="country"
							render={({ field: { onChange, value } }) => (
								<Select
									fullWidth
									id="applicableCountries"
									multiple
									displayEmpty
									value={value}
									onChange={onChange}
									className={classes.costheadingSelect}
									sx={{
										textTransform: "capitalize",
										fontSize: "14px",
									}}
									renderValue={(selected) => {
										if (selected.length === 0) {
											return (
												<span>Choose countries</span>
											);
										}
										return selected.join(", ");
									}}
									MenuProps={MenuProps}>
									{countries &&
										countries.map((country) => (
											<MenuItem
												key={country.id}
												value={country.countryName}>
												<Checkbox
													checked={
														watch(
															"country"
														).indexOf(
															country.countryName
														) > -1
													}
												/>
												<ListItemText
													primary={
														country.countryName
													}
												/>
											</MenuItem>
										))}
								</Select>
							)}
						/>
						<p className={classes.error}>
							{errors.country?.message}
						</p>
					</Form.Group>
				)}

				<ToggleButtonGroup
					value={alignment}
					sx={{ width: "100%" }}
					exclusive
					onChange={(e) => handleAlignment(e)}
					aria-label="text alignment"
					className="togglebtn">
					<ToggleButton
						sx={{ width: "50%" }}
						onClick={() => setStatus(1)}
						className="togglechildbtn"
						value={
							type === "insert"
								? "left"
								: costHeadingData.status === 1
								? "left"
								: "center"
						}
						aria-label="left aligned">
						Active
					</ToggleButton>
					<ToggleButton
						sx={{ width: "50%" }}
						onClick={() => setStatus(2)}
						className={classes.togglechildbtn}
						value={
							type === "insert"
								? "center"
								: costHeadingData.status === 1
								? "center"
								: "left"
						}
						aria-label="centered">
						Deactive
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<div>
				<button type="submit" className={classes.savebtn}>
					{type === "insert"
						? "Save Cost Heading"
						: "Update Cost Heading"}
				</button>
			</div>
			<Popup
				handleAgree={costHeadingSubmitHandler}
				titleText={titleText}
				contentText={contentText}
			/>
		</form>
	);
};

export default React.memo(AddAndEditCostHeading);
