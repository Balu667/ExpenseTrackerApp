import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import classes from "./index.module.css";
import { insertExpense, updateExpense } from "../../api/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Controller } from "react-hook-form";

function ExpensePopup({
	show,
	handleClose,
	type,
	categories,
	data,
	handleSubmit,
	reset,
	errors,
	watch,
	control,
}) {
	const userId = localStorage.getItem("userId");
	const queryClient = useQueryClient();
	const insertExpenseData = useMutation({
		mutationFn: type === "Add" ? insertExpense : updateExpense,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["expensesByMonth"] });
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

	const onSubmit = (expensedata) => {
		if (type === "Update") {
			expensedata.expenseId = data._id;
		} else {
			expensedata.userId = userId;
		}
		insertExpenseData.mutate(expensedata);
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
					{type} Expense
				</DialogTitle>
				<DialogContent
					sx={{ padding: "10px 20px !important" }}
					dividers={scroll === "paper"}>
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
									{...field}
									className="datepicker"
									value={field.value}
									id="date"
									views={["year", "month", "day"]}
									format="DD-MM-YYYY"
								/>
							)}
						/>
						{errors.date && (
							<span className="error">
								{errors.country.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="date" className="formlabel">
							Amount
						</Form.Label>
						<Controller
							name="amount"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="amount"
									className={`formcontrol ${classes.expenseinput}`}
									placeholder="Enter Amount"
								/>
							)}
						/>
						{errors.amount && (
							<span className="error">
								{errors.amount.message}
							</span>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label htmlFor="date" className="formlabel">
							Category
						</Form.Label>
						<Controller
							name="category"
							control={control}
							render={({ field }) => (
								<Form.Select
									{...field}
									id="country"
									className={`formcontrol ${classes.expenseselect}`}>
									<option hidden value="">
										Choose Category
									</option>
									{categories.length > 0 &&
										categories.map((category) => (
											<option
												key={category._id}
												value={category._id}>
												{category.name}
											</option>
										))}
								</Form.Select>
							)}
						/>
						{errors.category && (
							<span className="error">
								{errors.category.message}
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

export default ExpensePopup;
