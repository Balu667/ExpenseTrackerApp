import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "./index.module.css";
import { roundToDecimal } from "../../helper";

export function WeightField({ control, index, watchFields, errors }) {
	function checkWeight(type, weight) {
		switch (type) {
			case "pallet":
				return { condition: weight <= 1000, value: 1000 };
			case "skids":
				return { condition: weight <= 1000, value: 1000 };
			case "crates":
				return { condition: weight <= 1000, value: 1000 };
			case "cartons":
				return { condition: weight <= 1000, value: 1000 };
			case "bales":
				return { condition: weight <= 1000, value: 1000 };
			case "boxes":
				return { condition: weight <= 1000, value: 1000 };
			case "barrels":
				return { condition: weight <= 1000, value: 1000 };
			case "rolls":
				return { condition: weight <= 1000, value: 1000 };
			default:
				return { condition: true, value: 0 };
		}
	}

	return (
		<Form.Group className={styles.formgroup}>
			<Form.Label className={styles.labels} htmlFor="weightPerPackage">
				Weight/Package
			</Form.Label>
			<span style={{ color: "red" }}>*</span>
			<Controller
				name={`cargoDetails.${index}.weightPerPackage`}
				control={control}
				rules={{
					required: "Weight per packages is required",
					validate: {
						zeroValidate: (e) =>
							parseFloat(e) !== 0 || "Zero is not allowed",
						alphabetCheck: (value) =>
							/^\d+\.?\d*$/.test(value) ||
							"Only numbers are allowed",
						oneDecimalCheck: (value) =>
							/^\d+([.]\d)?$/.test(value) ||
							"Only Single Decimal is allowed",
						minLengthCheck: (value) => {
							const packageType =
								watchFields.cargoDetails[index].packageType;
							const { condition, value: limitValue } =
								checkWeight(packageType, value);
							if (condition === false) {
								return `Enter less than or equal to ${roundToDecimal(
									limitValue
								)} Kg`;
							}
						},
					},
				}}
				render={({ field }) => (
					<Form.Control
						placeholder="0.0"
						{...field}
						type="text"
						id="weightPerPackage"
						disabled={!watchFields.cargoDetails[index].packageType}
						onChange={(e) => {
							if (
								isNaN(e.target.value) ||
								e.target.value === ""
							) {
								field.onChange("");
							} else {
								field.onChange(e.target.value);
							}
						}}
					/>
				)}
			/>
			{errors?.cargoDetails?.[index]?.weightPerPackage && (
				<p className="error">
					{errors.cargoDetails[index].weightPerPackage.message}
				</p>
			)}
		</Form.Group>
	);
}
