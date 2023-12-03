import * as yup from "yup";

export const originForwarderValidation = yup.object({
	doorNo: yup
		.string()
		.trim()
		.required("Door Number is required")
		.matches(/^[0-9\\/#,A-Za-z\s]*$/, "Enter valid Door Number"),
	pincode: yup
		.string()
		.trim()
		.required("Pincode is required")
		.matches(/^[0-9]*$/, "Only numbers are allowed")
		.min(6, "Should contain atleast 6 numbers")
		.max(6, "Maximum 6 numbers are only allowed"),
	name: yup
		.string()
		.trim()
		.required("Name is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
	emailDomain: yup.string(),
	email: yup
		.string()
		.trim()
		.required("Email is required")
		.matches(/^[a-zA-Z0-9+_.]+[a-zA-Z0-9.]+$/, "Enter valid email"),
	mobile: yup
		.string()
		.trim()
		.required("Mobile Number is required")
		.matches(
			/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
			"Enter valid Mobile Number"
		)
		.required("Mobile Number is required"),
	building: yup.string().trim().required("Building is required"),
	street: yup.string().trim().required("Street is required"),
	area: yup
		.string()
		.trim()
		.required("Area is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
	city: yup.string().trim().required("City is required"),
	state: yup.string().trim().required("State is required"),
	hblName: yup.string().trim().required("Shipper Name is required"),
});
