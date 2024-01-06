import { toast } from "react-toastify";
import { URL } from "../config";
import moment from "moment";

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
	let token = localStorage.getItem("token")
	try {
		const response = await fetch(URL + "expense/addExpense", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
	let token = localStorage.getItem("token")
	try {
		const response = await fetch(URL + "expense/updateExpense", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
	let token = localStorage.getItem("token")
	try {
		const response = await fetch(URL + "expense/setBudget", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
	let token = localStorage.getItem("token")
	try {
		const response = await fetch(URL + "expense/updateBudgetById", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`

			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
	let token = localStorage.getItem("token")
	try {
		const response = await fetch(URL + "expense/getByMonth", {
			method: "POST",
			body: JSON.stringify({ month: moment(data[0]).format("MMMM"), year: moment(data[0]).format('YYYY'), userId: data[1] }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
	let token = localStorage.getItem("token")
	let userId = localStorage.getItem("userId")
	try {
		const response = await fetch(URL + "expense/getExpensesByUserId", {
			method: "POST",
			body: JSON.stringify({ userId: userId }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
	let token = localStorage.getItem("token")
	data.userId = localStorage.getItem("userId")
	try {
		const response = await fetch(URL + "expense/deleteExpense", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
	let token = localStorage.getItem("token")
	let userId = localStorage.getItem("userId")
	try {
		const response = await fetch(URL + "user/logout", {
			method: "POST",
			body: JSON.stringify({ id: userId }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		});
		if (response.status === 401) {
			localforage.clear();
			localStorage.clear();
			window.location.replace("/login");
			toast.error("Unauthorized")
			throw new Error("Unauthorized Access");
		}
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
