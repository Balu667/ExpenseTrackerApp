import moment from "moment";
import * as yup from "yup";

export const containerManagementValidation = yup.object({
	containerNo: yup
		.string()
		.trim()
		.matches(
			/^[a-zA-Z0-9 ]*$/,
			"Only alpha numeric characters are allowed"
		),
	sealNo: yup
		.string()
		.trim()
		.matches(
			/^[a-zA-Z0-9 ]*$/,
			"Only alpha numeric characters are allowed"
		),
	mblNo: yup
		.string()
		.trim()
		.matches(
			/^[a-zA-Z0-9 ]*$/,
			"Only alpha numeric characters are allowed"
		),
	mblDate: yup
		.string()
		.nullable()
		.transform((value) =>
			value !== null ? moment(value).format("DD-MM-YYYY") : ""
		),
	aetd: yup
		.string()
		.nullable()
		.transform((value) =>
			value !== null ? moment(value).format("DD-MM-YYYY") : ""
		),
	aeta: yup
		.string()
		.nullable()
		.transform((value) =>
			value !== null ? moment(value).format("DD-MM-YYYY") : ""
		),
});
