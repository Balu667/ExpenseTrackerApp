import { useMutation, useQueryClient } from "@tanstack/react-query";
import { URL } from "../config";
import { fetchData } from "../helper";
import { toast } from "react-toastify";

const useInsertInvoiceBybookingId = (onSuccessFunctions) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "booking/updateInvoicePayment",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["singleFullBookingData"],
			});
			queryClient.invalidateQueries({
				queryKey: ["SchedulesBasedRates"],
			});
			onSuccessFunctions(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});
};

export { useInsertInvoiceBybookingId };
