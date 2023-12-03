import styles from "./index.module.css";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Form from "react-bootstrap/Form";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray } from "react-hook-form";
import styled from "@emotion/styled";
import { PackageTypeField } from "./DimensionComponents/PackageType";
import { LengthField } from "../../../components/DimensionComponents/Length";
import { BreadthField } from "../../../components/DimensionComponents/Breadth";
import { HeightField } from "../../../components/DimensionComponents/Height";
import { RadiusField } from "../../../components/DimensionComponents/Radius";
import { MetricBoxes } from "../../../components/DimensionComponents/Metric";
import { WeightField } from "../../../components/DimensionComponents/Weight";
import { NumberOfPackages } from "./DimensionComponents/NumberOfPackages";
import { Commodity } from "./DimensionComponents/Commodity";
import { HsnCodeField } from "./DimensionComponents/HsnCode";
import { convertMeasurements } from "./convertMeasurement";

const CustomisedToggleButton = styled(ToggleButtonGroup)`
	.MuiToggleButton-root {
		width: 100% !important;
	}
	.MuiToggleButton-root.Mui-selected {
		background: black !important;
		color: #fff !important;
	}
	.MuiButtonBase-root {
		max-width: 180px;
	}
`;

const CargoDimension = ({
	changeCargoType,
	cargoType,
	control,
	watch,
	setValue,
	errors,
	measurementUnit,
	clearErrors,
	addKeyValue,
	removeKeyValue,
	unHandledHsnList,
}) => {
	const initialDimenstionData = {
		packageType: "",
		metric: "CM",
		length: "",
		breadth: "",
		height: cargoType === "non-stackable" ? "250" : "",
		radius: "",
		weightPerPackage: "",
		noOfPackage: "",
		commodity: "",
		hsnCode: "",
		heightLimit: "",
	};

	const { fields, append, remove } = useFieldArray({
		control,
		name: "cargoDetails",
	});

	const watchFields = watch();

	const handleMeasurementUnitChange = (newMeasurementUnit, index) => {
		if (newMeasurementUnit !== null) {
			convertMeasurements(
				newMeasurementUnit,
				index,
				watchFields,
				setValue,
				measurementUnit
			);
		}
	};

	function setNonStackableHeight() {
		for (let index = 0; index < watchFields.cargoDetails.length; index++) {
			if (watchFields.cargoDetails[index].metric === "M") {
				setValue(`cargoDetails.${index}.height`, "2.5");
				clearErrors(`cargoDetails.${index}.height`);
				setValue(
					`cargoDetails.${index}.heightLimit`,
					"Height should be 2.50m"
				);
			} else if (watchFields.cargoDetails[index].metric === "CM") {
				setValue(`cargoDetails.${index}.height`, "250");
				setValue(
					`cargoDetails.${index}.heightLimit`,
					"Height should be 250cm"
				);
				clearErrors(`cargoDetails.${index}.height`);
			} else if (watchFields.cargoDetails[index].metric === "IN") {
				setValue(`cargoDetails.${index}.height`, "98.42");
				clearErrors(`cargoDetails.${index}.height`);
			} else {
				setValue(`cargoDetails.${index}.height`, "2500");
				clearErrors(`cargoDetails.${index}.height`);
				setValue(
					`cargoDetails.${index}.heightLimit`,
					"Height should be 2500mm"
				);
			}
		}
	}

	const stackableClick = () => {
		changeCargoType("stackable");
		for (let index = 0; index < watchFields.cargoDetails.length; index++) {
			setValue(`cargoDetails.${index}.height`, "");
		}
	};

	return (
		<div className={styles.dimensions}>
			<div className={styles.titlediv}>
				<h1>Cargo Dimensions</h1>
				<p className={styles.fills}>Fill in your details</p>
			</div>
			<div className={styles.contentdiv}>
				<div className={styles.togglediv}>
					<CustomisedToggleButton
						value={cargoType}
						exclusive
						sx={{ width: "300px" }}
						aria-label="text alignment">
						<ToggleButton
							sx={{
								backgroundColor: "#EDEDED",
								textTransform: "capitalize",
								fontWeight: 600,
								fontSize: "15px",
								fontFamily: "Rubik",
							}}
							aria-label="left aligned"
							onClick={() => stackableClick()}
							value={"stackable"}
							className={`${
								cargoType === "stackable" && styles.toggle1
							}`}>
							Stackable
						</ToggleButton>
						<ToggleButton
							sx={{
								backgroundColor: "#EDEDED",
								textTransform: "capitalize",
								fontWeight: 600,
								fontSize: "15px",
								fontFamily: "Rubik",
							}}
							value={"non-stackable"}
							aria-label="right aligned"
							onClick={() => {
								changeCargoType("non-stackable");
								setNonStackableHeight();
							}}
							className={`${
								cargoType === "non-stackable" && styles.toggle1
							}`}>
							Non Stackable
						</ToggleButton>
					</CustomisedToggleButton>
				</div>
				{fields.map((item, index) => {
					return (
						<div
							key={item.id}
							style={
								index > 0
									? {
											borderTopStyle: "dotted",
											marginTop: "20px",
											borderWidth: "2px",
											borderColor: "#D8D8D8",
									  }
									: {}
							}>
							<div className={styles.formdiv}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}>
									<h3 className={styles.package}>
										Package #{index + 1}
									</h3>
									{index !== 0 && (
										<DeleteIcon
											sx={{
												cursor: "pointer",
												color: "red",
												marginTop: "20px",
											}}
											onClick={() => {
												remove(index);
												removeKeyValue(index);
											}}
										/>
									)}
								</div>
								<PackageTypeField
									control={control}
									index={index}
									setValue={setValue}
									errors={errors}
								/>
								<Form.Group className={styles.formgroup}>
									<Form.Label
										className={styles.labels}
										htmlFor="Dimensions">
										Dimensions
									</Form.Label>
									<span style={{ color: "red" }}>*</span>
									<div className={styles.labelsdiv}>
										<MetricBoxes
											addKeyValue={addKeyValue}
											control={control}
											handleMeasurementUnitChange={
												handleMeasurementUnitChange
											}
											index={index}
											watchFields={watchFields}
											cargoType={cargoType}
											setValue={setValue}
										/>
										{!(
											watchFields.cargoDetails[index]
												.packageType === "rolls" ||
											watchFields.cargoDetails[index]
												.packageType === "barrels"
										) && (
											<>
												<LengthField
													index={index}
													watchFields={watchFields}
													control={control}
													errors={errors}
												/>
												<BreadthField
													control={control}
													index={index}
													watchFields={watchFields}
													errors={errors}
												/>
											</>
										)}
										{(watchFields.cargoDetails[index]
											.packageType === "rolls" ||
											watchFields.cargoDetails[index]
												.packageType === "barrels") && (
											<RadiusField
												control={control}
												index={index}
												watchFields={watchFields}
												errors={errors}
											/>
										)}
										<HeightField
											cargoType={cargoType}
											control={control}
											index={index}
											watchFields={watchFields}
											errors={errors}
											setValue={setValue}
										/>
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
										}}></div>
								</Form.Group>
								<div className={styles.packagesdiv}>
									<WeightField
										control={control}
										index={index}
										watchFields={watchFields}
										errors={errors}
									/>
									<NumberOfPackages
										control={control}
										index={index}
										errors={errors}
										watchFields={watchFields}
									/>
								</div>
								<div className={styles.packagesdiv}>
									<Commodity
										control={control}
										errors={errors}
										index={index}
										setValue={setValue}
										watchFields={watchFields}
									/>
									<HsnCodeField
										control={control}
										errors={errors}
										index={index}
										watchFields={watchFields}
										unHandledHsnList={unHandledHsnList}
									/>
								</div>
							</div>
						</div>
					);
				})}
				<div>
					<button
						className={styles.addanother}
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							append(initialDimenstionData);
							addKeyValue("add");
						}}>
						Add Another Package
					</button>
				</div>
			</div>
		</div>
	);
};

export default CargoDimension;
