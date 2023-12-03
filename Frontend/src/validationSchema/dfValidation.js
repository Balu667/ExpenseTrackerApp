import * as yup from "yup";

export const destinationForwarderValidation = yup.object({
	doorNo: yup
		.string()
		.trim()
		.required("Door number is required")
		.matches(/^[0-9\\/#,A-Za-z\s]*$/, "Enter valid door number"),
	country: yup.string().trim().required("Country is required"),
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
		.matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),
	state: yup
		.string()
		.trim()
		.required("State is required")
		.matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed"),
});
