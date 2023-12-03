import * as yup from "yup";

const originEditcfsValidation = yup.object({
	countryName: yup
		.string()
		.lowercase()
		.trim()
		.required("Country Name is required")
		.matches(/[a-z]/, "Country Name should be letters"),
	type: yup.string().lowercase().trim().required("Type is required"),
	phoneNumberCode: yup.string(),
	phoneNumberLength: yup.string(),
	gateway: yup.string().lowercase().trim().required("Gateway is required"),
	cfsName: yup.string().trim().lowercase().required("CFS Name is required"),
	cfsBranch: yup
		.string()
		.trim()
		.required("CFS Branch is required")
		.lowercase(),
	fullName: yup
		.string()
		.trim()
		.required("Full Name is required")
		.typeError("Full Name is required")
		.matches(/^[A-Za-z ]*$/, "Only alphabets are allowed"),
	address: yup.string().trim().required("Address is required"),
	mobileNo: yup
		.string()
		.matches(/^\+[1-9]{1}[0-9]{3,14}$/, "Enter valid Mobile Number")
		.required("Mobile Number is required")
		.test(
			"Is Valid Mobile Number",
			"Mobile Number format is not correct",
			(value, context) => {
				const countryCode = context.parent.phoneNumberCode;
				return (
					value.length ===
						(
							context.parent.phoneNumberCode +
							context.parent.phoneNumberLength
						).length && value.startsWith(countryCode)
				);
			}
		),
});

const DestinationEditcfsValidation = yup.object({
	countryName: yup
		.string()
		.lowercase()
		.trim()
		.required("Country Name is required")
		.matches(/[a-z]/, "Country Name should be letters"),
	type: yup.string().lowercase().trim().required("Type is required"),
	freeDays: yup
		.number()
		.required("Storage Free Days is required")
		.positive("Only positive numbers are allowed")
		.typeError("Only numbers are allowed")
		.integer("Only numbers without decimals are allowed"),
	phoneNumberCode: yup.string(),
	phoneNumberLength: yup.string(),
	destination: yup
		.string()
		.lowercase()
		.trim()
		.required("Destination is required"),
	cfsName: yup.string().trim().lowercase().required("CFS Name is required"),
	cfsBranch: yup
		.string()
		.trim()
		.required("CFS branch is required")
		.lowercase(),
	fullName: yup
		.string()
		.trim()
		.matches(/^[A-Za-z ]*$/, "Only alphabets are allowed")
		.required("Full Name is required"),
	address: yup.string().trim().required("Address is required"),
	mobileNo: yup
		.string()
		.matches(/^\+[1-9]{1}[0-9]{3,14}$/, "Enter valid Mobile Number")
		.required("Phone Number is required")
		.test(
			"Is Valid Mobile Number",
			"Mobile Number format is not correct",
			(value, context) => {
				const countryCode = context.parent.phoneNumberCode;
				return (
					value.length ===
						(
							context.parent.phoneNumberCode +
							context.parent.phoneNumberLength
						).length && value.startsWith(countryCode)
				);
			}
		),
});

export { originEditcfsValidation, DestinationEditcfsValidation };
