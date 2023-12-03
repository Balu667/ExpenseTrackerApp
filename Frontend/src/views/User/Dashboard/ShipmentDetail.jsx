import React, { useState } from "react";
import ContainerFillingStatus from "../../../components/ContainerFillingStatus/ContainerFillingStatus";
import DiscreteSliderMarks from "../../../components/Slider/Slider";
import { AiOutlineClose } from "react-icons/ai";
import VerticalStepper from "../../../components/VerticalStepper/index";
import { keyMatchLoop } from "../../../helper";
import { useNavigate } from "react-router-dom";
import { useSearchStatus } from "../../../hooks/dashboard";
import styles from "./index.module.css";
import { useDispatch } from "react-redux";
import RateViewTable from "../../../components/RateViewTable";
import { removeAllDetails } from "../../../redux/slices/checkoutSlice";
import moment from "moment";

export const ShipmentDetail = ({ scheduleData, popup, setPopup, laneList }) => {
	const [progress, setProgress] = useState(1);

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const { mutate } = useSearchStatus();

	const createdBy = localStorage.getItem("allMasterId");

	const pol = keyMatchLoop(
		"_id",
		laneList,
		scheduleData.pol
	).portCode.toUpperCase();

	const pod = keyMatchLoop(
		"_id",
		laneList,
		scheduleData.pod
	).portCode.toUpperCase();

	const polState = keyMatchLoop("_id", laneList, scheduleData.pol).portName;

	const podState = keyMatchLoop("_id", laneList, scheduleData.pod).portName;

	const startPrice =
		scheduleData.finalRates.FOCFS +
		scheduleData.finalRates.FDCFS +
		scheduleData.finalRates.FF;

	const predictedOCFS =
		scheduleData.originComparison.ROCFS >=
		scheduleData.originComparison.MROCFS
			? Math.round(scheduleData.finalRates.USDOCFS / scheduleData.volume)
			: scheduleData.predictionRates.POCFS;

	const predictedF =
		scheduleData.freightComparison.RF >= scheduleData.freightComparison.MRF
			? Math.round(scheduleData.freightCost.F / scheduleData.volume)
			: scheduleData.predictionRates.PF;

	const predictedDCFS =
		scheduleData.destinationComparison.RDCFS >=
		scheduleData.destinationComparison.MRDCFS
			? Math.round(scheduleData.finalRates.USDDCFS / scheduleData.volume)
			: scheduleData.predictionRates.PDCFS;

	const predictedPrice = Math.round(
		predictedOCFS + predictedF + predictedDCFS
	);

	const currentPrice =
		scheduleData.originCurrentPrice +
		scheduleData.destinationCurrentPrice +
		scheduleData.frightCurrentPrice;

	const bookingFilled = Math.round(
		((scheduleData.volume -
			(scheduleData.volume - scheduleData.totalCbmBooked)) /
			scheduleData.volume) *
			100
	);

	const leftCbm = () => {
		const bookedCbm = scheduleData.volume - scheduleData.totalCbmBooked;
		if (Number.isInteger(bookedCbm)) {
			return Number(bookedCbm);
		} else {
			return Number(bookedCbm).toFixed(1);
		}
	};

	const savings =
		progress === 0
			? 0
			: Math.round(
					(scheduleData.savingRates.SOCFS +
						scheduleData.savingRates.SDCFS +
						scheduleData.savingRates.SF) *
						progress +
						scheduleData.savingRates.SDDO +
						scheduleData.savingRates.SODOC +
						(scheduleData.savingRates.SOR ?? 0)
			  );

	return (
		<>
			{" "}
			<div className={styles.popupdiv}>
				<div className={styles.rightdeawerdiv}>
					<div className={styles.header}>
						<h4>Shipment Details</h4>
						<button
							onClick={() => {
								setPopup(!popup);
							}}
							type="button">
							<AiOutlineClose />
						</button>
					</div>
					<div className={styles.port}>
						<div className={styles.flex}>
							<div className={styles.portdiv}>
								<div>
									<h1 className={styles.portstate}>
										{polState}
									</h1>
									<h1 className={styles.portsdetail}>
										{pol}
									</h1>
								</div>
								<div className={styles.splitdiv}>
									<div>-</div>
								</div>
								<div>
									<h1 className={styles.portstate}>
										{podState}
									</h1>
									<h1 className={styles.portsdetail}>
										{pod}
									</h1>
								</div>
							</div>
							<p className={styles.etd}>
								ETD:{" "}
								{moment(scheduleData.etd).format("DD-MM-YYYY")}
							</p>
						</div>
						<p>
							Capacity Available{" "}
							<span>
								{leftCbm()}
								CBM
							</span>
						</p>
					</div>
					<div className={styles.containerdiv}>
						<div className={styles.containerbox}>
							<ContainerFillingStatus now={bookingFilled} />
							<p>Container Filled so far</p>
						</div>
						<div className={styles.containertxt}>
							<div className={styles.ratedetails}>
								<div className={styles.start}>
									<p>Start</p>
									<h3>${startPrice}</h3>
								</div>
								<div className={styles.start}>
									<p>Current</p>
									<h3>${currentPrice}</h3>
								</div>
								<div className={styles.start}>
									<p>Predicted</p>
									<h3>${predictedPrice}</h3>
								</div>
							</div>
							<p>Rates mentioned are per CBM </p>
						</div>
					</div>
				</div>
				<div className={styles.prograssdiv}>
					<div className={styles.prograsscontainer}>
						<div className={styles.savingcal}>
							<p className={styles.savingcalcbm}>
								CBM Savings Calculator
							</p>
							<p className={styles.willsave}>
								Potential savings of <span>${savings}</span>{" "}
								calculated against the market rate
							</p>
						</div>
						<div className={styles.savingcal}>
							<p className={styles.yourbooking}>Your Booking</p>
							<div className={styles.savingcalval}>
								<p className={styles.savingcalvalue}>
									{progress}
								</p>
								<p className={styles.savingcbm}>CBM</p>
							</div>
						</div>
					</div>
					<div>
						<DiscreteSliderMarks
							onchange={(e) => setProgress(e.target.value)}
							max={Number(import.meta.env.VITE_MaxBookingVolume)}
						/>
					</div>
				</div>
				<div className={styles.breakupdiv}>
					<h4>Charges Breakup</h4>
					<RateViewTable
						scheduleRateData={scheduleData}
						type={"dashboard"}
					/>
				</div>
				<div className={styles.stepperdiv}>
					<VerticalStepper scheduleData={scheduleData} />
				</div>
			</div>
			<div className={styles.continuebtndiv}>
				{scheduleData.volume - scheduleData.totalCbmBooked >= 1 && (
					<button
						className={styles.continuebtn}
						disabled={scheduleData.totalCbmBooked === 62}
						onClick={() => {
							dispatch(removeAllDetails());
							mutate({
								pol: scheduleData.pol,
								pod: scheduleData.pod,
								status: 3,
								createdBy,
								scheduleId: scheduleData._id,
							});
							navigate(
								"/user/booking/" + scheduleData._id + "#1"
							);
						}}>
						Continue to Book
					</button>
				)}
			</div>
		</>
	);
};
