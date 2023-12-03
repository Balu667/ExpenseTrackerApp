import styles from "./index.module.css";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FileUploadAndView({
	type,
	onInputClick,
	onAfterUploadInputClick,
	fileObject,
	removeAllFiles,
	openPopupHandler,
	typeHandler,
}) {
	switch (type) {
		case "packing":
			if (fileObject.packingList.length === 0) {
				return (
					<>
						<input
							type="file"
							id="Packaging"
							multiple
							onChange={onInputClick}
							className={styles.hidden}
						/>
						<label
							htmlFor="Packaging"
							className={styles.uploadfiles}>
							Upload File
						</label>
					</>
				);
			} else {
				return (
					<div className={styles.flexRow}>
						<div>
							<input
								type="file"
								id="Packaging1"
								multiple
								onChange={onAfterUploadInputClick}
								className={styles.hidden}
							/>
							<label
								htmlFor="Packaging1"
								className={styles.uploadfiles}>
								Upload File
							</label>
						</div>
						<button
							onClick={() => {
								openPopupHandler();
								typeHandler(type);
							}}
							className={styles.uploadfiles}>
							View Files
						</button>
						<DeleteIcon
							sx={{
								cursor: "pointer",
								color: "red",
							}}
							onClick={() => removeAllFiles(type)}
						/>
					</div>
				);
			}
		case "shipping":
			if (fileObject.shippingBill.length === 0) {
				return (
					<>
						<input
							type="file"
							id="shippingbill"
							multiple
							onChange={onInputClick}
							className={styles.hidden}
						/>
						<label
							htmlFor="shippingbill"
							className={styles.uploadfiles}>
							Upload File
						</label>
					</>
				);
			} else {
				return (
					<div className={styles.flexRow}>
						<>
							<input
								type="file"
								id="shippingbill1"
								multiple
								onChange={onAfterUploadInputClick}
								className={styles.hidden}
							/>
							<label
								htmlFor="shippingbill1"
								className={styles.uploadfiles}>
								Upload File
							</label>
						</>
						<button
							onClick={() => {
								openPopupHandler();
								typeHandler(type);
							}}
							htmlFor="Packaging"
							className={styles.uploadfiles}>
							View Files
						</button>
						<DeleteIcon
							sx={{
								cursor: "pointer",
								color: "red",
							}}
							onClick={() => removeAllFiles(type)}
						/>
					</div>
				);
			}
		default:
			break;
	}
}
