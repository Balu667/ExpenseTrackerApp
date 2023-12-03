import * as yup from "yup";

export const laneValidation = yup.object({
	country: yup.string().required("Country is required"),
	type: yup.string().required("Lane type is required"),
	portName: yup
		.string()
		.trim()
		.transform((value) => (value != null ? value.toLowerCase() : value))
		.required("Port Name is required")
		.matches(/^[A-Za-z\s]*$/, "Only Alphabets are allowed"),
	portCode: yup
		.string()
		.trim()
		.required("Port Code is required")
		.transform((value) => (value != null ? value.toLowerCase() : value))
		.matches(/^[A-Za-z\s]*$/, "Only Alphabets are allowed")
		.min(5, "Should have atleast 5 letters")
		.max(5, "Maximum 5 letters are only allowed"),
	bookingCode: yup.string().when("type", {
		is: (value) => {
			return typeof value === "string"
				? Number(value) === 1
				: value === 1;
		},
		then: (schema) =>
			schema
				.trim()
				.required("Gateway Code is required")
				.matches(/^[0-9]*$/, "Only Numbers are allowed"),
	}),
	fee: yup
		.number()
		.transform((value) =>
			isNaN(value) || value === null || value === undefined ? 0 : value
		)
		.when("type", {
			is: (value) => {
				return typeof value === "string"
					? Number(value) === 1
					: value === 1;
			},
			then: (schema) =>
				schema
					.required("Fee is required for Gateway")
					.integer("Enter Valid Gateway fee")
					.typeError("Fee is required")
					.positive("Enter Valid Gateway Fee"),
		}),
});
