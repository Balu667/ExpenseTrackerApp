import * as yup from "yup";

export const portHolidayValidation = yup.object({
	portCode: yup
		.string()
		.required("Port code is required")
		.transform((value) => (value != null ? value.toLowerCase() : value))
		.matches(/^[A-Za-z\s]*$/, "Only alphabets are allowed")
		.min(5, "Should have atleast 5 characters")
		.max(5, "Maximum 5 characters are only allowed"),

	date: yup.string().required("Date is required"),
	name: yup
		.string()
		.trim()
		.transform((value) => (value != null ? value.toLowerCase() : value))
		.required("Holiday name is required")
		.matches(/^[A-Za-z\s]*$/, "Only alphabets are allowed"),
});
