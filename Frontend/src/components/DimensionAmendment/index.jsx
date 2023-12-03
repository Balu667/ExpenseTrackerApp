import { useEffect, useState } from "react";
import { BreadthField } from "../../components/DimensionComponents/Breadth";
import { HeightField } from "../../components/DimensionComponents/Height";
import { LengthField } from "../../components/DimensionComponents/Length";
import { MetricBoxes } from "../../components/DimensionComponents/Metric";
import { RadiusField } from "../../components/DimensionComponents/Radius";
import { WeightField } from "../../components/DimensionComponents/Weight";
import { convertMeasurements } from "../../views/User/CargoDetail/convertMeasurement";
import { convertFirstLettersAsUpperCase } from "../../helper";

export default function DimensionAmendment({
	cargoDetails,
	cargoType,
	setValue,
	errors,
	fields,
	control,
	reset,
	watchFields,
}) {
	const [measurementUnit, setMeasurementUnit] = useState({
		0: "CM",
	});

	useEffect(() => {
		reset({ cargoDetails: cargoDetails.cargoDetails });
		const newMeasurement = {};
		for (let index = 0; index < cargoDetails.cargoDetails.length; index++) {
			const element = cargoDetails.cargoDetails[index];
			newMeasurement[index] = element.metric;
		}
		setMeasurementUnit(newMeasurement);
	}, []);

	const addKeyValue = (key, value) => {
		let keyName = key;
		let valueName = value;
		if (key === "add") {
			keyName = Object.keys(measurementUnit).length;
			valueName = "CM";
		}
		setMeasurementUnit({ ...measurementUnit, [keyName]: valueName });
	};

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

	return (
		<div>
			{fields.map((item, index) => (
				<div key={item.id} className="my-2">
					<div className="d-flex gap-2">
						<span className="fw-bolder">Package Type:</span>
						<span>
							{convertFirstLettersAsUpperCase(
								watchFields?.cargoDetails[index]?.packageType
							)}
						</span>
					</div>
					<div className="d-flex gap-2">
						<span className="fw-bolder">No of Packages:</span>
						<span>
							{watchFields?.cargoDetails[index].noOfPackage}
						</span>
					</div>
					<div className="d-flex align-items-center gap-2">
						<span span className="fw-bolder">
							Metric
						</span>
						<MetricBoxes
							control={control}
							index={index}
							watchFields={watchFields}
							addKeyValue={addKeyValue}
							handleMeasurementUnitChange={
								handleMeasurementUnitChange
							}
							cargoType={cargoType}
						/>
					</div>
					<div className="d-flex my-2">
						{watchFields?.cargoDetails[index]?.packageType !==
							"barrels" &&
							watchFields?.cargoDetails[index]?.packageType !==
								"rolls" && (
								<>
									<LengthField
										control={control}
										errors={errors}
										index={index}
										watchFields={watchFields}
									/>
									<BreadthField
										control={control}
										errors={errors}
										index={index}
										watchFields={watchFields}
									/>
								</>
							)}
						{cargoType !== "non-stackable" && (
							<HeightField
								cargoType={cargoType}
								control={control}
								errors={errors}
								index={index}
								watchFields={watchFields}
							/>
						)}
						{(watchFields?.cargoDetails[index]?.packageType ===
							"barrels" ||
							watchFields?.cargoDetails[index]?.packageType ===
								"rolls") && (
							<RadiusField
								control={control}
								errors={errors}
								index={index}
								watchFields={watchFields}
							/>
						)}
					</div>
					<WeightField
						control={control}
						errors={errors}
						index={index}
						watchFields={watchFields}
					/>
				</div>
			))}
		</div>
	);
}
