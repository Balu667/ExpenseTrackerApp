import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useCountries = () =>
	useQuery({
		queryKey: ["countries"],
		queryFn: () =>
			fetchData({
				url: URL + "country/getList",
				isAuthRequired: true,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertCoutries = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "country/insertCountry",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["countries"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useMutateCountries = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "country/updateCountry",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["countries"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useCountries, useInsertCoutries, useMutateCountries };
