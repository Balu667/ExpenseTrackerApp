import * as yup from "yup";

export const profileValidation = yup.object({
	fullName: yup
		.string()
		.trim()
		.required("Full Name is required")
		.matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed"),
	mobileNumber: yup
		.string()
		.required("Mobile Number is required")
		.max(10, "Maximum 10 characters are allowed")
		.matches("^[0-9]*$", "Enter valid Mobile Number"),
});
