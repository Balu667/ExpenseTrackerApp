import { MdDeleteForever } from "react-icons/md";
import { ReactComponent as Uploadicon } from "../../../assets/Images/uploadicon.svg";
import { openFileNewWindow } from "../../../helper";
import styles from "./index.module.css";

function LabelComponent({ state, type, setter, removeFile }) {
	switch (type) {
		case "gst":
			if (state.fileName !== null) {
				return (
					<div className={styles.uploadlabel}>
						<span
							className={styles.uploadfile}
							onClick={() => openFileNewWindow(state.fileData)}>
							{state.fileName}
						</span>
						<MdDeleteForever
							className={styles.deleteicons}
							onClick={() => {
								setter({
									fileName: null,
									fileData: null,
								});
								removeFile();
							}}
						/>
					</div>
				);
			} else {
				return (
					<label htmlFor="gstfile">
						<div className={styles.uploadlabel}>
							<Uploadicon />
							<span>Upload</span>
						</div>
					</label>
				);
			}
		case "bl":
			if (state.fileName !== null) {
				return (
					<div className={styles.uploadlabel}>
						<span
							className={styles.uploadfile}
							onClick={() => openFileNewWindow(state.fileData)}>
							{state.fileName}
						</span>
						<MdDeleteForever
							className={styles.deleteicons}
							onClick={() => {
								setter({
									fileName: null,
									fileData: null,
								});
								removeFile();
							}}
						/>
					</div>
				);
			} else {
				return (
					<label htmlFor="blfileupload">
						<div className={styles.uploadlabel}>
							<Uploadicon />
							<span>Upload</span>
						</div>
					</label>
				);
			}
		default:
			break;
	}
}

export default LabelComponent;
