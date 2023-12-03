import { openFileNewWindow } from "../../helper";
import styles from "./index.module.css";

export default function CheckoutFileView({
	fileArray,
	isBase64 = false,
	openMilestoneFile,
}) {
	return (
		<>
			{fileArray.length > 0 ? (
				fileArray.map((file, index) => (
					<p
						key={index}
						className={styles.detailsdivval}
						style={{
							color: "blue",
						}}
						onClick={() => {
							if (isBase64) {
								openFileNewWindow(file?.filePath);
							} else {
								openMilestoneFile(file);
							}
						}}>
						{file?.fileName}
					</p>
				))
			) : (
				<p className={styles.emptydetailsdivval}>Not Uploaded</p>
			)}
		</>
	);
}
