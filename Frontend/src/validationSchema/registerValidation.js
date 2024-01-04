import * as yup from "yup";

export const registerValidation = yup.object({
	username: yup
		.string()
		.trim()
		.required("User Name is required")
		.matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed"),
	email: yup
		.string()
		.email("Enter valid email address")
		.required("Email is required"),
	password: yup
		.string()
		.trim()
		.required("Password is required")
		.matches(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,_]).{8,}$/,
			"Invalid Password format"
		)
});
