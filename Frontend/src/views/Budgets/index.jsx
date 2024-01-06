import React, { useEffect, useState } from "react";
import "./Budgets.css";
import { useCategories, useChangeExpenseMonth, useDeleteExpense, useGetExpensesByMonth, useGetExpensesByUserId } from "../../hooks/category";
import Loader from "../../components/Loader/Loader";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import BudgetPopup from "../../components/BudgetPopup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const expenseValidation = yup.object({
    date: yup
        .string()
        .trim()
        .required("Date is required"),
    budgetLimit: yup.string().trim()
        .required("Budget amount is required")
});

const updateExpenseValidation = yup.object({
    budgetLimit: yup.string().trim()
        .required("Budget amount is required"),
});


const Budgets = () => {

    const [show, setShow] = useState(false)
    const [type, setType] = useState("Add")
    const [data, setData] = useState(null)

    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
        reset
    } = useForm({
        resolver: yupResolver(type === "Add" ? expenseValidation : updateExpenseValidation),
        mode: "onTouched",
        defaultValues: {
            date: null,
            budgetLimit: ""
        },
    });

    const { data: expensesData, isLoading: expenseLoading, refetch } = useGetExpensesByUserId()

    useEffect(() => {
        refetch()
    }, [])

    const totalSpentCalculator = (expenses) => {
        return expenses.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);
    }

    const columns = [
        {
            field: "year",
            headerName: "Year",
            width: 150,
            flex: 1,
            headerAlign: 'center', align: 'center',
            headerClassName: 'tb-header',
        },
        {
            field: "month",
            headerName: "Month",
            width: 150,
            flex: 1,
            headerAlign: 'center', align: 'center',
            headerClassName: 'tb-header',
        },
        {
            field: "budgetLimit",
            headerName: "Budget",
            width: 90,
            flex: 1,
            headerAlign: 'center', align: 'center',
            headerClassName: 'tb-header',
        },
        {
            field: "expenses",
            headerName: "Money Spent",
            width: 90,
            flex: 1,
            headerAlign: 'center', align: 'center',
            headerClassName: 'tb-header',
            valueGetter: ({ value }) => totalSpentCalculator(value)
        },
        {
            field: "Options",
            headerName: "Options",
            width: 120,
            headerAlign: 'center', align: 'center',
            headerClassName: 'tb-header',
            renderCell: ({ row }) => {
                return <>
                    <button className="button" onClick={() => {
                        setType("Update"); setData(row); setShow(true);
                        reset({
                            date: null,
                            budgetLimit: row.budgetLimit
                        })
                    }}>Edit</button>
                </>
            },
        },
    ];


    if (expenseLoading) {
        return <Loader />;
    }
    const closePopup = () => {
        setShow(false)
        setData(null)
        reset({
            date: null,
            budgetLimit: ""
        })
    }

    return (
        <div className="dashboard-section">
            <div className="maindiv">
                <div className="container conatinercon">
                    <div>
                        <div className="overview">
                            <div className="budget-div d-flex justify-content-between">
                                <h1 className="overviewtxt">Budgets</h1>
                                <div className="date-div">
                                    <button
                                        className="button"
                                        onClick={() => {
                                            setType("Add");
                                            setShow(true);
                                        }}>
                                        Set Budget
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <div className="container">
                <div>
                    {expensesData.length > 0 ? <DataGrid
                        sx={{ textTransform: "capitalize" }}
                        getRowId={(row) => row._id}
                        rows={expensesData.length > 0 ? expensesData : []}
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
                        // loading={isFetching}
                        hideFooterSelectedRowCount={true}
                    /> : <div style={{ padding: '1rem', textAlign: 'center' }}>
                        No data found.
                    </div>}
                </div>
            </div>
            <BudgetPopup data={data} show={show} handleClose={closePopup} type={type} handleSubmit={handleSubmit} watch={watch} reset={reset} errors={errors} control={control} />
        </div>
    );
};

export default Budgets;
