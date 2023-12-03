import styles from "./index.module.css";
import Accountlogo from "../../../assets/Images/Accountlogo.png";
import Button from "react-bootstrap/Button";

function AccountVerified() {
	return (
		<div className={`'container' ${styles.flexdiv}`}>
			<form id="form" className={`${styles.forms} ${styles.formdivs}`}>
				<img src={Accountlogo} alt="" />
				<div className={styles.accbody}>
					<h5 className={styles.acctxt}>Account Verified</h5>
					<h6 className={styles.newpasswordtxt}>
						Complete your payment
					</h6>
					<p className={styles.Complete}>
						to get started with your bookings
					</p>
					<div className={styles.accbtns}>
						<Button variant="primary" id="PayOffline">
							Pay Offline<br></br>
							<span>Activates in 5-7 Days</span>
						</Button>
						<Button variant="primary" id="payOnline">
							Pay Online<br></br>
							<span>Activates in a Minute</span>
						</Button>
					</div>
					<div className={`${styles.accbtns} ${styles.demoaccount}`}>
						<div>
							<h1 className={styles.demoaccounttxt}>
								Demo Account
							</h1>
							<p className={styles.youwanttxt}>
								You won`&aspos`t be able to make bookings on the
								Demo Interface
							</p>
						</div>
						<Button className={styles.explorebtn}>Explore</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default AccountVerified;
