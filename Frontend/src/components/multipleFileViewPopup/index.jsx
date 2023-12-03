import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import "../ConfirmationPopup/styles.css";
import { AiOutlineClose } from "react-icons/ai";
import DeleteIcon from "@mui/icons-material/Delete";
import classes from "./index.module.css";
import { openFileNewWindow } from "../../helper";

function MultipleFileViewPopup({
	handleClose,
	files,
	titleText,
	open,
	downloadFile,
	removeFileHandler,
	type = "comman",
}) {
	return (
		<Dialog
			open={open}
			fullWidth={true}
			maxWidth="xs"
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title" className="titletext">
				{titleText}
				<Button onClick={() => handleClose()} className="closebtns">
					<AiOutlineClose />
				</Button>
			</DialogTitle>
			<DialogContent>
				{files.length > 0 &&
					files.map((file, i) => (
						<div key={i} className={classes.flex}>
							{file.fileData ? (
								<p
									className={classes.fileName}
									onClick={(e) => {
										if (file.fileData.includes("base64")) {
											e.preventDefault();
											openFileNewWindow(file?.fileData);
										} else {
											downloadFile(file);
										}
									}}>
									{file.fileName}
								</p>
							) : (
								<p
									className={classes.fileName}
									onClick={(e) => {
										if (file.filePath.includes("base64")) {
											e.preventDefault();
											openFileNewWindow(file?.filePath);
										} else {
											downloadFile(file);
										}
									}}>
									{file.fileName}
								</p>
							)}
							{type !== "milestone" && (
								<DeleteIcon
									sx={{
										cursor: "pointer",
										color: "red",
									}}
									onClick={() => removeFileHandler(i)}
								/>
							)}
						</div>
					))}
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleClose()} className="nobtn">
					close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
export default MultipleFileViewPopup;
