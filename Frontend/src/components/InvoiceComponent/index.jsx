import { useState } from "react";
import styles from "./index.module.css";
import { AiFillExclamationCircle, AiFillCheckCircle } from "react-icons/ai";
import { ReactComponent as Uploadicon } from "../../assets/Icons/uploadicon.svg";
import { ReactComponent as Download } from "../../assets/Icons/download.svg";
import { fileReaderFunction, openFileNewWindow } from "../../helper";
import { useInsertInvoiceBybookingId } from "../../hooks/invoice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { useGetInvoiceFileById } from "../../hooks/booking";
import { useSelector } from "react-redux";

function InvoiceComponent({ paymentData, setPopupOpen }) {
	const [file, setFile] = useState(null);
	const role = useSelector((state) => state.profile.role);

	const { bookingId } = useParams();
	const { mutateAsync: getInvoiceFile } = useGetInvoiceFileById();

	const onSuccessFunctions = (data) => {
		toast.success(data);
	};

	const { mutate, isLoading } =
		useInsertInvoiceBybookingId(onSuccessFunctions);

	const errorMessage = {
		NoFileError: "Please Upload file",
		fileTypeErr: "Upload only PDF",
		fileSizeErr: "File size should not be more than 5 MB",
	};

	const fileReaderHandler = async (event) => {
		fileReaderFunction({
			fileEvent: event,
			fileType: "pdf",
			fileSize: 1024 * 1024 * 5,
			errorMessage,
			fileRead: "readAsDataURL",
		})
			.then((result) => setFile(result))
			.catch((error) => toast.error(error.message));
		event.target.value = "";
	};

	const invoiceUploadHandler = () => {
		if (!file || file == null) {
			return toast.error("Upload file first");
		}
		let fileName = file.fileName;
		mutate({
			bookingId,
			status: 10,
			invoiceName: fileName,
			invoicePath: file.fileData,
		});
	};

	async function downloadInvoiceFile(id) {
		const fileData = await getInvoiceFile(id);
		openFileNewWindow(fileData);
	}

	const paymentReceived = () => {
		mutate({
			bookingId,
			status: 1,
		});
	};

	const removeFileHandler = () => {
		setFile(null);
	};

	return (
		<>
			{role === 5 && (
				<>
					{(paymentData.status === 9 ||
						paymentData.status === 10) && (
						<div className={styles.invoicediv}>
							<div className={styles.invoicefile}>
								<Download />
								<div>
									<p className={styles.yourinvoice}>
										{paymentData.status === 9
											? "Upload the Invoice !"
											: "Invoice !"}
									</p>
									<p className={styles.bookingID}>
										{paymentData.status === 9
											? `Upload the Invoice for Booking ID ${paymentData.bId}`
											: `Invoice for Booking ID ${paymentData.bId}`}
									</p>
								</div>
							</div>
							<p
								onClick={() =>
									downloadInvoiceFile({
										id: paymentData?.bookingId,
									})
								}
								className={styles.filename}>
								{paymentData?.invoiceName}
							</p>
							{paymentData.status === 9 && (
								<div className={styles.invoicebtn}>
									{file ? (
										<>
											<p
												onClick={() =>
													openFileNewWindow(
														file.fileData
													)
												}
												className={styles.fileName}>
												{file.fileName}
											</p>
											<DeleteIcon
												sx={{
													cursor: "pointer",
													color: "red",
												}}
												onClick={removeFileHandler}
											/>
										</>
									) : (
										<>
											<input
												onChange={(e) =>
													fileReaderHandler(e)
												}
												type="file"
												id="Invoice"
												className={styles.invoicedoc}
											/>
											<label
												htmlFor="Invoice"
												className={
													styles.invoiceupload
												}>
												<Uploadicon
													className={
														styles.invoiceicon
													}
												/>
												Invoice Upload
											</label>
										</>
									)}
									<button
										disabled={isLoading}
										onClick={invoiceUploadHandler}
										className={styles.downloadbtn}>
										Confirm
									</button>
								</div>
							)}
						</div>
					)}

					{(paymentData.status === 11 ||
						paymentData.status === 1) && (
						<div className={styles.invoicediv}>
							<div className={styles.invoicefile}>
								{paymentData.status === 11 ? (
									<AiFillExclamationCircle
										className={
											styles.AiFillExclamationCircle
										}
									/>
								) : (
									<AiFillCheckCircle
										className={
											styles.AiFillExclamationCircle
										}
										color="green"
									/>
								)}
								<div>
									<p className={styles.yourinvoice}>
										Payment Details
									</p>
									<p className={styles.bookingID}>
										UTR Number: {paymentData?.utrNo} & Date:
										{moment(paymentData?.utrDate).format(
											"DD-MM-YY"
										)}
										{paymentData.status === 11
											? "needed to verify payment"
											: ""}
									</p>
								</div>
							</div>
							<div className={styles.invoicebtn}>
								{paymentData?.invoiceName && (
									<p
										onClick={() =>
											downloadInvoiceFile({
												id: paymentData?.bookingId,
											})
										}
										className={styles.filename}>
										{paymentData.invoiceName}
									</p>
								)}
								{paymentData.status === 11 && (
									<button
										disabled={isLoading}
										onClick={paymentReceived}
										className={styles.downloadbtn}>
										Confirm payment
									</button>
								)}
								{paymentData.status === 1 && (
									<span className={styles.downloadbtn}>
										Payment Completed
									</span>
								)}
							</div>
						</div>
					)}
				</>
			)}

			{role === 1 && (
				<>
					{paymentData.status === 10 && (
						<div className={styles.invoicediv}>
							<div className={styles.invoicefile}>
								<Download />
								<div>
									<p className={styles.yourinvoice}>
										Your Invoice is Ready !
									</p>
									<p className={styles.bookingID}>
										Invoice for Booking ID #
										{paymentData.bId} is Ready to Download
									</p>
								</div>
							</div>
							<div className={styles.invoicebtn}>
								<p
									onClick={() =>
										downloadInvoiceFile({
											id: paymentData?.bookingId,
										})
									}
									className={styles.filename}>
									{paymentData.invoiceName}
								</p>
								<button
									onClick={() => setPopupOpen(true)}
									className={styles.downloadbtn}>
									Confirm
								</button>
							</div>
						</div>
					)}

					{(paymentData.status === 11 ||
						paymentData.status === 1) && (
						<div className={styles.invoicediv}>
							<div className={styles.invoicefile}>
								{paymentData.status === 11 ? (
									<AiFillExclamationCircle
										className={
											styles.AiFillExclamationCircle
										}
									/>
								) : (
									<AiFillCheckCircle
										className={
											styles.AiFillExclamationCircle
										}
										color="green"
									/>
								)}
								<div>
									<p className={styles.yourinvoice}>
										Payment Details
									</p>

									<p className={styles.bookingID}>
										{`UTR Number: ${paymentData?.utrNo} &
									Date: 
									${moment(paymentData?.utrDate).format("DD-MM-YY")}
									${paymentData.status === 1 ? "" : "needed to complete booking"}`}
									</p>
								</div>
							</div>
							<div className={styles.invoicebtn}>
								{paymentData?.invoiceName && (
									<p
										onClick={() =>
											downloadInvoiceFile({
												id: paymentData?.bookingId,
											})
										}
										className={styles.filename}>
										{paymentData.invoiceName}
									</p>
								)}
								{paymentData.status === 11 && (
									<span className={styles.downloadbtn}>
										Under Verification
									</span>
								)}
								{paymentData.status === 1 && (
									<span className={styles.downloadbtn}>
										Payment Completed
									</span>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default InvoiceComponent;
