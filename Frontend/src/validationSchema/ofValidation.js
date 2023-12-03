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
		.min(6, "Should have atleast 6 numbers")
		.max(6, "Maximum 6 numbers are only allowed"),
	building: yup.string().trim().required("Building is required"),
	street: yup.string().trim().required("Street is required"),
	area: yup
		.string()
		.trim()
		.required("Area is required")
		.matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),
	city: yup.string().trim().required("City is required"),
	state: yup.string().trim().required("State is required"),
});
