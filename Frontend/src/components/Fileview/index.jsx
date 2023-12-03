import { AiFillDelete } from "react-icons/ai";
import { openFileNewWindow } from "../../helper";
import styles from "./index.module.css";

export default function FileView({ fileData, deleteOnClick }) {
	return (
		<span>
			{fileData && fileData.length > 0 ? (
				fileData.map((fileData, i) => (
					<span key={i} className={styles.fileContainer}>
						<p
							className={styles.upload}
							onClick={(e) => {
								if (fileData?.filePath.includes("base64")) {
									e.preventDefault();
									openFileNewWindow(fileData.filePath);
								}
							}}>
							{fileData?.fileName}
						</p>
						<AiFillDelete
							style={{ cursor: "pointer" }}
							onClick={() => deleteOnClick(fileData.fileName)}
							color="red"
						/>
					</span>
				))
			) : (
				<span className={styles.fileContainer}>
					<p
						className={styles.upload}
						onClick={(e) => {
							if (fileData?.filePath.includes("base64")) {
								e.preventDefault();
								openFileNewWindow(fileData.filePath);
							}
						}}>
						{fileData?.fileName}
					</p>
					<AiFillDelete
						style={{ cursor: "pointer" }}
						onClick={() => deleteOnClick(fileData.fileName)}
						color="red"
					/>
				</span>
			)}
		</span>
	);
}
