import * as yup from "yup";
import { URL } from "../config";
import * as CryptoJS from "crypto-js";

async function checkOfEmail(email) {
	const data = {
		data: [
			{
				email,
			},
		],
	};
	const encryptedPayload = CryptoJS.AES.encrypt(
		JSON.stringify(data),
		import.meta.env.VITE_ENCRYPTION_KEY
	).toString();
	if (email.includes(".")) {
		const response = await fetch(URL + "user/checkEmailExist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data: [encryptedPayload] }),
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			return false;
		}
		if (responseJson.status === 1) {
			return true;
		}
	}
}

yup.addMethod(yup.string, "sameEmailExistOf", function (errorMessage) {
	return this.test(
		"test-same-email-exist",
		errorMessage,
		function (value, context) {
			const { path, createError } = this;
			const email = `${value}${context.parent.emailDomain}`;
			const pattern = /^[\w-.]+[a-zA-Z0-9 ]+@([\w-]+\.)+[\w-]{2,4}$/;
			const emailValidation = "Enter Valid Email";
			if (pattern.test(email) === false) {
				return createError({ path, message: emailValidation });
			} else if (value.includes(".com")) {
				return createError({ path, message: "Enter valid email" });
			} else {
				return (
					checkOfEmail(email) ||
					createError({ path, message: errorMessage })
				);
			}
		}
	);
});

export const addUserValidation = yup.object({
	fullName: yup
		.string()
		.trim()
		.required("Name is required")
		.matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed"),
	email: yup
		.string()
		.required("Email is required")
		.sameEmailExistOf("Email already exist"),
	mobileNumber: yup
		.string()
		.required("Mobile Number is required")
		.min(10, "Mobile Number should contain atleast 10 digits")
		.max(10, "Mobile Number should contain not be more than 10 digits")
		.matches(/^[0-9]+$/, "Enter valid Mobile Number"),
});
