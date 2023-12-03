import { URL } from "../config";
import * as CryptoJS from "crypto-js";

// encrypted payload
export const getEmail = async (id) => {
	const encryptedPayload = CryptoJS.AES.encrypt(
		JSON.stringify({ data: [{ id }] }),
		import.meta.env.VITE_ENCRYPTION_KEY
	).toString();
	try {
		const response = await fetch(URL + "user/getUserMailbyId", {
			method: "POST",
			body: JSON.stringify({ data: [encryptedPayload] }),
			// // body: JSON.stringify({ data: [{ data: [{ id }] }] }),
			// body: JSON.stringify({ data: [{ id }] }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 1) {
			return responseJson;
		} else {
			throw new Error(responseJson.response);
		}
	} catch (error) {
		throw new Error(error.message);
	}
};
