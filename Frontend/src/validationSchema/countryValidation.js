import * as yup from "yup";

export const countryValidation = yup.object({
	countryName: yup
		.string()
		.lowercase()
		.trim()
		.matches(/^[a-z\s]*$/, "Country Name should be letters")
		.required("Country Name is required"),
	countryCode: yup
		.string()
		.lowercase()
		.trim()
		.required("Country Code is required")
		.matches(/^[a-z]*$/, "Country Code should be letters")
		.min(2, "Should have atleast 2 letters")
		.max(2, "Maximum 2 Letters are allowed"),
	region: yup
		.string()
		.lowercase()
		.notOneOf(["Choose Region"], "Region is required")
		.required("Region is required"),
	currency: yup
		.string()
		.trim()
		.matches(/^[a-z\s]*$/, "Only Alphabets are allowed")
		.required("Currency is required")
		.min(3, "Should have atleast three letters")
		.max(3, "Maximum three letters are allowed")
		.lowercase(),
	rate: yup
		.string()
		.trim()
		.required("Exchange Rate is required")
		.test(
			"isZero",
			"Rate can't be zero",
			(value) => parseFloat(value) !== 0
		)
		.matches(/^[0-9]\d*(\.\d+)?$/, "Only Numbers and Decimals are allowed"),
	phCode: yup
		.string()
		.trim()
		.required("Phone Code is required")
		.matches(
			/^(\+)(\d)*$/,
			"Only Numbers accepted that are based on the format like +11"
		),
	phNumberFormat: yup
		.string()
		.trim()
		.required("Phone Number Format is required")
		.matches(/^[0-9]*$/, "Only Numbers are allowed"),
	status: yup.string().trim().required("Status is required"),
});
