import { toast } from "react-toastify";
import { URL } from "../config";
import moment from "moment";

let userId = localStorage.getItem("userId")
let token = localStorage.getItem("token")

export const saveregistration = async (data) => {
	try {
		const response = await fetch(URL + "user/register", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return responseJson;
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const getAllCategories = async () => {
	try {
		const response = await fetch(URL + "expense/getAllCategory");
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return JSON.parse(responseJson.data);
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const insertExpense = async (data) => {
	try {
		const response = await fetch(URL + "expense/addExpense", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return responseJson;
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const updateExpense = async (data) => {
	try {
		const response = await fetch(URL + "expense/updateExpense", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return responseJson;
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const insertBudget = async (data) => {
	try {
		const response = await fetch(URL + "expense/setBudget", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return responseJson;
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const updateBudget = async (data) => {
	try {
		const response = await fetch(URL + "expense/updateBudgetById", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return responseJson;
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const getExpensesByDate = async (data) => {

	try {
		const response = await fetch(URL + "expense/getByMonth", {
			method: "POST",
			body: JSON.stringify({ month: moment(data).format("MMMM"), year: moment(data).format('YYYY'), userId: userId }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return JSON.parse(responseJson.data);
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const getExpensesByUserId = async () => {

	try {
		const response = await fetch(URL + "expense/getExpensesByUserId", {
			method: "POST",
			body: JSON.stringify({ userId: userId }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return JSON.parse(responseJson.data);
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const deleteExpenseById = async (data) => {
	data.userId = userId
	try {
		const response = await fetch(URL + "expense/deleteExpense", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		return responseJson;
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const logoutUser = async () => {
	try {
		const response = await fetch(URL + "user/logout", {
			method: "POST",
			body: JSON.stringify({ id: userId }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		const responseJson = await response.json();
		if (responseJson.status === 0) {
			toast.error(responseJson.message);
			throw new Error(responseJson.response);
		}
		localStorage.clear()
		return responseJson;
	} catch (error) {
		toast.error(error.message);
		throw new Error(error.message);
	}
};

export const logInApi = async (data) => {
	try {
		const response = await fetch(URL + "user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const responseJson = await response.json();
		if (response.ok) {
			return responseJson;
		} else {
			throw new Error(responseJson.message);
		}
	} catch (error) {
		throw new Error(error.message);
	}
}
