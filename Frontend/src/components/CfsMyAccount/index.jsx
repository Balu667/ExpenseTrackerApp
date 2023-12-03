import styles from "../../views/User/MyAccount/index.module.css";
import Form from "react-bootstrap/Form";
import Loader from "../Loader/Loader";
import { useGetCfsProfileData } from "../../hooks/cfs";
import { useCountries } from "../../hooks/country";
import { keyMatchLoop } from "../../helper";

function MyAccount() {
	const id = localStorage.getItem("allMasterId");

	const { data: countryList, isLoading: countryLoading } = useCountries();

	const { isLoading, data: profileData } = useGetCfsProfileData(id);

	if (isLoading || countryLoading) {
		return <Loader />;
	}

	return (
		<div className={styles.mainbody}>
			<div className={`container ${styles.containerdiv}`}>
				<h1>My Account</h1>
			</div>
			<div className={`container ${styles.accountsubdiv}`}>
				<div className={styles.personalcon}>
					<div className={styles.personaldiv}>
						<h2>Personal Details</h2>
					</div>
					<div className={styles.detailsdiv}>
						<div className={styles.fromdiv}>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									htmlFor="fullName"
									className={styles.formlabel}>
									Name
								</Form.Label>
								<Form.Control
									value={profileData.fullName}
									type="text"
									id="fullName"
									disabled={true}
									style={{ textTransform: "capitalize" }}
									className={styles.disable}
								/>
							</Form.Group>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									htmlFor="email"
									className={styles.formlabel}>
									Email
								</Form.Label>
								<Form.Control
									value={profileData.email}
									type="text"
									id="email"
									disabled={true}
									className={styles.disable}
								/>
							</Form.Group>
						</div>
						<div className={styles.fromdiv}>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									htmlFor="Company Name"
									className={styles.formlabel}>
									Cfs Name
								</Form.Label>
								<Form.Control
									value={profileData.cfsName}
									type="text"
									id="Company Name"
									disabled={true}
									style={{ textTransform: "capitalize" }}
									className={styles.disable}
								/>
							</Form.Group>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									htmlFor="cfsBranchName"
									className={styles.formlabel}>
									Cfs Branch Name
								</Form.Label>
								<Form.Control
									value={profileData.cfsBranch}
									type="text"
									id="cfsBranchName"
									disabled={true}
									style={{ textTransform: "capitalize" }}
									className={styles.disable}
								/>
							</Form.Group>
						</div>
						<div className={styles.fromdiv}>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									htmlFor="country"
									className={styles.formlabel}>
									Country
								</Form.Label>
								<Form.Control
									type="text"
									id="country"
									value={
										keyMatchLoop(
											"_id",
											countryList,
											profileData.countryName
										).countryName
									}
									style={{ textTransform: "capitalize" }}
									disabled={true}
									className={styles.disable}
								/>
							</Form.Group>
							<Form.Group className={styles.formgroup}>
								<Form.Label
									htmlFor="mobileNumber"
									className={styles.formlabel}>
									Mobile Number
								</Form.Label>
								<Form.Control
									value={profileData.mobileNo}
									type="text"
									id="mobileNumber"
									disabled={true}
									className={styles.disable}
								/>
							</Form.Group>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyAccount;
