import { useMutation, useQuery } from "@tanstack/react-query";
import { URL } from "../config";
import { fetchData } from "../helper";
import { toast } from "react-toastify";

const useGetScheduleRates = () => {
	return useQuery({
		queryKey: ["scheduleRateList"],
		queryFn: () =>
			fetchData({
				url: URL + "schedule/getSchedulesBasedRates",
				isAuthRequired: true,
			}),
		refetchOnMount: true,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useGetBookingList = () => {
	return useQuery({
		queryKey: ["bookingList"],
		queryFn: () =>
			fetchData({
				url: URL + "booking/getBookingsList",
				isAuthRequired: true,
			}),
		refetchOnMount: true,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useLegalNameBookingList = (object = {}, legalName) => {
	const { refetchInterval, refetchOnWindowFocus } = object;
	return useQuery({
		queryKey: ["legalNameBookingList", legalName],
		queryFn: ({ queryKey }) =>
			fetchData(
				{
					url: URL + "booking/getBookingsDetailsByLegalName",
					method: "POST",
					isAuthRequired: true,
				},
				{
					data: [
						{
							legalName: queryKey[1],
						},
					],
				}
			),
		refetchInterval,
		refetchOnWindowFocus,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useSearchStatus = () => {
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/searchBooking",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export {
	useGetScheduleRates,
	useGetBookingList,
	useSearchStatus,
	useLegalNameBookingList,
};
