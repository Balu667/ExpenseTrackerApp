import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "./index.module.css";
import { convertIntoCm, roundToDecimal } from "../../helper";

export function BreadthField({ control, errors, index, watchFields }) {
	function checkBreadth(type, breadth) {
		switch (type) {
			case "pallet":
				return { condition: breadth <= 100, value: 100 };
			case "skids":
				return { condition: breadth <= 100, value: 100 };
			case "crates":
				return { condition: breadth <= 100, value: 100 };
			case "cartons":
				return { condition: breadth <= 100, value: 100 };
			case "bales":
				return { condition: breadth <= 100, value: 100 };
			case "boxes":
				return { condition: breadth <= 100, value: 100 };
			default:
				return { condition: true, value: 0 };
		}
	}

	return (
		<div>
			<div className={styles.dimenlabels}>
				<div className={styles.dimenlabel}>
					<label htmlFor={`breadth${index}`}>B</label>
				</div>
				<Controller
					name={`cargoDetails.${index}.breadth`}
					control={control}
					rules={{
						required: "Breadth is required",
						validate: {
							zeroValidate: (e) =>
								parseFloat(e) !== 0 || "Zero is not allowed",
							oneDecimalCheck: (value) =>
								/^\d+([.]\d)?$/.test(value) ||
								"Only Single Decimal is allowed",
							alphabetCheck: (value) =>
								/^\d+\.?\d*$/.test(value) ||
								"Only numbers are allowed",
							minLengthCheck: (value) => {
								const packageType =
									watchFields.cargoDetails[index].packageType;
								const breadth = value;
								const metric =
									watchFields.cargoDetails[index].metric;
								const { condition, value: limitValue } =
									checkBreadth(
										packageType,
										convertIntoCm(breadth, metric)
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
							id="breadth"
							className={styles.dimeninput}
							disabled={
								!watchFields.cargoDetails[index].packageType
							}
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
			{errors?.cargoDetails?.[index]?.breadth && (
				<p className="error">
					{errors.cargoDetails[index].breadth.message}
				</p>
			)}
		</div>
	);
}
