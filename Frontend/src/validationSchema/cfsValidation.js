import * as yup from "yup";
import { excludedMail } from "../validationSchema/commonValidation";

const origincfsValidation = yup.object({
	countryName: yup
		.string()
		.lowercase()
		.trim()
		.notOneOf(["Choose Country"], "Country Name is required")
		.required("Country Name is required"),
	type: yup.string().lowercase().trim().required("Type is required"),
	gateway: yup.string().lowercase().trim().required("Gateway is required"),
	phoneNumberCode: yup.string(),
	phoneNumberLength: yup.string(),
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
	email: yup
		.string()
		.trim()
		.email("Enter valid email address")
		.required("Email is required")
		.lowercase()
		.matches(
			new RegExp(
				`^[a-zA-Z0-9._-]+@(?!(${excludedMail.join(
					"|"
				)})$)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`
			),
			"Enter your official email"
		)
		.sameEmailExists("This email already exists"),
	address: yup.string().trim().required("Address is required"),
	mobileNo: yup
		.string()
		.required("Mobile Number is required")
		.matches(/^\+[1-9]{1}[0-9]{3,14}$/, "Only numbers are allowed")
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

const DestinationcfsValidation = yup.object({
	countryName: yup
		.string()
		.lowercase()
		.trim()
		.notOneOf(["Choose Country"], "Country Name is required")
		.required("Country Name is required"),
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
		.required("CFS Branch is required")
		.lowercase(),
	fullName: yup
		.string()
		.trim()
		.matches(/^[A-Za-z ]*$/, "Only alphabets are allowed")
		.required("Full Name is required"),
	email: yup
		.string()
		.trim()
		.lowercase()
		.email("Enter valid email address")
		.required("Email is required")
		.matches(
			new RegExp(
				`^[a-zA-Z0-9._-]+@(?!(${excludedMail.join(
					"|"
				)})$)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`
			),
			"Enter your official email"
		)
		.sameEmailExists("This email already exists"),
	address: yup.string().trim().required("Address is required"),
	mobileNo: yup
		.string()
		.required("Mobile Number is required")
		.matches(/^\+[1-9]{1}[0-9]{3,14}$/, "Only numbers are allowed")
		.test(
			"Is valid Mobile Number",
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

export { origincfsValidation, DestinationcfsValidation };
