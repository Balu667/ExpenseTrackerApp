import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "../index.module.css";

export function HsnCodeField({
	control,
	index,
	errors,
	watchFields,
	unHandledHsnList,
}) {
	const unHandledHsns = unHandledHsnList;
	return (
		<Form.Group className={styles.formgroup}>
			<Form.Label className={styles.labels} htmlFor="hsnCode">
				HSN Code
			</Form.Label>
			<span style={{ color: "red" }}>*</span>
			<Controller
				name={`cargoDetails.${index}.hsnCode`}
				sx={{ padding: "4px" }}
				control={control}
				rules={{
					required: {
						message: "HSN Code is required",
					},
					pattern: {
						value: /^\d+\.?\d*$/,
						message: "Only Numbers are Allowed",
					},
					validate: {
						checkLength: (value) =>
							value.length === 8 || "Should have 8 numbers",
						checkEmptyString: (value) =>
							value.trim().length > 0 || "HSN Code is required",
						checkHsnCode: (value) => {
							return (
								!unHandledHsns.includes(value.toLowerCase()) ||
								"Currently Not Handling this HSN Code"
							);
						},
					},
				}}
				render={({ field }) => (
					<Form.Control
						{...field}
						placeholder="HSN Code"
						id="hsnCode"
						onChange={(event) =>
							field.onChange(event.target.value?.trim())
						}
						maxLength={8}
						disabled={!watchFields.cargoDetails[index].packageType}
					/>
				)}
			/>
			{errors.cargoDetails?.[index]?.hsnCode && (
				<p className="error">
					{errors.cargoDetails[index].hsnCode.message}
				</p>
			)}
		</Form.Group>
	);
}
