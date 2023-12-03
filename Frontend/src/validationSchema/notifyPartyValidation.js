import * as yup from "yup";

export const notifyPartyValidation = yup.object({
	doorNo: yup
		.string()
		.trim()
		.required("Door Number is required")
		.matches(/^[0-9\\/#,A-Za-z\s]*$/, "Enter valid Door Number"),
	name: yup
		.string()
		.trim()
		.required("Name is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
	country: yup
		.string()
		.trim()
		.required("Country is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
	companyName: yup.string().trim().required("Company Name is required"),
	email: yup
		.string()
		.trim()
		.required("Email is required")
		.matches(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Enter valid email"
		),
	mobile: yup
		.string()
		.trim()
		.required("Mobile Number is required")
		.matches(/^\+{1}?[0-9][0-9]{7,14}$/, "Enter valid Mobile Number"),
	building: yup.string().trim().required("Building is required"),
	street: yup.string().trim().required("Street is required"),
	area: yup
		.string()
		.trim()
		.required("Area is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
	city: yup
		.string()
		.trim()
		.required("City is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
	state: yup
		.string()
		.trim()
		.required("State is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
});
