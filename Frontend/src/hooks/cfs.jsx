import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useGetCfsBookingList = (id) =>
	useQuery({
		queryKey: ["originCfsBookingList", id],
		queryFn: () => {
			return fetchData(
				{
					url: URL + "cfs/getBookingsCfs",
					method: "POST",
					isAuthRequired: true,
				},
				{
					data: [
						{
							id,
						},
					],
				}
			);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetCfsProfileData = (id) => {
	return useQuery({
		queryKey: ["originCfsProfileData", id],
		queryFn: ({ queryKey }) =>
			fetchData(
				{
					url: URL + "cfs/getCfsDetails",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id: queryKey[1] }] }
			),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useGetCfsBookingList, useGetCfsProfileData };
