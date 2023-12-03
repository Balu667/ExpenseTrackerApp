import React from "react";
import styles from "./index.module.css";
import { ReactComponent as EmptyBookingimg } from "../../assets/Images/emptybox.svg";
import { ReactComponent as Search } from "../../assets/Icons/Search.svg";
import { useNavigate } from "react-router-dom";

const EmptyBooking = () => {
	const navigate = useNavigate();
	return (
		<div className={styles.maindiv}>
			<EmptyBookingimg />
			<h1 className={styles.nobookings}>No Bookings made yet !</h1>
			<p className={styles.waitingtxt}>
				What are you waiting for ? <br></br>
				Go and make that first booking !
			</p>
			<button
				className={styles.searchbtn}
				onClick={() => navigate("/user/dashboard")}>
				<Search />
				Search Rates
			</button>
		</div>
	);
};

export default EmptyBooking;
