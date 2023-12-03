import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import styles from "./index.module.css";
import styled from "@emotion/styled";
import { useGetMilestoneFile } from "../../hooks/booking";
import ProceedCheckmark from "./proceedMilestoneCheck";
import MilestoneViewData from "./MilestoneViewData";
import { useEffect } from "react";
import { openFileNewWindow } from "../../helper";

const CustomHorizontalStep = styled(Step)`
	& .MuiStepper-root {
		position: absolute !important;
	}
	& .MuiStepLabel-root {
		align-items: flex-start !important;
	}
	& .MuiStepContent-root {
		border-left: 1px solid #fff !important;
		margin-left: 0 !important;
		padding-left: 0 !important;
	}
	& .MuiStepLabel-root.MuiStepLabel-alternativeLabel {
		width: 212px !important;
	}
	& .MuiStepLabel-label {
		text-align: initial !important;
	}
	& .MuiStepLabel-label.Mui-completed {
		color: green !important;
	}
	& .MuiStepLabel-label.Mui-active {
		color: #f4da47 !important;
	}
	& .MuiStep-root {
		padding: 0 !important;
	}
	& .MuiStepLabel-iconContainer.Mui-completed {
		background: green !important;
		border-radius: 50%;
		height: 10px;
		width: 10px;
		padding: 5px;
		z-index: 1;
	}
	& .MuiStepLabel-iconContainer.Mui-active {
		background: #f4da47 !important;
		border-radius: 50%;
		height: 10px;
		width: 10px;
		padding: 5px;
		z-index: 1;
	}
	& .MuiStepConnector-root {
		top: 4px !important;
		left: +9px !important;
		right: -8px !important;
	}
	&.MuiStep-root .Mui-active .MuiStepConnector-line {
		border-color: #f4da47 !important;
		border-width: 3px;
	}
	&.MuiStep-root .Mui-completed .MuiStepConnector-line {
		border-color: green !important;
		border-width: 3px;
	}
`;

export default function MilestoneStepper({
	activeStep,
	steps,
	profileRole,
	stepCheckOnClick,
	milestoneData,
	bookingId,
	ata,
	atd,
	sealNo,
	containerNo,
	paymentData,
}) {
	const { mutateAsync } = useGetMilestoneFile();

	function checkSkipped(milestoneData, milestoneStep) {
		const milestoneStatus = milestoneData[milestoneStep];
		if (milestoneStatus != null) {
			return milestoneStatus === 1;
		}
	}

	async function downloadFile(fileData) {
		const payload = {
			bookingId,
			fileData,
		};
		const fileViewData = await mutateAsync(payload);
		openFileNewWindow(fileViewData);
	}

	function returnIdForLastStep(array, index) {
		return array.length - 1 === index ? "currentStep" : "";
	}

	useEffect(() => {
		document.querySelector("#currentStep")?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}, [milestoneData]);

	return (
		<Box
			sx={{
				width: "100%",
				height: "auto",
			}}>
			<Stepper
				sx={{
					flexDirection: "row-reverse",
					overflowX: "scroll",
					paddingBottom: "30px",
				}}
				activeStep={activeStep}
				alternativeLabel>
				{steps
					.slice(0, activeStep + 1)
					.filter(
						({ role, milestoneStep, roleEvent }) =>
							(role.includes(profileRole) &&
								(milestoneData[milestoneStep] === 1 ||
									milestoneData[milestoneStep] === 2)) ||
							roleEvent === profileRole
					)
					.map(
						(
							{ milestoneStep, milestoneTitle, roleEvent },
							index,
							array
						) => (
							<CustomHorizontalStep
								completed={checkSkipped(
									milestoneData,
									milestoneStep
								)}
								id={returnIdForLastStep(array, index)}
								key={index}>
								<StepLabel
									icon={
										<div className={styles.stepperCircle} />
									}>
									{milestoneTitle}
								</StepLabel>
								<ProceedCheckmark
									milestoneData={milestoneData}
									milestoneStep={milestoneStep}
									paymentData={paymentData}
									profileRole={profileRole}
									roleEvent={roleEvent}
									onCheckClick={() =>
										stepCheckOnClick(milestoneStep)
									}
								/>
								<MilestoneViewData
									ata={ata}
									atd={atd}
									containerNo={containerNo}
									sealNo={sealNo}
									milestoneData={milestoneData}
									milestoneStep={milestoneStep}
									downloadFile={downloadFile}
								/>
							</CustomHorizontalStep>
						)
					)}
			</Stepper>
		</Box>
	);
}
