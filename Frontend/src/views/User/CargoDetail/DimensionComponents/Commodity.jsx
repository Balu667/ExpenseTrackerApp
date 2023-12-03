import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "../index.module.css";

export function Commodity({ control, index, errors, watchFields }) {
	return (
		<Form.Group className={styles.formgroup}>
			<Form.Label className={styles.labels} htmlFor="commodity">
				Commodity
			</Form.Label>
			<span style={{ color: "red" }}>*</span>
			<Controller
				name={`cargoDetails.${index}.commodity`}
				control={control}
				rules={{
					required: "Commodity is required",
					validate: {
						spaceValidation: (event) => {
							const input = event.trim();
							return input !== "" || "Enter valid Commodity";
						},
					},
				}}
				render={({ field }) => (
					<Form.Control
						placeholder="Commodity"
						{...field}
						className={styles.almostinputs}
						id="commodity"
						disabled={!watchFields.cargoDetails[index].packageType}
					/>
				)}
			/>
			{errors.cargoDetails?.[index]?.commodity && (
				<p className="error">
					{errors.cargoDetails[index].commodity.message}
				</p>
			)}
		</Form.Group>
	);
}
