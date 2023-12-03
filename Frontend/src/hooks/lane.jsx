import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useLane = (object = {}) => {
	const { refetchInterval } = object;
	return useQuery({
		queryKey: ["laneList"],
		queryFn: () =>
			fetchData({
				url: URL + "lane/getList",
				isAuthRequired: true,
			}),
		refetchInterval,
		refetchOnMount: true,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useInsertLane = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "lane/insertLane",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["laneList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useUpdateLane = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "lane/updateLane",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["laneList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useLane, useInsertLane, useUpdateLane };
