import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useSchedule = () =>
	useQuery({
		queryKey: ["scheduleList"],
		queryFn: () =>
			fetchData({
				url: URL + "schedule/getList",
				isAuthRequired: true,
				isEncrypted: true,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useScheduleOnce = (object = {}) => {
	const { refetchInterval } = object;
	return useQuery({
		queryKey: ["scheduleListOnce"],
		queryFn: () =>
			fetchData({
				url: URL + "schedule/getList",
				isAuthRequired: true,
				isEncrypted: true,
			}),
		refetchInterval,
		refetchOnMount: true,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useInsertSchedule = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data) => {
			const postData = {
				data: [data],
			};
			const responseJson = await fetchData(
				{
					url: URL + "schedule/insertSchedule",
					method: "POST",
					isAuthRequired: true,
				},
				postData
			);
			return responseJson;
		},
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["scheduleList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useUpdateSchedule = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data) => {
			const postData = {
				data: [data],
			};
			const responseJson = await fetchData(
				{
					url: URL + "schedule/updateSchedule",
					method: "POST",
					isAuthRequired: true,
				},
				postData
			);
			return responseJson;
		},
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["scheduleList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useSchedule, useInsertSchedule, useUpdateSchedule, useScheduleOnce };
