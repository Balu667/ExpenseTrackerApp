import React from "react";
import styles from "./index.module.css";
import { CircularProgress } from "@mui/material";

function BookigFooter({
	onBackClick,
	onContinueClick,
	mutateState,
	gstFile,
	gstFileValidate,
	gstFileValidation,
}) {
	return (
		<div className={styles.footerdiv}>
			<div className={`container ${styles.btndiv}`}>
				<button
					disabled={mutateState}
					className={styles.backbtn}
					onClick={onBackClick}
					type="button">
					Back
				</button>
				<button
					type="submit"
					disabled={mutateState}
					className={styles.continuebtn}
					onClick={() => {
						if (
							gstFileValidate === null ||
							gstFileValidate === "" ||
							gstFileValidate
						) {
							return gstFileValidation();
						}
						if (onContinueClick) {
							onContinueClick();
						}
					}}>
					{mutateState ? (
						<CircularProgress size={15} />
					) : (
						"Continue to Book"
					)}
				</button>
			</div>
		</div>
	);
}
export default BookigFooter;
