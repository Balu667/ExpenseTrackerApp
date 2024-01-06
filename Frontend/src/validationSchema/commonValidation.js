import { addMethod, Schema } from "yup";
import { URL } from "../config";
import * as CryptoJS from "crypto-js";

const excludedMail = [
	"yahoo.com",
	"ymail.com",
	"yahoo.co.in",
	"yahoo.co.uk",
	"rocketmail.com",
	"hotmail.com",
	"live.com",
	"msn.com",
	"bing.com",
	"aol.com",
	"aim.com",
	"microsoft.com",
	"outlook.com",
	"apple.com",
	"mac.com",
	"icloud.com",
	"rediffmail.com",
	"facebook.com",
];

async function checkEmail(email) {
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

addMethod(Schema, "sameEmailExists", function (errorMessage) {
	return this.test("test-same-email-exist", errorMessage, function (value) {
		const { path, createError } = this;
		return (
			checkEmail(value) || createError({ path, message: errorMessage })
		);
	});
});

addMethod(Schema, "sameEmailExistOf", function (errorMessage) {
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
			} else {
				return (
					checkOfEmail(email) ||
					createError({ path, message: errorMessage })
				);
			}
		}
	);
});

export { excludedMail };
