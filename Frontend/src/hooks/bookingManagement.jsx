import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { URL } from "../config";
import { fetchData } from "../helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useBookingManagement = (scheduleId) =>
	useQuery({
		queryKey: ["bookingManagement", scheduleId],
		queryFn: ({ queryKey }) => {
			return fetchData(
				{
					url: URL + "booking/management/getBookingsbyScheduleId",
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

const useScheduleBasedBookings = () =>
	useQuery({
		queryKey: ["scheduleBookingList"],
		queryFn: () =>
			fetchData({
				url: URL + "booking/management/getSchedulesRatesBookings",
				isAuthRequired: true,
				isEncrypted: false,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetSingleBookingFullDetails = (bookingId) => {
	const navigate = useNavigate();
	return useQuery({
		queryKey: ["singleFullBookingData", bookingId],
		queryFn: async ({ queryKey }) => {
			try {
				return await fetchData(
					{
						url: URL + "booking/checkoutDetailsDataById",
						method: "POST",
						isAuthRequired: true,
					},
					{ data: [{ id: queryKey[1] }] }
				);
			} catch (err) {
				navigate("/user/mybookings#all", { replace: true });
			}
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useUpdateContainerData = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "milestone/updateContainer",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["scheduleList"] });
			queryClient.invalidateQueries({ queryKey: ["scheduleListOnce"] });
			queryClient.invalidateQueries({ queryKey: ["milestoneData"] });
			queryClient.invalidateQueries({
				queryKey: ["SchedulesBasedRates"],
			});
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export {
	useBookingManagement,
	useScheduleBasedBookings,
	useGetSingleBookingFullDetails,
	useUpdateContainerData,
};
