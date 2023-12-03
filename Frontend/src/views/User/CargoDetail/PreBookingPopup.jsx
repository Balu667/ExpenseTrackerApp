import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./index.module.css";
import { AiOutlineClose } from "react-icons/ai";
import Caution from "../../../assets/Images/caution.png";
import Checkbox from "@mui/material/Checkbox";

function PreBookingPopup({
	open,
	close,
	checkbox,
	setCheckbox,
	closeIcon,
	onPopupPreBooking,
	onPopupContinueBooking,
	isLoading,
}) {
	return (
		<Dialog
			sx={{ width: "510px", margin: "auto" }}
			open={open}
			onClose={close}
			className={styles.dialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title" className={styles.closenbtn}>
				<Button className={styles.closebtns}>
					<AiOutlineClose onClick={() => closeIcon()} />
				</Button>
			</DialogTitle>
			<DialogTitle id="alert-dialog-title" className={styles.cation}>
				<img src={Caution} width="200px" height="200px" />
			</DialogTitle>
			<DialogTitle id="alert-dialog-title" className={styles.titletext}>
				<p>First Come First Serve</p>
			</DialogTitle>
			<DialogContent>
				<div>
					<DialogContentText
						className={styles.contenttxt}
						id="alert-dialog-description">
						If somebody else completes their booking before you, you
						may lose your prebook slot. So Hurry Up !
					</DialogContentText>
				</div>

				<div className={styles.tcDiv}>
					<Checkbox
						checked={checkbox}
						size="small"
						onChange={(e) => setCheckbox(e.target.checked)}
						style={{ marginLeft: "4px", color: "#f3cf00" }}
					/>
					<a
						target="__blank"
						href={"/user/termsconditons"}
						className={styles.terms}
						style={{ textDecoration: "none" }}>
						Terms & conditions
					</a>
				</div>
				{checkbox === false && (
					<p style={{ color: "red", textAlign: "center" }}>
						You must accept the terms and conditions
					</p>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					type="button"
					onClick={() => onPopupPreBooking()}
					autoFocus
					disabled={isLoading || checkbox === false}
					className={styles.nobtn}>
					Pre-Book Now
				</Button>
				<Button
					type="button"
					className={styles.yesbtn}
					disabled={isLoading || checkbox === false}
					onClick={() => onPopupContinueBooking()}>
					Continue to Book
				</Button>
			</DialogActions>
		</Dialog>
	);
}
export default PreBookingPopup;
