import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useInsertOrigin = (onInsertSuccess) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/ofInsert",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			onInsertSuccess(data);
			queryClient.invalidateQueries({ queryKey: ["ofList"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useGetOriginForwarderList = (legalName) =>
	useQuery({
		queryKey: ["ofList", legalName],
		queryFn: ({ queryKey }) =>
			fetchData(
				{
					url: URL + "of/list",
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
		enabled: legalName != null,
		refetchInterval: false,
		refetchOnWindowFocus: false,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetOFFileById = () => {
	return useMutation({
		mutationFn: async (id) => {
			const responseJson = await fetchData(
				{
					url: URL + "booking/getOfFileById  ",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id }] }
			);
			return responseJson;
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useStateData = () => {
	return useQuery({
		queryKey: ["stateList"],
		queryFn: () => {
			return fetchData(
				{
					url: URL + "user/getCountryCityList",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ countryCode: "in" }] }
			);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useCityData = (state) =>
	useQuery({
		queryKey: ["cityList", state],
		queryFn: ({ queryKey }) =>
			fetchData(
				{
					url: URL + "user/getCountryCityList",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ state: queryKey[1], countryCode: "in" }] }
			),
		enabled: !!state,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetOFById = (bookingId, onSuccessFunctions) => {
	return useMutation({
		mutationFn: async (data) => {
			const responseJson = await fetchData(
				{
					url: URL + "booking/getOfDataById",
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

export {
	useGetOriginForwarderList,
	useGetOFFileById,
	useInsertOrigin,
	useGetOFById,
	useStateData,
	useCityData,
};
