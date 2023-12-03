import styles from "./index.module.css";
import { ReactComponent as Phone } from "../../assets/Icons/phone.svg";
import { ReactComponent as Mail } from "../../assets/Icons/mail.svg";

function AddressCard({
	logistics,
	mail,
	phone,
	name,
	Ccode,
	address,
	shipperName,
	shipper,
}) {
	return (
		<div className={styles.AddressCard}>
			<div className={styles.AddressCardtxt}>
				<h1>{logistics}</h1>
				<p>
					<Mail />
					<span className={styles.emails}>{mail}</span>
				</p>
				<p>
					<Phone />
					{phone}
				</p>
			</div>
			<div className={styles.flexdiv}>
				<div className={styles.name}>
					<p>Name</p>
					<h4>{name}</h4>
				</div>
				<div className={styles.country}>
					<p>{Ccode}</p>
				</div>
			</div>
			{shipper && (
				<div className={styles.flexdiv}>
					<div className={styles.name}>
						<p>Actual Shipper Name</p>
						<h4>{shipperName}</h4>
					</div>
				</div>
			)}
			<div
				className={styles.name}
				style={{ textTransform: "capitalize" }}>
				<p>Address</p>
				<h4>{address}</h4>
			</div>
		</div>
	);
}
export default AddressCard;
