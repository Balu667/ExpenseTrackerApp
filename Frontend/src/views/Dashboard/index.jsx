import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
	useCategories,
	useChangeExpenseMonth,
	useDeleteExpense,
	useGetExpensesByMonth,
} from "../../hooks/category";
import Loader from "../../components/Loader/Loader";
import { DataGrid } from "@mui/x-data-grid";
import ExpensePopup from "../../components/ExpensePopup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CircularProgress } from "@mui/material";

const expenseValidation = yup.object({
	date: yup.string().trim().required("Date is required"),
	amount: yup.string().required("Amount is required"),
	category: yup.string().trim().required("Category is required"),
});

const Dashboard = () => {
	let userId = localStorage.getItem("userId")
	const {
		handleSubmit,
		formState: { errors },
		watch,
		control,
		reset,
	} = useForm({
		resolver: yupResolver(expenseValidation),
		mode: "onTouched",
		defaultValues: {
			date: null,
			amount: "",
			category: "",
		},
	});

	const [show, setShow] = useState(false);
	const [type, setType] = useState("Add");
	const [date, setDate] = useState(moment());
	const [data, setData] = useState(null);
	const { data: categories, isLoading } = useCategories();
	const { mutate } = useDeleteExpense();
	const { mutate: expenseMutate } = useChangeExpenseMonth();
	const { data: expensesData, isLoading: expenseLoading, refetch } =
		useGetExpensesByMonth([date, userId]);

	useEffect(() => {
		refetch()
	}, [])

	const columns = [
		{
			field: "date",
			headerName: "Date",
			width: 90,
			valueGetter: ({ value }) => moment(value).format("DD/MM/YYYY"),
			flex: 1,
			headerAlign: "center",
			align: "center",
			headerClassName: 'tb-header',
			sx: {
				'.MuiDataGrid-columnHeader': {
					backgroundColor: '#f5f5f5',
					color: '#333', // Optional text color adjustment
				},
			},
		},
		{
			field: "amount",
			headerName: "Money Spent",
			width: 90,
			flex: 1,
			headerAlign: "center",
			align: "center",
			headerClassName: 'tb-header',
		},
		{
			field: "category",
			headerName: "Catagory",
			width: 90,
			flex: 1,
			headerAlign: 'center', align: 'center',
			headerClassName: 'tb-header',
			valueGetter: ({ value }) => {
				return categories.find((item) => item._id === value).name;
			},
		},
		{
			field: "Options",
			headerName: "Options",
			width: 150,
			flex: 1,
			headerAlign: "center",
			align: "center",
			headerClassName: 'tb-header',
			renderCell: ({ row }) => {
				return (
					<div className="btn-container">
						<button
							className="button"
							onClick={() => {
								setType("Update");
								setData(row);
								setShow(true);
								reset({
									date: moment(row.date),
									amount: row.amount,
									category: row.category,
								});
							}}>
							Edit
						</button>
						<button
							className="delete-btn"
							disabled={mutate.isLoading}
							onClick={() =>
								mutate({
									expenseId: row._id,
									year: moment(row.date).format("YYYY"),
									month: moment(row.date).format("MMMM"),
								})
							}>
							{mutate.isLoading ? (
								<CircularProgress />
							) : (
								"Delete"
							)}
						</button>
					</div>
				);
			},
		},
	];

	if (isLoading || expenseLoading) {
		return <Loader />;
	}

	const closePopup = () => {
		setType("Add");
		setShow(false);
		reset();
	};

	const totalSpentCalculator = (expenses) => {
		return expenses
			? expenses.reduce(
				(accumulator, currentValue) =>
					accumulator + currentValue.amount,
				0
			)
			: 0;
	};

	return (
		<div className="dashboard-section">
			<div className="maindiv">
				<div className="container conatinercon">
					<div>
						<div className="overview">
							<div className="overview-div d-flex justify-content-between">
								<h1 className="overviewtxt">Overview</h1>
								<div className="date-div">
									<label className="date-label">
										Select Month:
									</label>
									<DatePicker
										onChange={(value) => {
											setDate(value);
											expenseMutate(value);
										}}
										className="datepicker"
										value={date}
										id="date"
										views={["month", "year"]}
										format="MMMM-YYYY"
									/>
								</div>
							</div>
						</div>
						<div className="gridcontainer">
							<div className="griditem item">
								<div className="logodiv">
									{/* <Prebookingicon /> */}
								</div>
								<h1
									className={`box ${totalSpentCalculator(
										expensesData[0]?.expenses
									) > expensesData[0]?.budgetLimit
										? "redtext"
										: ""
										}`}>
									{expensesData.length > 0
										? totalSpentCalculator(
											expensesData[0]?.expenses
										)
										: 0}
								</h1>
								<h5>
									{moment(date).format("MMMM")} Total spent
								</h5>
							</div>
							<div className="griditem item">
								<div className="logodiv">{/* <Box /> */}</div>
								<h1 className="box">
									{expensesData[0]?.budgetLimit ?? 0}
								</h1>
								<h5>{moment(date).format("MMMM")} Budget</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="expense-heading-div d-flex justify-content-between ">
					<h1 className="overviewtxt">Expenses</h1>
					<button
						className="button"
						onClick={() => {
							reset({
								date: null,
								amount: "",
								category: "",
							});
							setType("Add");
							setShow(true);
						}}>
						Add Expense
					</button>
				</div>
				<div>
					{expensesData && expensesData[0]?.expenses.length > 0 ? 
					<DataGrid
						sx={{ textTransform: "capitalize" }}
						getRowId={(row) => row._id}
						rows={
							expensesData.length > 0
								? expensesData[0].expenses
								: []
						}
						columns={columns.map((column) => ({
							...column,
							sortable: false,
						}))}
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 10,
								},
							},
						}}
						pageSizeOptions={[10]}
						hideFooterSelectedRowCount={true}
						disableColumnFilter
					/> : <div style={{ padding: '1rem', textAlign: 'center' }}>
						No data found.
					</div>}
				</div>
			</div>
			<ExpensePopup
				data={data}
				show={show}
				handleClose={closePopup}
				type={type}
				categories={categories}
				handleSubmit={handleSubmit}
				watch={watch}
				reset={reset}
				errors={errors}
				control={control}
			/>
		</div>
	);
};

export default Dashboard;
