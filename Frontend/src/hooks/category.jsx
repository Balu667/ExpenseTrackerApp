import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getAllCategories, getExpensesByDate, deleteExpenseById, getExpensesByUserId, logoutUser } from "../api/services";
import { useDispatch } from "react-redux";
import { removeProfileData } from "../redux/slices/profileSlice";

const useCategories = () =>
	useQuery({
		queryKey: ["categories"],
		queryFn: () => getAllCategories()
	});

const useGetExpensesByMonth = (date) => {
	return useQuery({
		queryKey: ["expensesByMonth", date],
		queryFn: ({ queryKey }) => getExpensesByDate(queryKey[1]),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useGetExpensesByUserId = () => {
	return useQuery({
		queryKey: ["expensesByUserId"],
		queryFn: () => getExpensesByUserId(),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useDeleteExpense = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => deleteExpenseById(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["expensesByMonth"] });
			toast.success(response.response);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useChangeExpenseMonth = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => getExpensesByDate(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["expensesByMonth"] });
			toast.success(response.response);
		},
		onError: (error) => {
			dispatch(closePopup());
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useLogout = () => {
	const dispatch = useDispatch()
	return useMutation({
		mutationFn: () => logoutUser(),
		onSuccess: (response) => {
			toast.success(response.response);
			dispatch(removeProfileData())
			localStorage.clear()
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};


export { useCategories, useGetExpensesByMonth, useDeleteExpense, useChangeExpenseMonth, useGetExpensesByUserId, useLogout };
