import styles from "./index.module.css";
import ToggleButton from "@mui/material/ToggleButton";
import styled from "@emotion/styled";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Controller } from "react-hook-form";

const CustomisedToggleButton = styled(ToggleButtonGroup)`
	.MuiToggleButton-root.Mui-selected {
		background: black !important;
		color: #fff !important;
	}
	,
	&.MuiToggleButtonGroup-root {
		height: 34px !important;
	}
`;

export function MetricBoxes({
	control,
	index,
	watchFields,
	handleMeasurementUnitChange,
	addKeyValue,
	cargoType,
	setValue,
}) {
	function changeLimit() {
		for (let index = 0; index < watchFields.cargoDetails.length; index++) {
			if (watchFields.cargoDetails[index].metric === "M") {
				setValue(
					`cargoDetails.${index}.heightLimit`,
					"Height should be 2.50m"
				);
			} else if (watchFields.cargoDetails[index].metric === "CM") {
				setValue(
					`cargoDetails.${index}.heightLimit`,
					"Height should be 250cm"
				);
			} else if (watchFields.cargoDetails[index].metric === "IN") {
				setValue(
					`cargoDetails.${index}.heightLimit`,
					"Height should be 98.43in"
				);
			} else {
				setValue(
					`cargoDetails.${index}.heightLimit`,
					"Height should be 2500mm"
				);
			}
		}
	}

	return (
		<div>
			<div className={styles.dimenlabels}>
				<div className={styles.toglesdiv}>
					<Controller
						name={`cargoDetails.${index}.metric`}
						control={control}
						render={({ field }) => (
							<CustomisedToggleButton
								value={field.value}
								exclusive
								disabled={
									!watchFields.cargoDetails[index].packageType
								}
								onChange={(e) => {
									field.onChange(e.target.value);
									handleMeasurementUnitChange(
										e.target.value,
										index
									);
									addKeyValue(
										index,
										watchFields.cargoDetails[index].metric
									);
									if (cargoType === "non-stackable") {
										changeLimit();
									}
								}}
								aria-label="text alignment">
								<ToggleButton
									sx={{
										backgroundColor: "#EDEDED",
									}}
									value="CM"
									className={` ${
										watchFields.cargoDetails[index]
											.metric === "CM"
											? styles.toggle1
											: ""
									}`}
									aria-label="right aligned">
									CM
								</ToggleButton>
								<ToggleButton
									sx={{
										backgroundColor: "#EDEDED",
									}}
									className={` ${
										watchFields.cargoDetails[index]
											.metric === "M"
											? styles.toggle1
											: ""
									}`}
									value="M">
									M
								</ToggleButton>
								<ToggleButton
									sx={{
										backgroundColor: "#EDEDED",
									}}
									value="MM"
									className={` ${
										watchFields.cargoDetails[index]
											.metric === "MM"
											? styles.toggle1
											: ""
									}`}
									aria-label="right aligned">
									MM
								</ToggleButton>
								<ToggleButton
									sx={{
										backgroundColor: "#EDEDED",
									}}
									value="IN"
									className={` ${
										watchFields.cargoDetails[index]
											.metric === "IN"
											? styles.toggle1
											: ""
									}`}
									aria-label="right aligned">
									IN
								</ToggleButton>
							</CustomisedToggleButton>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
