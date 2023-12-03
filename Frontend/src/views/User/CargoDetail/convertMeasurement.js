import { roundToDecimal } from "../../../helper";

export const convertMeasurements = (
	newMeasurementUnit,
	index,
	watchFields,
	setValue,
	measurementUnit
) => {
	const length = watchFields.cargoDetails[index].length;
	const breadth = watchFields.cargoDetails[index].breadth;
	const height = watchFields.cargoDetails[index].height;
	const radius = watchFields.cargoDetails[index].radius;
	const lengthInput = `cargoDetails.${index}.length`;
	const breadthInput = `cargoDetails.${index}.breadth`;
	const heightInput = `cargoDetails.${index}.height`;
	const radiusInput = `cargoDetails.${index}.radius`;

	if (measurementUnit[index] === "M" && newMeasurementUnit === "CM") {
		setValue(lengthInput, length * 100, {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth * 100), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height * 100), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius * 100), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "M" && newMeasurementUnit === "IN") {
		setValue(lengthInput, roundToDecimal(length * 39.37), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth * 39.37), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height * 39.37), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius * 39.37), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "M" && newMeasurementUnit === "MM") {
		setValue(lengthInput, roundToDecimal(length * 1000), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth * 1000), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height * 1000), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius * 1000), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "IN" && newMeasurementUnit === "CM") {
		setValue(lengthInput, roundToDecimal(length * 2.54), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth * 2.54), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height * 2.54), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius * 2.54), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "IN" && newMeasurementUnit === "M") {
		setValue(lengthInput, roundToDecimal(length / 39.37), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth / 39.37), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height / 39.37), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius / 39.37), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "IN" && newMeasurementUnit === "MM") {
		setValue(lengthInput, roundToDecimal(length * 25.4), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth * 25.4), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height * 25.4), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius * 25.4), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "CM" && newMeasurementUnit === "IN") {
		setValue(lengthInput, roundToDecimal(length / 2.54), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth / 2.54), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height / 2.54), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius / 2.54), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "CM" && newMeasurementUnit === "M") {
		setValue(lengthInput, roundToDecimal(length / 100), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth / 100), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height / 100), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius / 100), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "CM" && newMeasurementUnit === "MM") {
		setValue(lengthInput, roundToDecimal(length * 10), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth * 10), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height * 10), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius * 10), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "MM" && newMeasurementUnit === "M") {
		setValue(lengthInput, roundToDecimal(length / 1000), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth / 1000), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height / 1000), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius / 1000), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "MM" && newMeasurementUnit === "CM") {
		setValue(lengthInput, roundToDecimal(length / 10), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth / 10), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height / 10), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius / 10), {
			shouldValidate: true,
		});
	} else if (measurementUnit[index] === "MM" && newMeasurementUnit === "IN") {
		setValue(lengthInput, roundToDecimal(length * 0.0393701), {
			shouldValidate: true,
		});
		setValue(breadthInput, roundToDecimal(breadth * 0.0393701), {
			shouldValidate: true,
		});
		setValue(heightInput, roundToDecimal(height * 0.0393701), {
			shouldValidate: true,
		});
		setValue(radiusInput, roundToDecimal(radius * 0.0393701), {
			shouldValidate: true,
		});
	}
};
