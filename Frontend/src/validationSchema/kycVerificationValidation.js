import * as yup from "yup";
import { URL } from "../config";
import * as CryptoJS from "crypto-js";

function checkGst(gstNumber) {
	const gstRegex =
		/\d{2}[A-Za-z]{5}\d{4}[A-Za-z]{1}[A-Za-z\d]{1}[Zz]{1}[A-Za-z\d]{1}/;
	return gstRegex.test(gstNumber);
}

const fetchData = async (url, data) => {
	const encryptedPayload = CryptoJS.AES.encrypt(
		JSON.stringify(data),
		import.meta.env.VITE_ENCRYPTION_KEY
	).toString();
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("allMasterToken")}`,
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ data: [encryptedPayload] }),
	});
	const responseJson = await response.json();
	if (responseJson.status === 0) {
		return false;
	}
	if (responseJson.status === 1) {
		return true;
	}
};

async function checkGstExist(gst) {
	const data = {
		data: [
			{
				gstNumber: gst,
			},
		],
	};
	if (gst.length === 15) {
		const response = await fetchData(URL + "user/checkGstExist", data);
		return response;
	}
}
async function checkPan(pan) {
	const data = {
		data: [
			{
				pan,
			},
		],
	};
	if (pan.length === 10) {
		const response = await fetchData(URL + "user/checkPanExist", data);
		return response;
	}
}
async function checkMto(mto) {
	const mtoNumber = mto.toLowerCase();
	const data = {
		data: [
			{
				mto: mtoNumber,
			},
		],
	};
	if (mto.length > 0) {
		const response = await fetchData(URL + "user/checkMtoExist", data);
		return response;
	}
}

yup.addMethod(yup.string, "GstNumberValidation", function (errorMessage) {
	return this.test("test-gst-validation", errorMessage, function (value) {
		const { path, createError } = this;
		return checkGst(value) || createError({ path, message: errorMessage });
	});
});

yup.addMethod(yup.string, "sameGstExists", function (errorMessage) {
	return this.test("test-gst-validation", errorMessage, function (value) {
		const { path, createError } = this;
		return (
			checkGstExist(value) || createError({ path, message: errorMessage })
		);
	});
});

yup.addMethod(yup.string, "samePanExists", function (errorMessage) {
	return this.test("test-pan-validation", errorMessage, function (value) {
		const { path, createError } = this;
		return checkPan(value) || createError({ path, message: errorMessage });
	});
});

yup.addMethod(yup.string, "sameMtoExists", function (errorMessage) {
	return this.test("test-mto-validation", errorMessage, function (value) {
		const { path, createError } = this;
		return checkMto(value) || createError({ path, message: errorMessage });
	});
});

export const kycVerificationValidation = yup.object({
	legalName: yup.string().trim().required("Legal Entity Name is required"),
	country: yup.string().required("Country is required"),
	state: yup
		.string()
		.notOneOf(["Choose State"], "State is required")
		.required("State is required"),
	city: yup
		.string()
		.notOneOf(["Choose City"], "City is required")
		.required("City is required"),
	gstNumber: yup
		.string()
		.trim()
		.uppercase()
		.required("GST is required")
		.GstNumberValidation("Please enter a valid GST")
		.sameGstExists("This GST already exists")
		.max(15, "Maximum 15 characters are only allowed"),
	pan: yup
		.string()
		.trim()
		.uppercase()
		.required("PAN is required")
		.matches(
			/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
			"Please enter valid PAN"
		)
		.max(10, "Maximum 10 characters are only allowed")
		.samePanExists("This PAN already exists"),
	mto: yup
		.string()
		.trim()
		.required("MTO is Required")
		.lowercase()
		.sameMtoExists("This MTO already exists"),
	groupName: yup.string().trim(),
});
