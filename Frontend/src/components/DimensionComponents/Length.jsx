import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "./index.module.css";
import { convertIntoCm, roundToDecimal } from "../../helper";

export function LengthField({ control, index, errors, watchFields }) {
	function checkLength(type, length) {
		switch (type) {
			case "pallet":
				return { condition: length <= 100, value: 100 };
			case "skids":
				return { condition: length <= 100, value: 100 };
			case "crates":
				return { condition: length <= 100, value: 100 };
			case "cartons":
				return { condition: length <= 100, value: 100 };
			case "bales":
				return { condition: length <= 100, value: 100 };
			case "boxes":
				return { condition: length <= 100, value: 100 };
			default:
				return { condition: true, value: 0 };
		}
	}

	return (
		<div>
			<div className={styles.dimenlabels}>
				<div className={styles.dimen}>
					<label htmlFor={`length${index}`}>L</label>
				</div>
				<Controller
					name={`cargoDetails.${index}.length`}
					control={control}
					rules={{
						required: "Length is required",
						validate: {
							zeroValidate: (e) =>
								parseFloat(e) !== 0 || "Zero is not allowed",
							alphabetCheck: (value) =>
								/^\d+\.?\d*$/.test(value) ||
								"Only numbers are allowed",
							oneDecimalCheck: (value) =>
								/^\d+([.]\d)?$/.test(value) ||
								"Single Decimal is only allowed",
							minLengthCheck: (value) => {
								const packageType =
									watchFields.cargoDetails[index].packageType;
								const length = value;
								const metric =
									watchFields.cargoDetails[index].metric;
								const { condition, value: limitValue } =
									checkLength(
										packageType,
										convertIntoCm(length, metric)
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
						<Form.Control
							placeholder="0.0"
							{...field}
							type="text"
							id="length"
							disabled={
								!watchFields.cargoDetails[index].packageType
							}
							className={styles.dimeninput}
							onChange={(e) => {
								if (
									isNaN(e.target.value) ||
									e.target.value === ""
								) {
									field.onChange("");
								} else {
									field.onChange(e.target.value?.trim());
								}
							}}
						/>
					)}
				/>
			</div>
			{errors?.cargoDetails?.[index]?.length && (
				<p className="error">
					{errors.cargoDetails[index].length.message}
				</p>
			)}
		</div>
	);
}
