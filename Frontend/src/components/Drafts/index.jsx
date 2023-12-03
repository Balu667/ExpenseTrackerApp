import React from "react";
import styles from "./index.module.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ContainerFillingStatus from "../ContainerFillingStatus/ContainerFillingStatus";
import { ReactComponent as Goldrightaerrow } from "../../assets/Icons/Goldrightaerrow.svg";

function Drafts({
	portName,
	cbm,
	startPrice,
	currentPrice,
	predictedPrice,
	bookingFees,
	CostHading,
	nowValue,
	ETD,
}) {
	return (
		<div className={styles.detailcon}>
			<div className={styles.detaildiv}>
				<div className={styles.portalignments}>
					<div>
						<h1 className={styles.portsdetail}>{portName}</h1>
						<p className={styles.cbmsdetail}>
							Capacity Available <span>{cbm} CBM</span>{" "}
						</p>
					</div>
					<div className={styles.etdeta}>
						<p>ETD</p>
						<h4>{ETD}</h4>
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
									<AiOutlineInfoCircle
										color="#F4DA47"
										className={styles.infoicon}
									/>
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
				<div className={styles.costheadingdiv}>
					<h5 className={styles.vesseltxt}>Cost Heading</h5>
					<h1 className={styles.vesselval}>${CostHading}</h1>
				</div>
				<div className={styles.booknowdiv}>
					<div>
						<p className={styles.leftat}>Left at</p>
						<h4 className={styles.cargoleft}>Cargo Docs</h4>
					</div>
					<div>
						<button className={styles.booknowbtn}>
							Book Now <Goldrightaerrow />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Drafts;
