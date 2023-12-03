import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Typography,
} from "@mui/material";
import { SentimentVeryDissatisfied } from "@mui/icons-material";
import { Button } from "react-bootstrap";

function ViewHistoryModal({ show, handleClose, reasonArray }) {
	function checkTypeOfMessage(message) {
		if (typeof message !== "object") {
			return message;
		} else {
			const msgKeys = Object.values(message);
			return (
				<ol>
					{msgKeys.map((msg, index) => (
						<li key={index}>{msg}</li>
					))}
				</ol>
			);
		}
	}
	return (
		<Dialog fullWidth maxWidth="md" open={show} onClose={handleClose}>
			<DialogTitle sx={{ fontWeight: "bold" }}>View History</DialogTitle>
			<DialogContent dividers={scroll === "paper"}>
				{reasonArray?.length > 0 ? (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>S.No</TableCell>
									<TableCell>Date</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Who</TableCell>
									<TableCell>Reason (If Any)</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{reasonArray?.map((e, i) => {
									return (
										<TableRow key={i}>
											<TableCell>{i + 1}</TableCell>
											<TableCell
												sx={{ whiteSpace: "pre" }}>
												{e.time}
											</TableCell>
											<TableCell>{e.status}</TableCell>
											<TableCell
												sx={{
													textTransform: "capitalize",
												}}>
												{e.role}
											</TableCell>
											<TableCell>
												{checkTypeOfMessage(e.message)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Typography variant="h5" sx={{ textAlign: "center" }}>
						Looks empty{" "}
						<SentimentVeryDissatisfied
							sx={{
								color: "#f4da47",
							}}
							fontSize="large"
						/>
					</Typography>
				)}
			</DialogContent>
			<DialogActions>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ViewHistoryModal;
