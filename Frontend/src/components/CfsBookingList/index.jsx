import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../Loader/Loader";
import { useGetAllUsers } from "../../hooks/userManagement";
import searchlogo from "../../assets/Images/searchlogo.png";
import styles from "../../views/Internals/BookingManagementList/index.module.css";
import { useBookingManagementByCfs } from "../../hooks/cfsManagement";

function CfsBookingList({ type }) {
	const { scheduleId } = useParams();
	const navigate = useNavigate();
	const [seacrhTerm, setSearchTerm] = useState("");

	const { isLoading: bookingLoading, data: bookingList } =
		useBookingManagementByCfs(scheduleId);

	const { isLoading: usersLoading, data: usersList } = useGetAllUsers([1]);

	const columns = [
		{
			field: "bookingid",
			headerName: "Booking ID",
			flex: 1,
			cellClassName: "scheduleStyle",
		},
		{
			field: "tv",
			headerName: "TOTAL VOLUME",
			flex: 1,
		},
		{
			field: "tw",
			headerName: "TOTAL WEIGHT",
			flex: 1,
		},
		{
			field: "company",
			headerName: "COMPANY",
			flex: 1,
		},
		{
			field: "user",
			headerName: "USER",
			flex: 1,
		},
		{
			field: "options",
			headerName: "VIEW",
			flex: 1,
			renderCell: (params) => {
				return (
					<button
						onClick={() =>
							navigate(
								`/${type}/bookings/${params.row.scheduleId}/${params.row.id}`
							)
						}
						className={styles.viewinfo}>
						View Info
					</button>
				);
			},
		},
	];

	function newBookingList(array) {
		let rows = [];
		array.forEach((value) => {
			let singleUserData = usersList.find(
				({ _id }) => _id === value.createdBy
			);
			let userName = singleUserData?.fullName ?? "";
			if (value.status === 1 || value.status === 9) {
				rows.push({
					id: value._id,
					bookingid: value.bId,
					scheduleId,
					tv: value.totalCbm,
					tw: value.totalWt,
					company: value.legalName,
					user: userName,
					options: "ss",
				});
			}
		});
		return rows;
	}

	function filterArray(array) {
		return newBookingList(array).filter(({ company }) =>
			company
				.toLowerCase()
				.replace(/\s/g, "")
				.includes(seacrhTerm.toLowerCase().replace(/\s/g, ""))
		);
	}

	if (bookingLoading || usersLoading) {
		return <Loader />;
	}

	return (
		<div className={`${styles.countrydiv} ${styles.cfslist}`}>
			<div className="container">
				<h3 className={styles.listhead}>Bookings List</h3>
				<div className={styles.searchdiv}>
					<div className={styles.chsearchbox}>
						<img src={searchlogo} alt="searchlogo" />
						<input
							type="text"
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search Company Name"
						/>
					</div>
				</div>
				<div
					style={{
						height: 430,
						width: "100%",
						marginTop: "10px",
						borderRadius: "5px",
					}}>
					<DataGrid
						sx={{ textTransform: "capitalize" }}
						getRowId={(row) => row.id}
						columns={columns}
						rows={filterArray(bookingList).reverse()}
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 10,
								},
							},
						}}
						disableRowSelectionOnClick
					/>
				</div>
			</div>
		</div>
	);
}

export default CfsBookingList;
