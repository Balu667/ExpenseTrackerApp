import { Box, Stepper, Step, StepLabel } from "@mui/material";
import styles from "./index.module.css";
import { ReactComponent as Journey } from "../../assets/Images/journey.svg";
import Loader from "../../components/Loader/Loader";
import { useCFsManagement } from "../../hooks/cfsManagement";
import { keyMatchLoop } from "../../helper";
import moment from "moment/moment";

export default function VerticalStepper({ scheduleData }) {
	const { isLoading: cfsLoading, data: cfsList } = useCFsManagement();

	if (cfsLoading) {
		return <Loader />;
	}

	const orginCfsData = keyMatchLoop(
		"_id",
		cfsList,
		scheduleData.originCfsName
	);

	const destinationCfsData = keyMatchLoop(
		"_id",
		cfsList,
		scheduleData.destinationCfsName
	);

	const ETA = moment(scheduleData.eta);

	const ETD = moment(scheduleData.etd);

	const deliveryDays = ETA.diff(ETD, "days");

	const today = moment().format("DD/MM/YYYY");

	const bookingCutOff = moment(scheduleData.bookingCutOff).format(
		"DD/MM/YYYY"
	);

	const dateTodayOrTomorrow = moment(today, "DD/MM/YYYY").diff(
		moment(bookingCutOff, "DD/MM/YYYY"),
		"days"
	);

	const steps = [
		{
			label: "Booking Cutoff",
			content: (
				<p
					style={{ marginBottom: "0" }}
					className={
						dateTodayOrTomorrow === 0
							? "today"
							: dateTodayOrTomorrow === -1
							? "tomorrow"
							: ""
					}>
					{moment(scheduleData.bookingCutOff).format("DD-MM-YYYY")}
				</p>
			),
		},
		{
			label: "Origin CFS Cutoff",
			content:
				moment(scheduleData.originCfsCutOff).format("DD-MM-YYYY") +
				" | " +
				scheduleData.originCfsClosingtime,
			detail: (
				<div className={styles.stepperdate}>
					<p className="text-capitalize">{orginCfsData.cfsName}</p>-
					<p className="text-capitalize"> {orginCfsData.cfsBranch}</p>
				</div>
			),
		},
		{
			label: "ETD",
			content: moment(scheduleData.etd).format("DD-MM-YYYY"),
		},
		scheduleData.aetd != null
			? {
					label: "ATD",
					content: moment(scheduleData.aetd).format("DD-MM-YYYY"),
			  }
			: {},
		{
			label: "Transit Time",
			content: deliveryDays + " Days",
			detail: (
				<div className={styles.stepperdate}>
					<p className="text-capitalize">{scheduleData.vessel}</p>|
					<p> {scheduleData.voyage}</p>
				</div>
			),
		},
		{
			label: "ETA",
			content: moment(scheduleData.eta).format("DD-MM-YYYY"),
		},
		scheduleData.aeta != null
			? {
					label: "ATA",
					content: moment(scheduleData.aeta).format("DD-MM-YYYY"),
			  }
			: {},
		{
			label: "Expected Delivery Date",
			content:
				moment(scheduleData.destinationCfsCutOff).format("DD-MM-YYYY") +
				" | " +
				scheduleData.destinationCfsClosingtime,
			detail: (
				<>
					<div className={styles.stepperdate}>
						<p className="text-capitalize">
							{destinationCfsData.cfsName}
						</p>
						-
						<p className="text-capitalize">
							{destinationCfsData.cfsBranch}
						</p>
					</div>
					<div className={styles.stepperdate}>
						<span>
							First {destinationCfsData?.freeDays ?? 0} Days Free
						</span>
					</div>
				</>
			),
		},
	];

	return (
		<Box>
			<p className={styles.steptitle}>
				<Journey />
				Journey Details
			</p>
			<Stepper orientation="vertical">
				{steps
					.filter((step) => Object.keys(step).length > 0)
					.map((step) => (
						<Step key={step.label}>
							<StepLabel
								icon={
									<div className={styles.stepperCircle}></div>
								}>
								<div className={styles.steppercontent}>
									<div className={styles.steplables}>
										<h5>{step.label}</h5>
										<div>{step.detail}</div>
									</div>
									<div className={styles.stepperdate}>
										{step.content}
									</div>
								</div>
							</StepLabel>
						</Step>
					))}
			</Stepper>
		</Box>
	);
}
