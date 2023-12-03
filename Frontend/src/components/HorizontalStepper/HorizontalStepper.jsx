import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import styles from "./index.module.css";
import styled from "@emotion/styled";

const CustomHorizontalStep = styled(Step)`
	.MuiStepConnector-root {
		top: 77px;
		// width: 155px;
		// text-align: center;
		// left: -139px;
		left: -140px !important;
		right: 140px !important;
	}
	& .MuiStepLabel-root {
		flex-direction: column-reverse !important;
		align-items: baseline !important;
	}
	& .MuiStepper-root {
		position: absolute !important;
	}
	& .MuiStepLabel-label.Mui-completed {
		color: #f4da47 !important;
	}
	& .MuiStepLabel-label.Mui-active {
		color: #f4da47 !important;
	}
	& .MuiStep-root {
		padding: 0 !important;
	}
	& .MuiStepLabel-iconContainer.Mui-completed {
		background: #f4da47 !important;
		border-radius: 50%;
		height: 10px;
		width: 10px;
		padding: 2px;
		z-index: 1;
	}
	& .MuiStepLabel-iconContainer.Mui-active {
		background: #f4da47 !important;
		border-radius: 50%;
		height: 10px;
		width: 10px;
		padding: 2px;
		z-index: 1;
	}
	& .MuiStepConnector-line.Mui-active {
		background: red !important;
	}
	&.MuiStep-root .Mui-active .MuiStepConnector-line {
		border-color: #f4da47 !important;
		border-width: 3px;
	}
	&.MuiStep-root .Mui-completed .MuiStepConnector-line {
		border-color: #f4da47 !important;
		border-width: 3px;
	}
`;

const steps = [
	{
		label: "1",
		content: "Cargo Details ",
	},
	{
		label: "2",
		content: "Origin Forwarder",
	},
	{
		label: "3",
		content: "Destination Forwarder",
	},
	{
		label: "4",
		content: "Notify Party",
	},
	{
		label: "5",
		content: "Upload Documents",
	},
];

export default function HorizontalLabelPositionBelowStepper({ activeStep }) {
	return (
		<Box sx={{ width: "100%" }}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map((steps) => (
					<CustomHorizontalStep key={steps.label}>
						<StepLabel
							icon={<div className={styles.stepperCircle}></div>}>
							<div className={styles.stepdiv}>
								<h3>{steps.label}</h3>
								<p>{steps.content}</p>
							</div>
						</StepLabel>
					</CustomHorizontalStep>
				))}
			</Stepper>
		</Box>
	);
}
