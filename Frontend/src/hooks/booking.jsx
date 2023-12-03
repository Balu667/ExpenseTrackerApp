import { URL } from "../config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useGetBookingDetailsById = (id) =>
	useQuery({
		queryKey: ["prebookingData", id],
		queryFn: ({ queryKey }) =>
			fetchData(
				{
					url: URL + "booking/getBookingById",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id: queryKey[1] }] }
			),
	});

const useGetOfDetailsById = (id, onSuccessFunctions) =>
	useMutation({
		mutationFn: () =>
			fetchData(
				{
					url: URL + "booking/getOfDataById",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id }] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetDfDetailsById = (id, onSuccessFunctions) =>
	useMutation({
		mutationFn: () =>
			fetchData(
				{
					url: URL + "booking/getDfDataById",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id }] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetNpDetailsById = (id, onSuccessFunctions) =>
	useMutation({
		mutationFn: () =>
			fetchData(
				{
					url: URL + "booking/getNpDataById",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id }] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertDocs = (onSuccessFunctions) =>
	useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/docsInsert",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: () => {
			onSuccessFunctions();
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetDocsById = (id, onSuccessFunctions) =>
	useMutation({
		mutationFn: () =>
			fetchData(
				{
					url: URL + "booking/getDocsById",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id }] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertCheckoutDetails = () =>
	useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/checkoutDetailsInsert",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useUpdateBookingStatus = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/updateStatus",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["bookingList"] });
			queryClient.invalidateQueries({
				queryKey: ["legalNameBookingList"],
			});
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useGetMilestoneData = (bookingId) => {
	const navigate = useNavigate();
	return useQuery({
		queryKey: ["milestoneData", bookingId],
		queryFn: async ({ queryKey }) => {
			try {
				return await fetchData(
					{
						url: URL + "milestone/getMilestoneById",
						method: "POST",
						isAuthRequired: true,
					},
					{ data: [{ bookingId: queryKey[1] }] }
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

const useUpdateMilestoneData = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "milestone/updateMilestone",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["milestoneData"] });
			onSuccessFunctions();
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useGetMilestoneFile = () =>
	useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "milestone/getMilestoneFile",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetInvoiceFileById = () =>
	useMutation({
		mutationFn: (id) =>
			fetchData(
				{
					url: URL + "booking/getInvoicePaymentFile",
					isAuthRequired: true,
					method: "POST",
				},
				{ data: [id] }
			),
		onError: (error) => {
			toast.error(error.message);
		},
	});

export {
	useGetBookingDetailsById,
	useGetOfDetailsById,
	useGetDfDetailsById,
	useGetNpDetailsById,
	useGetDocsById,
	useInsertDocs,
	useInsertCheckoutDetails,
	useUpdateBookingStatus,
	useGetMilestoneData,
	useUpdateMilestoneData,
	useGetMilestoneFile,
	useGetInvoiceFileById,
};
