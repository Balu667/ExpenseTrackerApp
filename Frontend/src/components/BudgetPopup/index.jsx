import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions
} from "@mui/material";
import { Button } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import classes from "./index.module.css";
import { insertBudget, updateBudget } from "../../api/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function BudgetPopup({
	show,
	handleClose,
	type,
	data,
	handleSubmit,
	reset,
	errors,
	control,
}) {
	const userId = localStorage.getItem("userId");
	const queryClient = useQueryClient();
	const insertBudgetData = useMutation({
		mutationFn: type === "Add" ? insertBudget : updateBudget,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["expensesByUserId"] });
			if (data.status === 0) {
				toast.error(data.response);
			}
			if (data.status === 1) {
				toast.success(data.response);
				reset();
				handleClose();
			}
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onSubmit = (budgetData) => {
		if (type === "Update") {
			budgetData.budgetId = data._id;
		} else {
			budgetData.year = moment(budgetData.date).format("YYYY");
			budgetData.month = moment(budgetData.date).format("MMMM");
			budgetData.userId = userId;
		}

		budgetData.budgetLimit = +budgetData.budgetLimit;
		insertBudgetData.mutate(budgetData);
	};

	return (
		<form>
			<Dialog
				className={classes.popup}
				fullWidth
				maxWidth="xs"
				open={show}
				onClose={handleClose}>
				<DialogTitle
					sx={{ fontWeight: "bold", padding: "5px 10px !important" }}>
					{type} Budget
				</DialogTitle>
				<DialogContent
					sx={{ padding: "10px 20px !important" }}
					dividers={scroll === "paper"}>
					{type === "Add" && (
						<Form.Group className="pt-2">
							<Form.Label
								style={{ display: "block" }}
								htmlFor="date"
								className="formlabel">
								Date
							</Form.Label>
							<Controller
								sx={{ display: "block" }}
								name="date"
								control={control}
								render={({ field }) => (
									<DatePicker
										disabled={type === "Update"}
										{...field}
										className="datepicker"
										value={field.value}
										id="date"
										views={["month", "year"]}
										format="MMMM-YYYY"
									/>
								)}
							/>
							{errors.date && (
								<span style={{ display: "block" }} className="error">
									{errors.date.message}
								</span>
							)}
						</Form.Group>
					)}
					<Form.Group className="pt-2">
						<Form.Label htmlFor="date" className="formlabel">
							Amount
						</Form.Label>
						<Controller
							name="budgetLimit"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="budgetLimit"
									className={`formcontrol ${classes.expenseinput}`}
									placeholder="Enter Budget Amount"
								/>
							)}
						/>
						{errors.budgetLimit && (
							<span className="error">
								{errors.budgetLimit.message}
							</span>
						)}
					</Form.Group>
				</DialogContent>
				<DialogActions>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						onClick={handleSubmit(onSubmit)}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</form>
	);
}

export default BudgetPopup;
