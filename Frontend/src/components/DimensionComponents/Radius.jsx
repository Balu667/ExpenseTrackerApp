import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "./index.module.css";
import { convertIntoCm, roundToDecimal } from "../../helper";

export function RadiusField({ control, index, watchFields, errors }) {
	function checkRadius(type, radius) {
		switch (type) {
			case "barrels":
				return { condition: radius <= 100, value: 100 };
			case "rolls":
				return { condition: radius <= 100, value: 100 };
			default:
				return { condition: true, value: 0 };
		}
	}

	return (
		<div>
			<div className={styles.dimenlabels}>
				<div className={`${styles.dimenlabel} ${styles.radius}`}>
					<label htmlFor={`radius${index}`}>R</label>
				</div>
				<Controller
					name={`cargoDetails.${index}.radius`}
					control={control}
					rules={{
						required: "Radius is required",
						validate: {
							zeroValidate: (e) =>
								parseFloat(e) !== 0 || "Zero is not allowed",
							alphabetCheck: (value) =>
								/^\d+\.?\d*$/.test(value) ||
								"Only numbers are allowed",
							oneDecimalCheck: (value) =>
								/^\d+([.]\d)?$/.test(value) ||
								"Only Single Decimal is allowed",
							minHeightCheck: (e) => {
								const packageType =
									watchFields.cargoDetails[index].packageType;
								const radius = e;
								const metric =
									watchFields.cargoDetails[index].metric;
								const { condition, value: limitValue } =
									checkRadius(
										packageType,
										convertIntoCm(radius, metric)
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
							{...field}
							placeholder="0.0"
							type="text"
							id="radius"
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
			{errors?.cargoDetails?.[index]?.radius && (
				<p className="error">
					{errors.cargoDetails[index].radius.message}
				</p>
			)}
		</div>
	);
}
