import { Form, InputGroup } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "./index.module.css";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { convertIntoCm, roundToDecimal } from "../../helper";

export function HeightField({
	control,
	cargoType,
	index,
	watchFields,
	errors,
}) {
	function checkHeight(type, height) {
		switch (type) {
			case "pallet":
				return { condition: height <= 251, value: 251 };
			case "skids":
				return { condition: height <= 251, value: 251 };
			case "crates":
				return { condition: height <= 251, value: 251 };
			case "cartons":
				return { condition: height <= 251, value: 251 };
			case "bales":
				return { condition: height <= 251, value: 251 };
			case "boxes":
				return { condition: height <= 251, value: 251 };
			case "barrels":
				return { condition: height <= 251, value: 251 };
			case "rolls":
				return { condition: height <= 251, value: 251 };
			default:
				return { condition: true, value: 0 };
		}
	}

	return (
		<div>
			<div className={styles.dimenlabels}>
				<div className={styles.dimenlabel}>
					<label htmlFor={`height${index}`}>H</label>
				</div>
				<div style={{ position: "relative" }}>
					<Controller
						name={`cargoDetails.${index}.height`}
						control={control}
						rules={{
							required: "Height is required",
							validate: {
								zeroValidate: (e) =>
									parseFloat(e) !== 0 ||
									"Zero is not allowed",
								oneDecimalCheck: (value) =>
									/^\d+([.]\d)?$/.test(value) ||
									"Only Single Decimal is allowed",
								alphabetCheck: (value) =>
									/^\d+\.?\d*$/.test(value) ||
									"Only numbers are allowed",
								minHeightCheck: (e) => {
									const packageType =
										watchFields.cargoDetails[index]
											.packageType;
									const height = e;
									const metric =
										watchFields.cargoDetails[index].metric;
									const { condition, value: limitValue } =
										checkHeight(
											packageType,
											convertIntoCm(height, metric)
										);
									switch (metric) {
										case "M":
											return (
												condition ||
												`Enter less than or equal to ${roundToDecimal(
													limitValue / 100
												)} m`
											);
										case "CM":
											return (
												condition ||
												`Enter less than or equal to ${roundToDecimal(
													limitValue
												)} cm`
											);
										case "IN":
											return (
												condition ||
												`Enter less than or equal to ${roundToDecimal(
													limitValue / 2.54
												)} inches`
											);
										case "MM":
											return (
												condition ||
												`Enter less than or equal to ${roundToDecimal(
													limitValue * 10
												)} mm`
											);
										default:
											break;
									}
								},
							},
						}}
						render={({ field }) => (
							<InputGroup>
								<Form.Control
									placeholder="0.0"
									{...field}
									type="text"
									id="length"
									className={`${styles.dimeninput} ${
										cargoType === "stackable" &&
										styles.height
									}`}
									disabled={
										!watchFields.cargoDetails[index]
											.packageType ||
										cargoType === "non-stackable"
									}
									onChange={(e) => {
										if (
											isNaN(e.target.value) ||
											e.target.value === ""
										) {
											field.onChange("");
										} else {
											field.onChange(
												e.target.value?.trim()
											);
										}
									}}
								/>
								{cargoType === "non-stackable" && (
									<InputGroup.Text
										style={{
											borderRadius: "0px 5px 5px 0px",
										}}>
										<Tooltip
											title={
												watchFields.cargoDetails[index]
													.heightLimit
											}>
											<InfoIcon />
										</Tooltip>
									</InputGroup.Text>
								)}
							</InputGroup>
						)}
					/>
				</div>
			</div>
			{errors?.cargoDetails?.[index]?.height && (
				<p className="error">
					{errors.cargoDetails[index].height.message}
				</p>
			)}
		</div>
	);
}
