import { Alert } from "@mui/material";
import styles from "./index.module.css";
import { GiCheckMark } from "react-icons/gi";

export default function ProceedCheckmark({
	roleEvent,
	milestoneData,
	milestoneStep,
	profileRole,
	onCheckClick,
	paymentData,
}) {
	function checkSkippedInAllSteps(milestoneData) {
		const milestoneKeys = Object.keys(milestoneData);
		return milestoneKeys.some(
			(milestoneKey) =>
				milestoneData[milestoneKey] != null &&
				milestoneData[milestoneKey] === 2
		);
	}

	if (
		milestoneStep === "msams21" &&
		checkSkippedInAllSteps(milestoneData, milestoneStep)
	) {
		return (
			<Alert variant="outlined" severity="error">
				Please complete all the steps to proceed this milestone
			</Alert>
		);
	} else if (milestoneStep === "msams21" && milestoneData.msams21 === 3) {
		return (
			<Alert variant="outlined" severity="error">
				Cargo on hold due to incomplete payment.
			</Alert>
		);
	} else if (
		milestoneStep === "msams05" &&
		(paymentData == null || paymentData?.status === 9)
	) {
		return (
			<Alert variant="outlined" severity="error">
				Please upload invoice.
			</Alert>
		);
	} else if (
		(milestoneData[milestoneStep] === 0 && milestoneStep === "msams16") ||
		milestoneStep === "msams06" ||
		milestoneStep === "msams13"
	) {
		return null;
	} else if (
		roleEvent === profileRole &&
		(milestoneData[milestoneStep] === 0 ||
			milestoneData[milestoneStep] === 2)
	) {
		return (
			<button className={styles.tickicon} onClick={onCheckClick}>
				<GiCheckMark />
			</button>
		);
	} else {
		return null;
	}
}
