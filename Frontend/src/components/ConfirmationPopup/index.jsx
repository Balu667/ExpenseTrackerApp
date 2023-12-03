import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import "./styles.css";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { closePopup } from "../../redux/slices/popupSlice";
import Checkbox from "@mui/material/Checkbox";

function Popup({
	handleAgree,
	contentText,
	titleText,
	setConfirmPopup,
	checkbox,
	setCheckbox,
	isLogin,
}) {
	const popupStatus = useSelector((state) => state.popup.popupStatus);
	const dispatch = useDispatch();

	return (
		<Dialog
			open={popupStatus}
			onClose={() => {
				dispatch(closePopup());
				if (setConfirmPopup) {
					setConfirmPopup({
						approve: false,
						reject: false,
						revalidate: false,
					});
				}
			}}
			fullWidth
			maxWidth="xs"
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title" className="titletext">
				<p>{titleText}</p>
				<Button
					onClick={() => {
						dispatch(closePopup());
						if (setConfirmPopup) {
							setConfirmPopup({
								approve: false,
								reject: false,
								revalidate: false,
							});
						}
					}}
					className="closebtns">
					<AiOutlineClose />
				</Button>
			</DialogTitle>
			<DialogContent>
				<DialogContentText
					className="contenttxt"
					id="alert-dialog-description">
					{contentText}
					{isLogin !== true && (
						<>
							{contentText.includes(
								"Are you sure to proceed with the Confirmed Booking?"
							) && (
								<>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
											gap: "4px",
											alignItems: "center",
										}}>
										<Checkbox
											checked={checkbox}
											size="small"
											onChange={(e) =>
												setCheckbox(e.target.checked)
											}
											style={{
												marginLeft: "4px",
												color: "#f3cf00",
											}}
										/>
										<a
											target="__blank"
											href={"/user/termsconditons"}
											className="terms"
											style={{ textDecoration: "none" }}>
											Terms & Conditions
										</a>
									</div>
									{!checkbox && (
										<p style={{ color: "red" }}>
											You must accept the terms and
											conditions
										</p>
									)}
								</>
							)}
						</>
					)}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleAgree} autoFocus className="yesbtn">
					Yes
				</Button>
				<Button
					onClick={() => {
						dispatch(closePopup());
						if (setConfirmPopup) {
							setConfirmPopup({
								approve: false,
								reject: false,
								revalidate: false,
							});
						}
					}}
					className="nobtn">
					No
				</Button>
			</DialogActions>
		</Dialog>
	);
}
export default Popup;
