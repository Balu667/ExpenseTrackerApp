import * as yup from "yup";

export const addCostHeadingSchema = yup.object({
	sacCode: yup
		.string()
		.max(6)
		.trim()
		.required("SAC Code is required")
		.matches(/^\d+$/, "Only numbers are allowed")
		.max(6, "Maximum 6 characters are allowed"),
	costHeading: yup
		.string()
		.trim()
		.transform((value) => (value != null ? value.toLowerCase() : value))
		.required("Cost Heading is required")
		.matches(/^[A-Za-z\s]*$/, "Only alphabets are allowed")
		.max(20, "Maximum 20 characters are allowed"),
	country: yup
		.array()
		.required("Choose atleast one Country")
		.min(1, "Choose atleast one Country"),
});

export const editCostHeadingSchema = yup.object({
	sacCode: yup
		.string()
		.trim()
		.required("SAC Code is required")
		.matches(/^\d+$/, "Only numbers are allowed")
		.max(6, "Maximum 6 characters"),
	costHeading: yup
		.string()
		.trim()
		.transform((value) => (value != null ? value.toLowerCase() : value))
		.required("Cost Heading is required")
		.matches(/^[A-Za-z\s]*$/, "Only alphabets are allowed")
		.max(20, "Maximum 20 characters are only allowed"),
});
