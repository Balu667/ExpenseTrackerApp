import styles from "./index.module.css";
import { useLane } from "../../hooks/lane";
import { CircularProgress } from "@mui/material";
import VerticalStepper from "../../components/VerticalStepper/index";
import BookingDetail from "../BookingDetail";
import RateViewTable from "..//RateViewTable";

export function SummaryRateCard({
	scheduleData,
	cargoDetails,
	proceedOnClick,
	bookingList,
	type = "checkout",
	containerWidth,
}) {
	const { data: laneList, isLoading } = useLane();

	if (isLoading) {
		return <CircularProgress />;
	}
	return (
		<div
			className={`${styles.contentdiv} ${
				containerWidth ? styles.contentdivcon : ""
			}`}>
			{type === "checkout" && <h2 className={styles.title}>Summary</h2>}
			<div
				className={`${styles.contentcontainer} ${
					containerWidth ? styles.contentdivcon : ""
				}`}>
				{type !== "cfs" && (
					<div
						className={`${styles.ratecarddiv} ${
							containerWidth ? styles.ratecarddivcontainer : ""
						}`}>
						<div className={styles.ratecard}>
							<BookingDetail
								bookingList={bookingList}
								laneList={laneList}
								bookedCbm={cargoDetails.totalCbm}
								scheduleData={scheduleData}
								bookedPriceData={cargoDetails?.bookedPrice}
								type={type}
							/>
							<RateViewTable
								scheduleRateData={scheduleData}
								bookedCbm={cargoDetails.totalCbm}
								type={type}
								bookedPriceData={cargoDetails?.bookedPrice}
							/>
						</div>

						{type === "checkout" && (
							<div className={styles.Proceed}>
								<button
									className={styles.Proceedbtn}
									onClick={proceedOnClick}>
									Confirm Booking
								</button>
							</div>
						)}
					</div>
				)}
				<div
					className={`${styles.stepdiv} ${
						containerWidth ? styles.stepdivcon : ""
					}`}>
					<div className={styles.stepperdiv}>
						<VerticalStepper scheduleData={scheduleData} />
					</div>
				</div>
			</div>
		</div>
	);
}
