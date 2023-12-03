import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import styles from "../index.module.css";

export function PackageTypeField({ control, index, setValue, errors }) {
	return (
		<Form.Group className={styles.formgroup}>
			<Form.Label
				className={styles.labels}
				htmlFor={`packageType${index}`}>
				Package Type
			</Form.Label>
			<span style={{ color: "red" }}>*</span>
			<Controller
				name={`cargoDetails.${index}.packageType`}
				control={control}
				rules={{
					required: "Package Type is required",
				}}
				render={({ field }) => (
					<Form.Select
						{...field}
						id={`packageType${index}`}
						className={styles.almostinputs}
						value={field.value}>
						<option value="" hidden>
							Select Package Type
						</option>
						<option value="pallet">Pallets</option>
						<option value="skids">Skids</option>
						<option value="crates">Crates</option>
						<option value="cartons">Cartons</option>
						<option value="bales">Bales</option>
						<option value="boxes">Boxes</option>
						<option value="barrels">Barrels</option>
						<option value="rolls">Rolls</option>
					</Form.Select>
				)}
			/>
			{errors?.cargoDetails?.[index]?.packageType && (
				<p className="error">
					{errors.cargoDetails[index].packageType.message}
				</p>
			)}
		</Form.Group>
	);
}
