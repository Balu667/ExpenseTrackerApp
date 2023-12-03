import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useGetAllUsers = (status) =>
	useQuery({
		queryKey: ["allUsers", status],
		queryFn: ({ queryKey }) => {
			const status = queryKey[1].map((e) => parseInt(e));
			return fetchData(
				{
					url: URL + "user/getAllUsers",
					method: "POST",
					isAuthRequired: true,
				},
				{
					data: [
						{
							status,
						},
					],
				}
			);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useGetTeamDetails = (id) =>
	useQuery({
		queryKey: ["teamDetails", id],
		queryFn: ({ queryKey }) => {
			return fetchData(
				{
					url: URL + "user/getTeamDetails",
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

const useMutateUser = (path) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "user/updateUserStatus",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: async () => {
			toast.success("Status Updated Successfully");
			await queryClient.invalidateQueries({
				queryKey: ["teamDetails"],
			});
			await queryClient.refetchQueries({
				queryKey: ["allUsers"],
			});
			navigate(path);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useGetAllUsers, useMutateUser, useGetTeamDetails };
