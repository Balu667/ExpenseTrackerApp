import { URL } from "../config";
import * as CryptoJS from "crypto-js";

async function insertRate(data) {
	try {
		const response = await fetch(URL + "rate/insertRate", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem(
					"allMasterToken"
				)}`,
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
		});
		const responseJson = await response.json();
		if (responseJson.status === 1) {
			return responseJson.response;
		} else {
			throw new Error(responseJson.response);
		}
	} catch (error) {
		throw new Error(error.message);
	}
}
async function approveRate(data) {
	try {
		const response = await fetch(URL + "rate/updateRate", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem(
					"allMasterToken"
				)}`,
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
		});
		const responseJson = await response.json();
		if (responseJson.status === 1) {
			return responseJson.response;
		} else {
			throw new Error(responseJson.response);
		}
	} catch (error) {
		throw new Error(error.message);
	}
}

async function getSingleRate(id) {
	const postPayload = { data: [{ id }] };
	const encryptedPayload = CryptoJS.AES.encrypt(
		JSON.stringify(postPayload),
		import.meta.env.VITE_ENCRYPTION_KEY
	).toString();
	const postData = { data: [encryptedPayload] };
	try {
		const response = await fetch(URL + "rate/getRateById", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem(
					"allMasterToken"
				)}`,
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(postData),
		});
		const responseJson = await response.json();
		if (responseJson.status === 1) {
			const decryptBytes = CryptoJS.AES.decrypt(
				responseJson.data,
				import.meta.env.VITE_ENCRYPTION_KEY
			);
			const decryptUTF = decryptBytes.toString(CryptoJS.enc.Utf8);
			const decryptedData = JSON.parse(decryptUTF);
			return decryptedData;
		} else {
			throw new Error(responseJson.response);
		}
	} catch (error) {
		throw new Error(error.message);
	}
}

async function updateRate(data) {
	try {
		const response = await fetch(URL + "rate/updateStatus", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem(
					"allMasterToken"
				)}`,
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
		});
		const responseJson = await response.json();
		if (responseJson.status === 1) {
			return responseJson.response;
		} else {
			throw new Error(responseJson.response);
		}
	} catch (error) {
		throw new Error(error.message);
	}
}

export { insertRate, updateRate, getSingleRate, approveRate };
