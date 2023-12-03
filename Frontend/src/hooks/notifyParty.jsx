import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useGetNotifyPartyList = (legalName) =>
	useQuery({
		queryKey: ["npList", legalName],
		queryFn: () => {
			return fetchData(
				{
					url: URL + "np/list",
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

const useGetNPById = (bookingId, onSuccessFunctions) => {
	return useMutation({
		mutationFn: async (data) => {
			const responseJson = await fetchData(
				{
					url: URL + "booking/getNpDataById",
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

const useInsertNotifyParty = (onInsertSuccess) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/npInsert",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onInsertSuccess(data);
			queryClient.invalidateQueries({ queryKey: ["npList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useInsertNotifyParty, useGetNPById, useGetNotifyPartyList };
