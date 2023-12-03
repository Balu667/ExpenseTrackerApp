import React from "react";
import "./index.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ContainerFillingStatus from "../ContainerFillingStatus/ContainerFillingStatus";
import { calculateCurrentPriceBySchedule, keyMatchLoop } from "../../helper";
import moment from "moment/moment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function BookingDetail({
	bookingList,
	toggleDrawer,
	laneList,
	detailScheduleHandler,
	scheduleData,
	bookedCbm = 1,
	bookedPriceData,
	activeCard,
	index,
	type = "dashboard",
}) {
	const {
		bookedOCFS = 0,
		bookedFreight = 0,
		bookedDCFS = 0,
	} = bookedPriceData ?? {};

	const bookedWithoutDocTotal = Math.round(
		bookedOCFS + bookedFreight + bookedDCFS
	);

	const polName = keyMatchLoop(
		"_id",
		laneList,
		scheduleData.pol
	).portCode.toUpperCase();
	const podName = keyMatchLoop(
		"_id",
		laneList,
		scheduleData.pod
	).portCode.toUpperCase();

	scheduleData = calculateCurrentPriceBySchedule(bookingList, scheduleData);

	const podState = keyMatchLoop("_id", laneList, scheduleData.pod).portName;

	const polState = keyMatchLoop("_id", laneList, scheduleData.pol).portName;

	const startPrice = Math.round(
		scheduleData.finalRates.FOCFS +
			scheduleData.finalRates.FF +
			scheduleData.finalRates.FDCFS
	);
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

	const currentPrice = Math.round(
		scheduleData.originCurrentPrice +
			scheduleData.frightCurrentPrice +
			scheduleData.destinationCurrentPrice
	);

	const bookingFilled = Math.round(
		((scheduleData.volume -
			(scheduleData.volume - scheduleData.totalCbmBooked)) /
			scheduleData.volume) *
			100
	);

	const today = moment().format("DD/MM/YYYY");

	const bookingCutOff = moment(scheduleData.bookingCutOff).format(
		"DD/MM/YYYY"
	);

	const dateTodayOrTomorrow = moment(today, "DD/MM/YYYY").diff(
		moment(bookingCutOff, "DD/MM/YYYY"),
		"days"
	);

	const leftCbm = () => {
		const bookedCbm = scheduleData.volume - scheduleData.totalCbmBooked;
		if (Number.isInteger(bookedCbm)) {
			return Number(bookedCbm);
		} else {
			return Number(bookedCbm).toFixed(1);
		}
	};
	return (
		<div
			className={`detailcon ${
				type === "dashboard" ? "dashboard" : "comman"
			} ${
				activeCard === index && type === "dashboard" ? "activeCard" : ""
			}
				${type === "checkout" || type === "viewBooking" ? "checkout" : ""} `}
			onClick={() => {
				if (type === "dashboard") {
					detailScheduleHandler(scheduleData, index);
					toggleDrawer();
				}
			}}>
			<div className="detaildiv">
				<div className="portalignments">
					<div>
						<div className="portdiv">
							<div>
								<h1 className="portstate">{polState}</h1>
								<h1
									className={`portsdetail ${
										type !== "dashboard" ? "noellips" : ""
									}`}>
									{polName}
								</h1>
							</div>
							<div className="splitdiv">
								<div>-</div>
							</div>
							<div>
								<h1 className="portstate">{podState}</h1>
								<h1
									className={`portsdetail ${
										type !== "dashboard" ? "noellips" : ""
									}`}>
									{podName}
								</h1>
							</div>
						</div>

						{(type === "checkout" || type === "viewBooking") && (
							<p className="cbmsdetails">
								Booked Capacity
								<span>&nbsp;{bookedCbm} CBM</span>
							</p>
						)}
					</div>
					{type === "dashboard" && (
						<>
							{scheduleData.totalCbmBooked >=
								scheduleData.volume || leftCbm() < 1 ? (
								<div className="fullybooked">
									<p className="fullybookedtxt">
										Fully Booked
									</p>
								</div>
							) : (
								<div className="etddatediv">
									<div
										className={`${
											dateTodayOrTomorrow === 0
												? "today"
												: dateTodayOrTomorrow === -1
												? "tomorrow"
												: ""
										} etddate`}>
										Expiry On:
										{moment(
											scheduleData.bookingCutOff
										).format("DD-MM-YYYY")}
									</div>
									<div
										className={`${
											dateTodayOrTomorrow === 0
												? "today"
												: dateTodayOrTomorrow === -1
												? "tomorrow"
												: ""
										} etddate`}>
										ETD:
										{moment(scheduleData.etd).format(
											"DD-MM-YYYY"
										)}
									</div>
								</div>
							)}
						</>
					)}
				</div>
				<p className="cbmsdetail">
					Capacity Available{" "}
					<span>
						{leftCbm()}
						CBM
					</span>
				</p>
				<div className="containerdetail">
					<div>
						<ContainerFillingStatus now={bookingFilled} />
						<h5 className="containertxt">
							Container Filled so far
						</h5>
					</div>
					<div>
						<div className="pricecon">
							<div>
								<h5 className="start">
									{type !== "viewBooking"
										? "Start"
										: "Booked"}
								</h5>
								<h1 className="startval">
									$
									{type !== "viewBooking"
										? startPrice
										: bookedWithoutDocTotal}
								</h1>
							</div>
							<div>
								<h5 className="start current">Current</h5>
								<h1 className="startval d-flex align-items-center">
									<Tooltip title="Price is subject to change">
										<IconButton>
											<AiOutlineInfoCircle
												color="#F4DA47"
												className="infoicon"
											/>
										</IconButton>
									</Tooltip>
									${currentPrice}
								</h1>
							</div>
							<div>
								<h5 className="start">Predicted</h5>
								<h1 className="startval d-flex align-items-center">
									${predictedPrice}
								</h1>
							</div>
						</div>
						<p className="ratesmentaion">
							Rates mentioned are per CBM{" "}
						</p>
					</div>
				</div>
				{type === "dashboard" && (
					<div className="chargeinclude">
						<p className="chargeincludetxt">
							Origin + Freight + Destination charges included
						</p>
					</div>
				)}
			</div>
			{type === "dashboard" && (
				<div className="vesseldiv">
					<div className="aditional">
						<h5 className="vesseltxt">Prebookings</h5>
						<h1 className="vesselval">
							{scheduleData.preBookingCount}
							<span>
								{scheduleData.preBookingCount !== 0 &&
									` (${scheduleData.preBookingCbmBooked} CBM)`}
							</span>
						</h1>
					</div>
					<div className="aditional">
						<h5 className="vesseltxt">Service name</h5>
						<h1 className="vesselval">
							{scheduleData?.serviceName}
						</h1>
					</div>
					{scheduleData.otherCost?.OCOMName && (
						<div className="aditional">
							<h5 className="vesseltxt vesseltexts">
								{scheduleData.otherCost.OCOMName}
							</h5>
							<h1 className="vesselval">
								${scheduleData.predictionRates.POR}
							</h1>
						</div>
					)}
					<div className="aditional">
						<h5 className="vesseltxt">Booking Fee</h5>
						<h1 className="vesselval">$25</h1>
					</div>
				</div>
			)}
			{type !== "dashboard" && (
				<div
					className={`vessel ${
						type === "checkout" || type === "viewBooking"
							? "checkoutborder"
							: ""
					}`}>
					<div className="ship">
						<p>Vessel</p>
						<h4 style={{ textTransform: "capitalize" }}>
							{scheduleData.vessel + " " + scheduleData.voyage}{" "}
						</h4>
					</div>
					<div className="cutoffdiv">
						<div className="cutoff">
							<p>Cut Off</p>
							<h4
								className={
									dateTodayOrTomorrow === 0
										? "today"
										: dateTodayOrTomorrow === -1
										? "tomorrow"
										: ""
								}>
								{moment(scheduleData.bookingCutOff).format(
									"DD-MM-YYYY"
								)}
							</h4>
						</div>
						<div className="cutoff">
							<p>ETD</p>
							<h4>
								{moment(scheduleData.etd).format("DD-MM-YYYY")}
							</h4>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default BookingDetail;
