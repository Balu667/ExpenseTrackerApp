import * as yup from "yup";

export const invoiceValidation = yup.object({
	utrNo: yup
		.string()
		.lowercase()
		.trim()
		.required("UTR Number is required")
		.matches(/^[a-z0-9]*$/, "Only alpha numeric characters are allowed"),
	utrDate: yup.string().required("UTR Date is required"),
});
