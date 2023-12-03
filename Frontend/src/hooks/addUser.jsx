import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const useGetSubUsers = (id) =>
	useQuery({
		queryKey: ["subUser", id],
		queryFn: () => {
			return fetchData(
				{
					url: URL + "user/getSubUsers",
					method: "POST",
					isAuthRequired: true,
				},
				{
					data: [
						{
							userId: id,
						},
					],
				}
			);
		},
		enabled: id != null,
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

const useInsertNewUser = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => {
			return fetchData(
				{
					url: URL + "user/addUser",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			);
		},
		onSuccess: (data) => {
			onSuccessFunctions(data);
			queryClient.invalidateQueries({ queryKey: ["subUser"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useDeleteSubUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id) =>
			fetchData(
				{
					url: URL + "user/deleteUser",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id }] }
			),
		onSuccess: (data) => {
			toast.success(data);
			queryClient.invalidateQueries({ queryKey: ["subUser"] });
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useGetSubUsers, useInsertNewUser, useDeleteSubUser };
