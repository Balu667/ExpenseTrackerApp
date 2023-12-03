import { TreeItem, TreeView } from "@mui/lab";
import { styled } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import styles from "../../views/User/Dashboard/index.module.css";

const StyledTreeItem = styled(TreeItem)`
	.MuiTreeItem-content {
		flex-direction: row-reverse;
		width: auto;
		justify-content: center !important;
	}
`;

export default function RateViewTable({
	scheduleRateData,
	bookedCbm = 1,
	type = "dashboard",
	bookedPriceData,
}) {
	function multiplyCbm(number) {
		return Math.round(number * bookedCbm);
	}

	const {
		bookedOCFS = 0,
		bookedFreight = 0,
		bookedDCFS = 0,
	} = bookedPriceData ?? {};

	function returnTotal() {
		const fullTotalPerContainer =
			scheduleRateData.originCurrentOCFS +
			scheduleRateData.frightCurrentPrice +
			scheduleRateData.destinationCurrentCFS;
		let fullTotalDoc =
			scheduleRateData.finalRates.FODOC +
			scheduleRateData.finalRates.FDDO +
			25;
		if (scheduleRateData.otherCost?.OCOMName) {
			fullTotalDoc = fullTotalDoc + scheduleRateData.predictionRates.POR;
		}
		// const fullTotalWithoutCBM = fullTotalPerContainer + fullTotalDoc;
		const fullTotalWithCBM =
			fullTotalPerContainer * bookedCbm + fullTotalDoc;
		return `$${Math.round(fullTotalWithCBM)}`;
	}
	const predictedOCFS =
		scheduleRateData.originComparison.ROCFS >=
		scheduleRateData.originComparison.MROCFS
			? Math.round(
					scheduleRateData.finalRates.USDOCFS /
						scheduleRateData.volume
			  )
			: scheduleRateData.predictionRates.POCFS;

	const predictedF =
		scheduleRateData.freightComparison.RF >=
		scheduleRateData.freightComparison.MRF
			? Math.round(
					scheduleRateData.freightCost.F / scheduleRateData.volume
			  )
			: scheduleRateData.predictionRates.PF;

	const predictedDCFS =
		scheduleRateData.destinationComparison.RDCFS >=
		scheduleRateData.destinationComparison.MRDCFS
			? Math.round(
					scheduleRateData.finalRates.USDDCFS /
						scheduleRateData.volume
			  )
			: scheduleRateData.predictionRates.PDCFS;

	return (
		<div
			className={
				type === "checkout" || type === "viewBooking"
					? styles.rateviewdiv
					: ""
			}>
			<div className={styles.breakuptitle}>
				<div className={styles.titlehead}>
					<div className={styles.titleheaddiv}>
						<p>
							{type === "dashboard"
								? "PER CBM CHARGES"
								: "Charges"}
						</p>
					</div>
					<div className={styles.titleheaddiv1}>
						<p>{type !== "viewBooking" ? "Start" : "Booked"}</p>
						<p>Current</p>
						<p>Predicted</p>
					</div>
				</div>
			</div>
			<div>
				<TreeView
					multiSelect
					defaultExpandIcon={<ExpandMore />}
					defaultCollapseIcon={<ExpandLess />}>
					<StyledTreeItem
						nodeId="1"
						label={
							<div className={styles.titlebody}>
								<div className={styles.titlebodydiv}>
									<p className={styles.titletext}>
										Origin Handling
									</p>
									<p className={styles.pricedetail}>
										$
										{type !== "viewBooking"
											? multiplyCbm(
													scheduleRateData.finalRates
														.FOCFS
											  )
											: multiplyCbm(bookedOCFS)}
									</p>
									<p className={styles.pricedetail}>
										$
										{multiplyCbm(
											scheduleRateData.originCurrentOCFS
										)}
									</p>
									<p className={styles.pricedetail}>
										${multiplyCbm(predictedOCFS)}
									</p>
								</div>
							</div>
						}
					/>
					<StyledTreeItem
						nodeId="2"
						label={
							<div className={styles.titlebody}>
								<div className={styles.titlebodydiv}>
									<p className={styles.titletext}>
										Ocean Freight
									</p>
									<p className={styles.pricedetail}>
										$
										{type !== "viewBooking"
											? multiplyCbm(
													scheduleRateData.finalRates
														.FF
											  )
											: multiplyCbm(bookedFreight)}
									</p>
									<p className={styles.pricedetail}>
										$
										{multiplyCbm(
											scheduleRateData.frightCurrentPrice
										)}
									</p>
									<p className={styles.pricedetail}>
										${multiplyCbm(predictedF)}
									</p>
								</div>
							</div>
						}
					/>
					<StyledTreeItem
						nodeId="3"
						label={
							<div className={styles.titlebody}>
								<div className={styles.titlebodydiv}>
									<p className={styles.titletext}>
										Destination Handling
									</p>
									<p className={styles.pricedetail}>
										$
										{type !== "viewBooking"
											? multiplyCbm(
													scheduleRateData.finalRates
														.FDCFS
											  )
											: multiplyCbm(bookedDCFS)}
									</p>
									<p className={styles.pricedetail}>
										$
										{multiplyCbm(
											scheduleRateData.destinationCurrentCFS
										)}
									</p>
									<p className={styles.pricedetail}>
										${multiplyCbm(predictedDCFS)}
									</p>
								</div>
							</div>
						}
					/>
					<div
						className={`${styles.breakuptitle} ${styles.breakuptitles}`}>
						<div className={styles.titlehead}>
							<div className={styles.ancillary}>
								<p className={styles.ancillarytxt}>
									Per Document
									<br /> Charges
								</p>
							</div>
							<div
								className={`${styles.ancillary} ${styles.charge} ${styles.ancillarydiv}`}>
								<p className={styles.ancillarytxt}>
									Market Rate
								</p>
								<p className={styles.ancillarytxt}>
									AllMasters Rate
								</p>
							</div>
						</div>
					</div>
					<StyledTreeItem
						nodeId="4"
						label={
							<div className={styles.titlebody}>
								<div className={styles.titlebodydiv}>
									<p className={styles.titletext}>
										Origin DOC Fee
									</p>
									<p className={styles.pricedetail}>
										$
										{
											scheduleRateData.originComparison
												?.MRODOCUSD
										}
									</p>
									<p className={styles.pricedetail}>
										${scheduleRateData.finalRates.FODOC}
									</p>
								</div>
							</div>
						}
					/>
					<StyledTreeItem
						nodeId="5"
						label={
							<div className={styles.titlebody}>
								<div className={styles.titlebodydiv}>
									<p className={styles.titletext}>
										Release Fee
									</p>
									<p className={styles.pricedetail}>
										$
										{
											scheduleRateData
												.destinationComparison
												?.MRDDOCUSD
										}
									</p>
									<p className={styles.pricedetail}>
										${scheduleRateData.finalRates.FDDO}
									</p>
								</div>
							</div>
						}
					/>
					{scheduleRateData.otherCost?.OCOMName && (
						<StyledTreeItem
							nodeId="6"
							label={
								<div className={styles.titlebody}>
									<div className={styles.titlebodydiv}>
										<p className={styles.titletext}>
											{scheduleRateData.otherCost.OCOMName.toUpperCase()}
										</p>
										<p className={styles.pricedetail}>
											$
											{
												scheduleRateData.otherComparison
													?.OCOMMR
											}
										</p>
										<p className={styles.pricedetail}>
											$
											{
												scheduleRateData.predictionRates
													.POR
											}
										</p>
									</div>
								</div>
							}
						/>
					)}
					<StyledTreeItem
						nodeId="7"
						label={
							<div className={styles.titlebody}>
								<div className={styles.titlebodydiv}>
									<p className={styles.titletext}>
										{"Booking Fee"}
									</p>

									<p className={styles.pricedetail}>$ 25</p>
								</div>
							</div>
						}
					/>
					{(type === "checkout" || type === "viewBooking") && (
						<StyledTreeItem
							nodeId="8"
							label={
								<div className={styles.titlebody}>
									<div
										className={`${styles.titlebodydiv} ${styles.grandtotal}`}>
										<p className={styles.grandtotal}>
											Grand Total ({bookedCbm} CBM)
										</p>

										<p className={styles.pricedetail}>
											{returnTotal()}
										</p>
									</div>
								</div>
							}
						/>
					)}
				</TreeView>
			</div>
		</div>
	);
}
