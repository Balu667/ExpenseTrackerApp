import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "../ConfirmationPopup/styles.css";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { closeCommonPopup } from "../../redux/slices/commonPopupSlice";

function CommanPopup({ handleAgree, contentText, titleText }) {
	const popupStatus = useSelector((state) => state.commonPopup.popupStatus);

	const dispatch = useDispatch();

	return (
		<Dialog
			open={popupStatus}
			fullWidth
			maxWidth="xs"
			onClose={() => dispatch(closeCommonPopup())}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title" className="titletext">
				<p>{titleText}</p>
				<Button
					onClick={() => dispatch(closeCommonPopup())}
					className="closebtns">
					<AiOutlineClose />
				</Button>
			</DialogTitle>
			<DialogContent>
				<DialogContentText
					className="contenttxt"
					id="alert-dialog-description">
					{contentText}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleAgree} autoFocus className="yesbtn">
					Yes
				</Button>
				<Button
					onClick={() => dispatch(closeCommonPopup())}
					className="nobtn">
					No
				</Button>
			</DialogActions>
		</Dialog>
	);
}
export default CommanPopup;
