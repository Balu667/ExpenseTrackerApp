import React from "react";
import styles from "./index.module.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
// import { BsThreeDotsVertical } from "react-icons/bs";
import ContainerFillingStatus from "../ContainerFillingStatus/ContainerFillingStatus";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function BookingDetail({
	scheduleId,
	cbm,
	startPrice,
	currentPrice,
	predictedPrice,
	paymentCompleted,
	chargeOne,
	chargeTwo,
	nowValue,
	ETA,
	ETD,
	url,
	polCode,
	podCode,
	polName,
	podName,
	type = "admin",
}) {
	const navigate = useNavigate();
	const sample = () => {
		const cbmValue = Number(cbm);
		if (Number.isInteger(cbmValue)) {
			return Number(cbmValue);
		} else {
			return Number(cbmValue).toFixed(1);
		}
	};
	return (
		<div
			className={`${styles.detailcon} ${
				type !== "admin" ? styles.cfs : styles.adminstyle
			}`}>
			<div className={styles.detaildiv}>
				<div className={styles.portalignments}>
					<p className={styles.scheduleid}>{scheduleId}</p>
					{/* <BsThreeDotsVertical className={styles.scheduleidicon} /> */}
				</div>
				<div className={styles.portalignments}>
					<div>
						<div className={styles.portdiv}>
							<div>
								<h1 className={styles.portstate}>{polName}</h1>
								<h1 className={styles.portsdetail}>
									{polCode}
								</h1>
							</div>

							<div className={styles.splitdiv}>
								<div>-</div>
							</div>

							<div>
								<h1 className={styles.portstate}>{podName}</h1>
								<h1 className={styles.portsdetail}>
									{podCode}
								</h1>
							</div>
						</div>
						<p className={styles.cbmsdetail}>
							CBMs Available <span>{sample()}</span>{" "}
						</p>
					</div>
					<div className={styles.etdeta}>
						<p>ETD:{ETD}</p>
						<p>ETA:{ETA}</p>
					</div>
				</div>
				<div className={styles.containerdetail}>
					<div>
						<ContainerFillingStatus now={nowValue} />
						<h5 className={styles.containertxt}>
							Container Filled so far
						</h5>
					</div>
					<div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								gap: "20px",
							}}>
							{type === "admin" && (
								<div>
									<h5 className={styles.start}>Start</h5>
									<h1 className={styles.startval}>
										${startPrice}
									</h1>
								</div>
							)}
							{type === "admin" && (
								<div>
									<h5 className={styles.start}>Current</h5>
									<h1
										className={`${styles.startval} ${styles.current}`}>
										<Tooltip title="Price is subject to change">
											<IconButton
												className={styles.infoicon}>
												<AiOutlineInfoCircle
													color="#F4DA47"
													className={styles.infoicon}
												/>
											</IconButton>
										</Tooltip>
										${currentPrice}
									</h1>
								</div>
							)}
							{type === "admin" && (
								<div>
									<h5 className={styles.start}>Predicted</h5>
									<h1
										className={`${styles.startval} ${styles.current}`}>
										${predictedPrice}
									</h1>
								</div>
							)}
						</div>
						{type === "admin" && (
							<p className={styles.rates}>
								Rates mentioned are per CBM{" "}
							</p>
						)}
					</div>
				</div>
				{type === "admin" && (
					<div className={styles.chargeinclude}>
						<p className={styles.chargeincludetxt}>
							Origin + Freight + Destination charges included
						</p>
					</div>
				)}
			</div>
			<div className={styles.vessel}>
				{type === "admin" && (
					<div className={styles.containerdetail}>
						<h5 className={styles.vesseltxt}>Pre Booking</h5>
						<h1 className={styles.vesselval}>{chargeOne}</h1>
					</div>
				)}
				<div className={styles.containerdetail}>
					<h5 className={styles.vesseltxt}>Confirm Booking</h5>
					<h1 className={styles.vesselval}>{chargeTwo}</h1>
				</div>
				{type === "admin" && (
					<div className={styles.containerdetail}>
						<h5 className={styles.vesseltxt}>Payment Completed</h5>
						<h1 className={styles.vesselval}>{paymentCompleted}</h1>
					</div>
				)}
				<div className={styles.viewbtndiv}>
					<button
						type="button"
						className={styles.view}
						onClick={() => navigate(url)}>
						View
					</button>
				</div>
			</div>
		</div>
	);
}

export default BookingDetail;
