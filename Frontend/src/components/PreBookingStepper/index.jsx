import { Box, Stepper, Step, StepLabel } from "@mui/material";
import styles from "./index.module.css";
import {styled} from "@mui/system";

const CustomHorizontalStep = styled(Step)`
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
        margin-left:7px;
        z-index: 1;
	}
	& .MuiStepLabel-iconContainer.Mui-active {
		background: #f4da47 !important;
        border-radius: 50%;
        height: 10px;
        width: 10px;
        margin-left:7px;
        z-index: 1;
	}
	& .MuiStepConnector-root {
        top: 4px !important;
	}
	&.MuiStep-root.Mui-active.MuiStepConnector-line {
		border-color: #f4da47 !important;
		border-width: 3px;
	}
	&.MuiStep-root.Mui-completed.MuiStepConnector-line {
		border-color: #f4da47 !important;
		border-width: 3px;
	}
`;
export default function VerticalStepper() {
	const steps = [
		{
			label: "Pre Booked",
			detail: "17 May 2022",
		},
		{
			label: "Shipper Details",
			detail: "17 May 2022",
		},
		{
			label: "Consignee Details",
			detail: "N/A",
		},
		{
			label: "Notify Party Details",
			detail: "N/A",
		},
		{
			label: "Payment",
			detail: "N/A",
		},
	];

	return (
		<Box>
			<Stepper activeStep={1} orientation="vertical">
				{steps.map((step) => (
					<CustomHorizontalStep key={step.label}>
						<StepLabel
							icon={<div className={styles.stepperCircle}></div>}>
							<div className={styles.steppercontent}>
								<h5>{step.label}</h5>
								<p>{step.detail}</p>
							</div>
						</StepLabel>
					</CustomHorizontalStep>
				))}
			</Stepper>
		</Box>
	);
}
