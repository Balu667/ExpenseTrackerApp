import styles from "./index.module.css";
import Verification from "../../../assets/Images/Verificationlogo.png";
import { CircularProgress } from "@mui/material";
import { useLogoutUser } from "../../../hooks/userAuthManagement";

function VerificationPage() {
	const { mutate, isLoading } = useLogoutUser();

	return (
		<div className={`container ${styles.flexdiv} pt-5`}>
			<form id="form" className={styles.forms}>
				<img src={Verification} alt="" />
				<div className={styles.verificationbody}>
					<h5 className={styles.veritxt}>Verification</h5>
					<h6 className={styles.newpasswordtxt}>takes upto 24 hrs</h6>
					<p className={styles.since}>
						Since all your docs will be manually<br></br> verified
						by our Team
					</p>
					<button
						onClick={(e) => {
							e.preventDefault();
							mutate();
						}}
						disabled={isLoading}
						className={styles.loginbtn}
						id="backtohome">
						{isLoading ? <CircularProgress /> : "Back to Login"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default VerificationPage;
