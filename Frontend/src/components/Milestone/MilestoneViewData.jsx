import moment from "moment";
import styles from "./index.module.css";
import { convertFirstLettersAsUpperCase } from "../../helper";
import MultipleFileViewPopup from "../MultipleFileViewPopup";

import { useState } from "react";

export default function MilestoneViewData({
	milestoneStep,
	milestoneData,
	downloadFile,
	ata,
	atd,
	containerNo,
	sealNo,
}) {
	const [openPopup, setOpenPopup] = useState(false);

	const closePopup = () => {
		setOpenPopup(false);
	};

	function checkFile(milestoneData) {
		if (milestoneData != null) {
			if (Array.isArray(milestoneData)) {
				return milestoneData
					.filter((data) => data.filePath != null)
					.map(({ fileName, filePath }, index) => (
						<p
							key={index}
							className={styles.filename}
							onClick={() =>
								downloadFile({ fileName, filePath })
							}>
							{fileName}
						</p>
					));
			} else if (milestoneData.filePath != null) {
				return (
					<p
						className={styles.filename}
						onClick={() =>
							downloadFile({
								fileName: milestoneData.fileName,
								filePath: milestoneData.filePath,
							})
						}>
						{milestoneData.fileName}
					</p>
				);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	function returnRenderData(milestoneData, milestoneStep) {
		const renderArray = [];
		if (milestoneData != null && milestoneStep !== "msams04") {
			const milestoneEntries = Object.entries(milestoneData);

			for (const [key, value] of milestoneEntries) {
				renderArray.push(
					<>
						<div key={key}>
							<span className={styles.text}>
								{convertFirstLettersAsUpperCase(key)}:&nbsp;
							</span>
							<span className={styles.detailsdivval}>
								{isNaN(Date.parse(value)) === false
									? moment(value).format("DD-MM-YYYY")
									: value}
							</span>
						</div>
						{milestoneStep === "msams22" && (
							<>
								<span className={styles.text}>
									CargoGatewayTime:
								</span>
								<span className={styles.detailsdivval}>
									{value && value.split(" ")[1]}
								</span>
							</>
						)}
					</>
				);
			}
		}
		return renderArray;
	}

	return (
		<div>
			{milestoneStep !== "msams09" &&
				checkFile(milestoneData[`${milestoneStep}File`])}
			{milestoneStep === "msams09" && (
				<>
					{milestoneData[`${milestoneStep}File`].length > 0 && (
						<button
							className={styles.viewFile}
							onClick={() => setOpenPopup(true)}>
							View files
						</button>
					)}
				</>
			)}
			{milestoneStep === "msams13" && atd && (
				<div>
					<span className={styles.text}>ATD:&nbsp;</span>
					<span className={styles.detailsdivval}>
						{moment(atd).format("DD-MM-YYYY")}
					</span>
				</div>
			)}
			{milestoneStep === "msams16" && ata && (
				<div>
					<span className={styles.text}>ATA:&nbsp;</span>
					<span className={styles.detailsdivval}>
						{moment(ata).format("DD-MM-YYYY")}
					</span>
				</div>
			)}
			{milestoneStep === "msams06" && containerNo && sealNo && (
				<div>
					<div>
						<span className={styles.text}>Container No:&nbsp;</span>

						<span className={styles.detailsdivval}>
							{containerNo}
						</span>
					</div>
					<div>
						<span className={styles.text}>Seal No:&nbsp;</span>

						<span className={styles.detailsdivval}>{sealNo}</span>
					</div>
				</div>
			)}
			{milestoneStep === "msams09" && (
				<MultipleFileViewPopup
					titleText="Multiple files"
					handleClose={closePopup}
					open={openPopup}
					downloadFile={downloadFile}
					files={milestoneData[`${milestoneStep}File`]}
					type="milestone"
					removeFileHandler={() => {}}
				/>
			)}
			{milestoneData[`${milestoneStep}Data`] != null &&
				returnRenderData(
					milestoneData[`${milestoneStep}Data`],
					milestoneStep
				)}
		</div>
	);
}
