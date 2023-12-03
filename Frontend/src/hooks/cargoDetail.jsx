import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { URL } from "../config";
import { fetchData } from "../helper";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
	insertBookingId,
	insertCargoDetails,
} from "../redux/slices/checkoutSlice";

const useSchedulesBasedRates = (scheduleId) =>
	useQuery({
		queryKey: ["SchedulesBasedRates", scheduleId],
		queryFn: ({ queryKey }) => {
			return fetchData(
				{
					url: URL + "schedule/getSchedulesBasedRatesId",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id: queryKey[1] }] }
			);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertPreBooking = () => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	return useMutation({
		mutationFn: async (data) => {
			const postData = data;
			const responseJson = await fetchData(
				{
					url: URL + "booking/insert ",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [postData] }
			);
			return responseJson;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["bookingList"],
			});
			queryClient.invalidateQueries({
				queryKey: ["SchedulesBasedRates"],
			});
			queryClient.invalidateQueries({
				queryKey: ["legalNameBookingList"],
			});
			queryClient.invalidateQueries({
				queryKey: ["laneList"],
			});
			if (data._id != null) {
				dispatch(insertBookingId(data._id));
			}
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useBookingById = () => {
	const dispatch = useDispatch();
	return useMutation({
		mutationFn: async (data) => {
			const responseJson = await fetchData(
				{
					url: URL + "booking/getBookingById",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id: data }] }
			);
			return responseJson;
		},
		onSuccess: (data) => {
			const postData = data;
			postData.id = data._id;
			delete data._id;
			dispatch(insertCargoDetails(data));
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useUnhandledHsnCode = () =>
	useQuery({
		queryKey: ["unHandledHsnCode"],
		queryFn: () =>
			fetchData({
				url: URL + "hsn/getHsnCode",
				isAuthRequired: true,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

export {
	useSchedulesBasedRates,
	useInsertPreBooking,
	useBookingById,
	useUnhandledHsnCode,
};
