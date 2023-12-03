import { useQuery } from "@tanstack/react-query";
import { URL } from "../config";
import { fetchData } from "../helper";
import { toast } from "react-toastify";

const useInternalUser = () =>
	useQuery({
		queryKey: ["internaluserList"],
		queryFn: () =>
			fetchData({
				url: URL + "user/getInternalUsers",
				isAuthRequired: true,
			}),
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

export { useInternalUser };
