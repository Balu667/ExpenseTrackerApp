import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useCostheading = () =>
	useQuery({
		queryKey: ["costheadingList"],
		queryFn: () =>
			fetchData({
				url: URL + "costHeading/getList",
				isAuthRequired: true,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertCostheading = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "costHeading/insertCostHeading",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["costheadingList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useUpdateCostheading = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "costHeading/updateCostHeading",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["costheadingList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useCostheading, useInsertCostheading, useUpdateCostheading };
