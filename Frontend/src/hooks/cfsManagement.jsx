import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useCFsManagement = () =>
	useQuery({
		queryKey: ["cfsmanagement"],
		queryFn: () =>
			fetchData({
				url: URL + "cfs/getList",
				isAuthRequired: true,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const getCfsDetails = (id) =>
	useQuery({
		queryKey: ["cfsDetails", id],
		queryFn: ({ queryKey }) => {
			return fetchData(
				{
					url: URL + "cfs/getCfsInfo",
					method: "POST",
					isAuthRequired: false,
				},
				{
					data: [
						{
							id: queryKey[1],
						},
					],
				}
			);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
const getCfsTeamDetails = (id) => {
	return useQuery({
		queryKey: ["cfsDetails", id],
		queryFn: ({ queryKey }) => {
			return fetchData(
				{
					url: URL + "cfs/getCfsDetails",
					method: "POST",
					isAuthRequired: true,
				},
				{
					data: [
						{
							id: queryKey[1],
						},
					],
				}
			);
		},
		enabled: !!id,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useGetSingleBookingFullDetailsByCfsId = (bookingId, scheduleId) => {
	return useQuery({
		queryKey: ["singleFullBookingData", bookingId, scheduleId],
		queryFn: ({ queryKey }) => {
			return fetchData(
				{
					url: URL + "booking/checkoutDetailsCfsData",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id: queryKey[1], scheduleId: queryKey[2] }] }
			);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useBookingManagementByCfs = (scheduleId) =>
	useQuery({
		queryKey: ["bookingManagement", scheduleId],
		queryFn: ({ queryKey }) => {
			return fetchData(
				{
					url: URL + "booking/management/cfs/getBookingsbyScheduleId",
					method: "POST",
					isAuthRequired: true,
				},
				{
					data: [
						{
							id: queryKey[1],
						},
					],
				}
			);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertCfs = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => {
			data.type = parseInt(data.type);
			return fetchData(
				{
					url: URL + "cfs/insertCfs",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			);
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({
				queryKey: ["cfsmanagement"],
			});
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useMutateCfs = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => {
			data.type = parseInt(data.type);
			return fetchData(
				{
					url: URL + "cfs/updateCfs",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			);
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({
				queryKey: ["cfsmanagement"],
			});
			await queryClient.refetchQueries({ queryKey: ["cfsDetails"] });
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export {
	useCFsManagement,
	useInsertCfs,
	useMutateCfs,
	getCfsDetails,
	getCfsTeamDetails,
	useGetSingleBookingFullDetailsByCfsId,
	useBookingManagementByCfs,
};
