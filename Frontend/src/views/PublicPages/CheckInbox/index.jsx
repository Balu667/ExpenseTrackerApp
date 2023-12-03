import styles from "./index.module.css";
import CheckInboxLogo from "../../../assets/Images/inbox.png";
import { Link } from "react-router-dom";

function CheckInbox() {
	return (
		<div className="container flexdiv">
			<form id="form" className={`${styles.forms} forms`}>
				<img
					className={styles.logodiv}
					src={CheckInboxLogo}
					alt="Inbox Logo"
				/>
				<div className={styles.inboxbody}>
					<h5 className={styles.Checktxt}>Check your Inbox</h5>
					<h6 className={styles.newpasswordtxt}>
						for your new password
					</h6>
					<p className={styles.note}>
						<span>Note</span> : If you can`t find the mail in your
						inbox, kindly check your SPAM
					</p>
					<Link to="/login" className={styles.backtologin}>
						Back to Login
					</Link>
				</div>
			</form>
		</div>
	);
}

export default CheckInbox;
