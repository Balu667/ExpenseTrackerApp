import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";

const id = localStorage.getItem("allMasterId");

const useUserProfileData = (id, object = {}) => {
	const { onSuccessFunctions, refetchInterval, refetchOnWindowFocus } =
		object;
	return useQuery({
		queryKey: ["userProfileData", id],
		queryFn: ({ queryKey }) =>
			fetchData(
				{
					url: URL + "user/getTeamDetails",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id: queryKey[1] }] }
			),
		onSuccess: (data) => {
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
		refetchInterval,
		refetchOnWindowFocus,
		refetchOnMount: true,
	});
};

const useMutateUserProfileData = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => {
			data.id = id;
			return fetchData(
				{
					url: URL + "user/userEditField",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userProfileData"] });
			queryClient.invalidateQueries({ queryKey: ["subUser"] });
			toast.success("Profile Updated Successfully");
			onSuccessFunctions();
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};
const useMutateUserPreferedLane = (onSuccess) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) => {
			return fetchData(
				{
					url: URL + "user/userPreferredGateway",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["profileData"] });
			queryClient.invalidateQueries({ queryKey: ["userProfileData"] });
			onSuccess(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export {
	useUserProfileData,
	useMutateUserProfileData,
	useMutateUserPreferedLane,
};
