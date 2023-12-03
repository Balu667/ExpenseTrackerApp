import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { URL } from "../config";
import { fetchData } from "../helper";
import {
	removeProfileData,
	updateProfileData,
} from "../redux/slices/profileSlice";
import { removeAllDetails } from "../redux/slices/checkoutSlice";

const useLogoutUser = (redirect = true, userType) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const type =
		redirect === false
			? parseInt(userType)
			: useSelector((state) => state.profile.type);
	const id = localStorage.getItem("allMasterId");

	return useMutation({
		mutationFn: () =>
			fetchData(
				{
					url: URL + "user/logout",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id, type }] }
			),
		onSuccess: () => {
			if (redirect) {
				localStorage.removeItem("allMasterId");
				localStorage.removeItem("allMasterToken");
				localStorage.removeItem("type");
				dispatch(removeProfileData());
				dispatch(removeAllDetails());
				navigate(0);
			}
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

const useFetchExistingKycUserDetails = (onSuccessFunctions) => {
	return useMutation({
		mutationFn: (id) =>
			fetchData(
				{
					url: URL + "user/getTeamDetails",
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
};

const useProfileData = (userId, role) => {
	const dispatch = useDispatch();
	const profileData = useSelector((state) => state.profile.profileData);
	return useQuery({
		queryKey: ["profileData", userId, role],
		queryFn: ({ queryKey }) => {
			const [, userId, role] = queryKey;
			switch (role) {
				case 1:
					return fetchData(
						{
							url: URL + "user/getTeamDetails",
							method: "POST",
							isAuthRequired: true,
						},
						{ data: [{ id: userId }] }
					);
				case 6:
				case 7:
					return fetchData(
						{
							url: URL + "cfs/getCfsDetails",
							method: "POST",
							isAuthRequired: true,
						},
						{ data: [{ id: userId }] }
					);
				default:
					return null;
			}
		},
		enabled: userId != null && role != null,
		onSuccess: (data) => {
			if (profileData?.legalName == null) {
				dispatch(updateProfileData(data[0]));
			}
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export { useLogoutUser, useFetchExistingKycUserDetails, useProfileData };
