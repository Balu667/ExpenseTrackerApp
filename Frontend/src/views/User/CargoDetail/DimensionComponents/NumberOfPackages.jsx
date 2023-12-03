import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "../index.module.css";

export function NumberOfPackages({ control, index, errors, watchFields }) {
	return (
		<Form.Group className={styles.formgroup}>
			<Form.Label className={styles.labels} htmlFor="noOfPackage">
				No. of Packages
			</Form.Label>
			<span style={{ color: "red" }}>*</span>
			<Controller
				name={`cargoDetails.${index}.noOfPackage`}
				control={control}
				rules={{
					required: "Number of packages is required",
					validate: {
						zeroValidate: (e) =>
							parseFloat(e) !== 0 || "Zero is not allowed",
						alphabetCheck: (value) =>
							/^\d+$/.test(value) || "Only numbers are allowed",
					},
				}}
				render={({ field }) => (
					<Form.Control
						placeholder="ex. 1-99"
						{...field}
						type="text"
						id="noOfPackage"
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
			{errors?.cargoDetails?.[index]?.noOfPackage && (
				<p className="error">
					{errors.cargoDetails[index].noOfPackage.message}
				</p>
			)}
		</Form.Group>
	);
}
