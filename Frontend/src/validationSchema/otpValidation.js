import * as yup from "yup";

export const otpValidation = yup.object({
	otp1: yup
		.string()
		.required("Enter valid OTP")
		.max(1, "One character is allowed for each field")
		.matches(/^[0-9]*$/, "Numbers are only accepted"),
	otp2: yup
		.string()
		.required("Enter valid OTP")
		.max(1, "One character is allowed for each field")
		.matches(/^[0-9]*$/, "Numbers are only accepted"),
	otp3: yup
		.string()
		.max(1, "One character is allowed for each field")
		.required("Enter valid OTP")
		.matches(/^[0-9]*$/, "Numbers are only accepted"),
	otp4: yup
		.string()
		.required("Enter valid OTP")
		.max(1, "One character is allowed for each field")
		.matches(/^[0-9]*$/, "Numbers are only accepted"),
	otp5: yup
		.string()
		.max(1, "One character is allowed for each field")
		.required("Enter valid OTP")
		.matches(/^[0-9]*$/, "Numbers are only accepted"),
	otp6: yup
		.string()
		.max(1, "One character is allowed for each field")
		.required("Enter valid OTP")
		.matches(/^[0-9]*$/, "Numbers are only accepted"),
});
