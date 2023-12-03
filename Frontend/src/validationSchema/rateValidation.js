import * as yup from "yup";

function checkPostive(number) {
	const resultNumber = isNaN(number) ? 0 : parseFloat(number);
	return resultNumber > 0 && resultNumber % 1 === 0;
}

yup.addMethod(yup.number, "positiveNumberCheck", function (errorMessage) {
	return this.test("test-postive-number", errorMessage, function (value) {
		const { path, createError } = this;
		return (
			checkPostive(value) || createError({ path, message: errorMessage })
		);
	});
});

export const rateValidation = yup.object({
	scheduleId: yup.object().nonNullable(),
	OCFS: yup.number().required().positiveNumberCheck(),
	ODOC: yup.number().required().positiveNumberCheck(),
	OGBECBM: yup.number().required().positiveNumberCheck(),
	MROCFS: yup.number().required().positiveNumberCheck(),
	OMBECBM: yup.number().required(),
	MRODOC: yup.number().required().positiveNumberCheck(),
	F: yup.number().required().positiveNumberCheck(),
	FGBECBM: yup.number().required().positiveNumberCheck(),
	FMBECBM: yup.number().required(),
	DCFS: yup.number().required().positiveNumberCheck(),
	DDO: yup.number().required().positiveNumberCheck(),
	DGBECBM: yup.number().required().positiveNumberCheck(),
	MRDCFS: yup.number().required().positiveNumberCheck(),
	MRDDO: yup.number().required().positiveNumberCheck(),
	isOtherCostHeadingExists: yup.boolean(),
	OR: yup.number().when("isOtherCostHeadingExists", {
		is: true,
		then: (schema) => schema.required().positiveNumberCheck(),
	}),
	OCOMMR: yup.number().when("isOtherCostHeadingExists", {
		is: true,
		then: (schema) => schema.required().positiveNumberCheck(),
	}),
	CDCFS: yup.string().required(),
	CDDO: yup.string().required(),
	OC: yup.string().when("isOtherCostHeadingExists", {
		is: true,
		then: (schema) => schema.required(),
	}),
	ROCFS: yup.number().required().positiveNumberCheck(),
	RODOC: yup.number().required().positiveNumberCheck(),
	MRF: yup.number().required().positiveNumberCheck(),
	RF: yup.number().required().positiveNumberCheck(),
	DMBECBM: yup.number().required(),
	RDCFS: yup.number().required().positiveNumberCheck(),
	RDDO: yup.number().required().positiveNumberCheck(),
});
