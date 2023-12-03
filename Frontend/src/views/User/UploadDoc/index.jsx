import styles from "./index.module.css";
import { ReactComponent as Uploadicon } from "../../../assets/Icons/uploadicon.svg";
import BookingFooter from "../../../components/BookingFooter/index";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useInsertDocs } from "../../../hooks/booking";
import { fileReaderFunction } from "../../../helper";
import FileUploadAndView from "./FileUploadAndView";
import { useDispatch, useSelector } from "react-redux";
import { insertBookingDocs } from "../../../redux/slices/checkoutSlice";
import MultipleFileViewPopup from "../../../components/MultipleFileViewPopup";

function UploadDoc() {
	const { scheduleId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { bookingId, bookingDocsDetails, notifyPartyDetails } = useSelector(
		(state) => state.checkoutDetails
	);
	const userDetail = useSelector((state) => state.profile.profileData);
	const [filesData, setFilesData] = useState({
		packingList: [],
		shippingBill: [],
	});

	const [type, setType] = useState(null);
	const errorMessage = {
		NoFileError: "Please Upload file",
		fileTypeErr: "Upload only PDF",
		fileSizeErr: "File size should not be more than 5 MB",
	};
	const [openPopup, setOpenPopup] = useState(false);
	const [packingFileValidation, setPackingFileValidation] = useState(null);
	const [shippingFileValidation, setShippingFileValidation] = useState(null);

	const onSuccessFunctions = () => {
		navigate(`/user/booking/${scheduleId}/Checkout/`);
	};

	const { mutate: insertDocs, isLoading: insertDocsLoading } =
		useInsertDocs(onSuccessFunctions);

	const sameFileHandler = (arrayOne, arrayTwo) => {
		const newArray = Array.from(arrayTwo);
		return newArray.some(({ name }) =>
			arrayOne.map((file) => file.fileName).includes(name)
		);
	};

	const onSubmit = () => {
		if (filesData.packingList.length === 0) {
			return setPackingFileValidation("Please Upload Packing List File");
		}
		let payload = { ...filesData };
		payload.legalName = userDetail.legalName;
		payload.bookingId = bookingId;
		payload.createdBy = localStorage.getItem("allMasterId");
		payload.status = 6;
		dispatch(insertBookingDocs(filesData));
		insertDocs(payload);
	};

	async function returnFile(event, limit) {
		try {
			const filePromiseData = await fileReaderFunction({
				fileEvent: event,
				fileType: "pdf",
				fileSize: limit,
				errorMessage,
				fileRead: "readAsDataURL",
			});
			if (filePromiseData.length > 0) {
				return filePromiseData.map((file) => {
					return {
						filePath: file.fileData,
						fileName: file.fileName,
						fileSize: file.fileSize,
					};
				});
			} else {
				const { fileName, fileData, fileSize } = filePromiseData;
				return { fileName, filePath: fileData, fileSize };
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	async function uploadHandler(event, fileType, afterUpload) {
		setPackingFileValidation("");
		setShippingFileValidation("");
		let currentLimit = 0;
		switch (fileType) {
			case "packing":
				if (
					sameFileHandler(filesData.shippingBill, event.target.files)
				) {
					setPackingFileValidation(
						"Please Upload Different File for Packing List"
					);
				} else if (
					sameFileHandler(filesData.packingList, event.target.files)
				) {
					setPackingFileValidation(
						"File Already uploaded in Packing List"
					);
				} else {
					currentLimit = afterUpload
						? 1024 * 1024 * 5 -
						  filesData.packingList
								.map((file) => file.fileSize)
								.reduce((prev, curr) => prev + curr, 0)
						: currentLimit;
					try {
						const filePromiseData = await returnFile(
							event,
							afterUpload ? currentLimit : 1024 * 1024 * 5
						);
						setPackingFileValidation("");
						if (afterUpload) {
							setFilesData({
								...filesData,
								packingList: Array.isArray(filePromiseData)
									? [
											...filesData.packingList,
											...filePromiseData,
									  ]
									: [
											...filesData.packingList,
											filePromiseData,
									  ],
							});
						} else {
							setFilesData({
								...filesData,
								packingList: Array.isArray(filePromiseData)
									? [...filePromiseData]
									: [filePromiseData],
							});
						}
					} catch (error) {
						setPackingFileValidation(error.message.split(":")[1]);
					}
				}
				break;
			case "shipping":
				if (
					sameFileHandler(filesData.packingList, event.target.files)
				) {
					setShippingFileValidation(
						"Please Upload Different File for Shipping Bill"
					);
				} else if (
					sameFileHandler(filesData.shippingBill, event.target.files)
				) {
					setShippingFileValidation(
						"File Already uploaded in Shipping List"
					);
				} else {
					currentLimit = afterUpload
						? 1024 * 1024 * 5 -
						  filesData.shippingBill
								.map((file) => file.fileSize)
								.reduce((prev, curr) => prev + curr, 0)
						: currentLimit;
					try {
						const filePromiseData = await returnFile(
							event,
							afterUpload ? currentLimit : 1024 * 1024 * 5
						);
						setShippingFileValidation("");
						if (afterUpload) {
							setShippingFileValidation("");
							setFilesData({
								...filesData,
								shippingBill: Array.isArray(filePromiseData)
									? [
											...filesData.shippingBill,
											...filePromiseData,
									  ]
									: [
											...filesData.shippingBill,
											filePromiseData,
									  ],
							});
						} else {
							setFilesData({
								...filesData,
								shippingBill: Array.isArray(filePromiseData)
									? [...filePromiseData]
									: [filePromiseData],
							});
						}
					} catch (error) {
						setShippingFileValidation(error.message.split(":")[1]);
					}
				}
				break;
			default:
				break;
		}
		event.target.value = null;
	}

	const backFunction = () => {
		navigate(`/user/booking/${scheduleId}#4`);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		if (bookingDocsDetails) {
			setFilesData({
				packingList: bookingDocsDetails.packingList,
				shippingBill: bookingDocsDetails.shippingBill,
			});
		}
	}, []);

	const closePopup = () => {
		setOpenPopup(false);
	};

	const openPopupHandler = () => {
		setOpenPopup(true);
	};

	const typeHandler = (type) => {
		setType(type);
	};

	const removeFileHandler = (index) => {
		if (type === "packing") {
			let filteredArray = filesData.packingList.filter(
				(file, i) => i !== index
			);
			setFilesData({ ...filesData, packingList: filteredArray });
		}
		if (type === "shipping") {
			let filteredArray = filesData.shippingBill.filter(
				(file, i) => i !== index
			);
			setFilesData({ ...filesData, shippingBill: filteredArray });
		}
	};

	const removeAllFiles = (type) => {
		if (type === "packing") {
			setFilesData({ ...filesData, packingList: [] });
		}
		if (type === "shipping") {
			setFilesData({ ...filesData, shippingBill: [] });
		}
	};

	if (notifyPartyDetails == null || bookingId == null) {
		return <Navigate to="/user/dashboard" replace={true} />;
	}

	return (
		<>
			<div className="container">
				<div className={styles.uploadfilesdiv}>
					<div className={styles.titlediv}>
						<h1>Documents</h1>
						<p>2 Required</p>
					</div>
					<div className={styles.contentdiv}>
						<div className={styles.fileuploaddiv}>
							<div className={styles.uploadflex}>
								<Uploadicon style={{ marginTop: "5px" }} />
								<div className={styles.uploadtxt}>
									<span>Upload Packing List </span>
									<span style={{ color: "red" }}>*</span>
									<p>PDF (Recommended) Upto 5MB Allowed</p>
								</div>
							</div>
							<div className={styles.uploadflex}>
								<FileUploadAndView
									removeAllFiles={removeAllFiles}
									typeHandler={typeHandler}
									onAfterUploadInputClick={(event) =>
										uploadHandler(event, "packing", true)
									}
									openPopupHandler={openPopupHandler}
									fileObject={filesData}
									onInputClick={(event) =>
										uploadHandler(event, "packing", false)
									}
									type="packing"
									deleteOnClick={() => {
										setFilesData({
											...filesData,
											packageName: "",
											packagePath: null,
										});
										setPackingFileValidation(
											"Please Upload Packing List File"
										);
									}}
								/>
							</div>
						</div>
						<p className="errormsg">{packingFileValidation}</p>
						<div
							style={{ marginTop: "15px" }}
							className={styles.fileuploaddiv}>
							<div className={styles.uploadflex}>
								<Uploadicon style={{ marginTop: "5px" }} />
								<div className={styles.uploadtxt}>
									<span>Upload Shipping Bill </span>
									<span style={{ fontWeight: "lighter" }}>
										(Optional)
									</span>
									<p>PDF (Recommended) Upto 5MB Allowed</p>
								</div>
							</div>
							<div className={styles.uploadflex}>
								<FileUploadAndView
									removeAllFiles={removeAllFiles}
									typeHandler={typeHandler}
									openPopupHandler={openPopupHandler}
									fileObject={filesData}
									onAfterUploadInputClick={(event) =>
										uploadHandler(event, "shipping", true)
									}
									onInputClick={(event) =>
										uploadHandler(event, "shipping", false)
									}
									type="shipping"
									deleteOnClick={() => {
										setFilesData({
											...filesData,
											shippingBillName: "",
											shippingBillPath: null,
										});
										setShippingFileValidation("");
									}}
								/>
							</div>
						</div>
						<p className="errormsg">{shippingFileValidation}</p>
					</div>
				</div>
			</div>
			<BookingFooter
				mutateState={insertDocsLoading}
				onBackClick={backFunction}
				onContinueClick={onSubmit}
			/>
			<MultipleFileViewPopup
				removeFileHandler={removeFileHandler}
				handleClose={closePopup}
				files={
					type === "packing"
						? filesData.packingList
						: filesData.shippingBill
				}
				open={openPopup}
				titleText="Uploaded Files"
			/>
		</>
	);
}
export default UploadDoc;
