import React from "react";
import styles from "./index.module.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ContainerFillingStatus from "../ContainerFillingStatus/ContainerFillingStatus";
import { ReactComponent as Goldrightaerrow } from "../../assets/Icons/Goldrightaerrow.svg";
import { ReactComponent as Prebook } from "../../assets/Icons/prebook.svg";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import { useSelector } from "react-redux";

function PreBooking({
	startPrice,
	currentPrice,
	predictedPrice,
	bookingFees,
	CostHading,
	CostHadingName,
	nowValue,
	ETD,
	scheduleData,
	bookingId,
	onViewDetailsClick,
	bookingDate,
	polCode,
	podCode,
	polName,
	podName,
}) {
	const leftCbm = () => {
		const bookedCbm = scheduleData.volume - scheduleData.totalCbmBooked;
		if (Number.isInteger(bookedCbm)) {
			return Number(bookedCbm);
		} else {
			return Number(bookedCbm).toFixed(1);
		}
	};

	const selectedCard = useSelector(
		(state) => state.myBookingsCard.selectedCard
	);

	return (
		<div
			className={`${styles.detailcon} ${
				bookingId === selectedCard
					? styles.selectedCard + " is-selected"
					: ""
			}`}>
			<div className={styles.detaildiv}>
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
					</div>
					<div className={styles.etdeta}>
						<p className={styles.prebooking}>
							<Prebook /> Pre-Booking{" "}
							<span className={styles.bookingdate}>
								({moment(bookingDate).format("DD-MM-YYYY")})
							</span>
						</p>
						<p className={styles.bookingid}>{bookingId}</p>
					</div>
				</div>
				<p className={styles.cbmsdetail}>
					Capacity Available <span>{leftCbm()} CBM</span>
				</p>
				<div className={styles.containerdetail}>
					<div>
						<ContainerFillingStatus now={nowValue} />
						<h5 className={styles.containertxt}>
							Container Filled so far
						</h5>
					</div>
					<div>
						<div className={styles.pricelist}>
							<div>
								<h5 className={styles.start}>Start</h5>
								<h1 className={styles.startval}>
									${startPrice}
								</h1>
							</div>
							<div>
								<h5 className={styles.start}>Current</h5>
								<h1
									className={`${styles.startval} ${styles.current}`}>
									<Tooltip title="Price is subject to change">
										<IconButton className={styles.infoIcon}>
											<AiOutlineInfoCircle
												color="#F4DA47"
												className={styles.infoicon}
											/>
										</IconButton>
									</Tooltip>
									${currentPrice}
								</h1>
							</div>
							<div>
								<h5 className={styles.start}>Predicted</h5>
								<h1
									className={`${styles.startval} ${styles.current}`}>
									${predictedPrice}
								</h1>
							</div>
						</div>
						<p className={styles.ratestxt}>
							Rates mentioned are per CBM{" "}
						</p>
					</div>
				</div>
				<div className={styles.chargeinclude}>
					<p className={styles.chargeincludetxt}>
						Origin + Freight + Destination charges included
					</p>
				</div>
			</div>
			<div className={styles.vessel}>
				<div className={styles.costheadingdiv}>
					<h5 className={styles.vesseltxt}>Booking Fees</h5>
					<h1 className={styles.vesselval}>${bookingFees}</h1>
				</div>
				{CostHadingName != null && (
					<div className={styles.costheadingdiv}>
						<h5 className={styles.vesseltxt}>{CostHadingName}</h5>
						<h1 className={styles.vesselval}>${CostHading}</h1>
					</div>
				)}
				<div className={styles.booknowdiv}>
					<div>
						<p className={styles.leftat}>ETD</p>
						<h4 className={styles.cargoleft}>{ETD}</h4>
					</div>
					<div>
						<button
							className={styles.booknowbtn}
							onClick={onViewDetailsClick}>
							Book Now <Goldrightaerrow />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PreBooking;
