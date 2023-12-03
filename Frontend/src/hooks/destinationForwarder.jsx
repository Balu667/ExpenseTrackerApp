import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useGetDestinationForwarderList = (legalName) =>
	useQuery({
		queryKey: ["dfList", legalName],
		queryFn: () => {
			return fetchData(
				{
					url: URL + "df/list",
					method: "POST",
					isAuthRequired: true,
				},
				{
					data: [
						{
							legalName,
						},
					],
				}
			);
		},
		refetchInterval: false,
		refetchOnWindowFocus: false,
		enabled: legalName != null,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetDFbyId = (bookingId, onSuccessFunctions) => {
	return useMutation({
		mutationFn: async (data) => {
			const responseJson = await fetchData(
				{
					url: URL + "booking/getDfDataById",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id: bookingId }] }
			);
			return responseJson;
		},
		onSuccess: (data) => {
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useInsertDestination = (onInsertSuccess) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/dfInsert",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onInsertSuccess(data);
			queryClient.invalidateQueries({ queryKey: ["dfList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useInsertDestination, useGetDFbyId, useGetDestinationForwarderList };
