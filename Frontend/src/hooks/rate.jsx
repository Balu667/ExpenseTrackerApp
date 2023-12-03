import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
	insertRate,
	updateRate,
	getSingleRate,
	approveRate,
} from "../api/rateApi";
import { URL } from "../config";
import { fetchData } from "../helper";
import { closePopup } from "../redux/slices/popupSlice";

const useRates = () =>
	useQuery({
		queryKey: ["ratesList"],
		queryFn: () =>
			fetchData({
				url: URL + "rate/getList",
				isAuthRequired: true,
				isEncrypted: true,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetRateById = (id) =>
	useQuery({
		queryKey: ["singleRate", id],
		queryFn: ({ queryKey }) => getSingleRate(queryKey[1]),

		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertRate = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => insertRate(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["ratesList"] });
			toast.success(response);
			dispatch(closePopup());
			navigate("/rdt/rate");
		},
		onError: (error) => {
			dispatch(closePopup());
			toast.error(error.message.split(":")[1]);
		},
	});
};
const useUpdateRate = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => approveRate(data),
		onSuccess: async (response) => {
			await queryClient.invalidateQueries({ queryKey: ["ratesList"] });
			await queryClient.invalidateQueries({ queryKey: ["singleRate"] });
			toast.success(response);
			dispatch(closePopup());
			navigate("/admin/rate");
		},
		onError: (error) => {
			dispatch(closePopup());
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useUpdateRateStatus = () => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	return useMutation({
		mutationFn: (data) => updateRate(data),
		onSuccess: async (response) => {
			await queryClient.invalidateQueries({ queryKey: ["ratesList"] });
			await queryClient.invalidateQueries({ queryKey: ["singleRate"] });
			dispatch(closePopup());
			toast.success(response);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export {
	useInsertRate,
	useRates,
	useUpdateRateStatus,
	useGetRateById,
	useUpdateRate,
};
