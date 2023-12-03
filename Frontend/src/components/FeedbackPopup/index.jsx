import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import "../ConfirmationPopup/styles.css";
import { AiOutlineClose } from "react-icons/ai";

function FeedBackPopup({ type, feedBackPopup, handleClose }) {
	function returnIframe(type) {
		switch (type) {
			case "milestone":
				return "";
			case "booking":
				return (
					<iframe
						className="p-2"
						style={{
							height: "400px",
							width: "99%",
							border: "none",
						}}
						src="https://forms.zohopublic.in/httpsdokonalycom/form/CustomerFeedback/formperma/bk1QZ1TcV5O4liyTXATMXwhclhy2ORcq5MRDB6rRYyE"
					/>
				);
			default:
				return null;
		}
	}

	return (
		<Dialog
			open={feedBackPopup}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title" className="titletext">
				<div className="d-flex justify-content-end w-100">
					<button onClick={handleClose} className="closebtns">
						<AiOutlineClose />
					</button>
				</div>
			</DialogTitle>
			<DialogContent>
				<DialogContentText
					className="contenttxt"
					id="alert-dialog-description">
					{returnIframe(type)}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} className="nobtn">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
export default FeedBackPopup;
