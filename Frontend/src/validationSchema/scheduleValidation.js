import moment from "moment";
import * as yup from "yup";

yup.addMethod(yup.string, "validateDate", function (errorMessage) {
	return this.test("validateDate", errorMessage, function (value) {
		const enteredDate = moment(value, "DD-MM-YYYY");
		return moment(enteredDate).isSameOrAfter(moment(), "day");
	});
});

export const scheduleValidation = (originCheck, destinationCheck) =>
	yup.object({
		pol: yup.string().required("POL is required"),
		pod: yup.string().required("POD is required"),
		container: yup.string().required("Container type is required"),
		volume: yup.string().required("Volume is required"),
		weight: yup.string().required("Weight is required"),
		vessel: yup.string().trim().required("Vessel is required"),
		voyage: yup.string().trim().required("Voyage is required"),
		serviceName: yup
			.string()
			.trim()
			.required("Service Name is required")
			.matches(/^[A-Za-z\s]*$/, "Only alphabets are allowed"),
		etd: yup
			.string()
			.required("ETD is required")
			.validateDate("Invalid date")
			.transform((value) =>
				value !== null ? moment(value).format("DD-MM-YYYY") : value
			),
		eta: yup
			.string()
			.required("ETA is required")
			.validateDate("Invalid date")
			.transform((value) =>
				value !== null ? moment(value).format("DD-MM-YYYY") : value
			),
		bookingCutOff: yup
			.string()
			.required("Booking CutOff Date is required")
			.validateDate("Invalid date")
			.transform((value) =>
				value !== null ? moment(value).format("DD-MM-YYYY") : value
			),
		originCfsCutOff: yup
			.string()
			.required("Origin CFS CutOff Date is required")
			.validateDate("Invalid date")
			.transform((value) =>
				value !== null ? moment(value).format("DD-MM-YYYY") : value
			)
			.test(
				"is-holiday",
				"Given date is a holiday",
				(value) => originCheck(moment(value, "DD-MM-YYYY")) !== true
			),
		destinationCfsCutOff: yup
			.string()
			.required("Destination CFS Cargo Delivery Date is required")
			.validateDate("Invalid date")
			.transform((value) =>
				value !== null ? moment(value).format("DD-MM-YYYY") : value
			)
			.test(
				"is-holiday",
				"Given date is a holiday",
				(value) =>
					destinationCheck(moment(value, "DD-MM-YYYY")) !== true
			),
		originCfsName: yup.string().required("Origin CFS Name is required"),
		originCfsBranch: yup.string().required("Origin CFS Branch is required"),
		originCfsClosingtime: yup
			.string()
			.required("Origin CFS Closing Time is required"),
		destinationCfsName: yup
			.string()
			.required("Destination CFS Name is required"),
		destinationCfsBranch: yup
			.string()
			.required("Destination CFS Branch is required"),
		destinationCfsClosingtime: yup
			.string()
			.required("Destination Available Time is required"),
	});
