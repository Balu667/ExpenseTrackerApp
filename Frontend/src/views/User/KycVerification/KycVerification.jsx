import styles from "./index.module.css";
import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { kycVerificationValidation } from "../../../validationSchema/kycVerificationValidation";
import { Controller, useForm } from "react-hook-form";
import { Tooltip, CircularProgress } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
	convertFirstLettersAsUpperCase,
	fetchData,
	fileReaderFunction,
} from "../../../helper";
import { useQueryClient } from "@tanstack/react-query";
import { useCountries } from "../../../hooks/country";
import { URL } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../../../redux/slices/profileSlice";
import LabelComponent from "./LabelComponent";
import Loader from "../../../components/Loader/Loader";
import {
	useFetchExistingKycUserDetails,
	useLogoutUser,
} from "../../../hooks/userAuthManagement";
import { useCityData, useStateData } from "../../../hooks/originForwarder";

function KycFormality() {
	const [gstFile, setGstFile] = useState({
		fileName: null,
		fileData: null,
	});

	const [blFile, setBlFile] = useState({
		fileName: null,
		fileData: null,
	});
	const [gstFileValidate, setGstFileValidate] = useState("");
	const [blCopyValidate, setBlCopyValidate] = useState("");
	const queryClient = useQueryClient();
	const [disable, setDisable] = useState(false);

	const {
		handleSubmit,
		formState: { errors },
		reset,
		control,
		watch,
	} = useForm({
		resolver: yupResolver(kycVerificationValidation),
		mode: "onTouched",
		defaultValues: {
			legalName: "",
			country: "",
			state: "",
			city: "",
			gstNumber: "",
			pan: "",
			mto: "",
			groupName: "",
		},
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data: countryList, isLoading } = useCountries();
	const { mutate } = useLogoutUser();
	const profileData = useSelector((state) => state.profile.profileData);

	const { data: stateData } = useStateData();

	const { data: cityData } = useCityData(watch("state"));

	const fetchOnSuccessFunctions = (data) => {
		setGstFile({
			fileName: data[0].gstFileName,
			fileData: data[0].gstFilePath,
		});
		setBlFile({
			fileName: data[0].blCopyName,
			fileData: data[0].blCopyPath,
		});
		reset(data[0]);
	};

	const fetchExistingKycDetails = useFetchExistingKycUserDetails(
		fetchOnSuccessFunctions
	);

	const postKycUserData = async (data) => {
		setDisable(true);
		let updataUserUrl;
		if (gstFile.fileData === null) {
			setGstFileValidate("Please Upload GST File");
			setDisable(false);
			return;
		} else if (blFile.fileData === null) {
			setBlCopyValidate("Please Upload BL File");
			setDisable(false);
			return;
		}
		data.blCopyPath = blFile.fileData;
		data.gstFilePath = gstFile.fileData;
		data.gstFileName = gstFile.fileName;
		data.blCopyName = blFile.fileName;
		data.createdBy = localStorage.getItem("allMasterId");
		data.userId = localStorage.getItem("allMasterId");
		if (profileData.status === 5 || profileData.status === 6) {
			updataUserUrl = `${URL}user/updateUserDetails`;
			delete data.approvedOn;
			delete data._id;
			delete data.status;
		} else {
			updataUserUrl = `${URL}user/addUserDetails`;
		}
		try {
			await fetchData(
				{
					url: updataUserUrl,
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			);
			queryClient.invalidateQueries({
				queryKey: ["teamDetails"],
			});
			queryClient.invalidateQueries({
				queryKey: ["allUsers"],
			});
			dispatch(setStatus(3));
			navigate("/verification");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setDisable(false);
		}
	};

	function uploadHandler(event, type) {
		const file = event.target.files[0];
		const errorMessage = {
			NoFileError: `Upload file first`,
			fileTypeErr: `Upload only Pdf`,
			fileSizeErr: `Upload file under 1 MB`,
		};
		if (file.name === gstFile.fileName) {
			event.target.value = null;
			return setBlCopyValidate("Upload a different file");
		}
		if (file.name === blFile.fileName) {
			event.target.value = null;
			return setGstFileValidate("Upload a different file");
		}
		fileReaderFunction({
			fileEvent: event,
			fileType: "pdf",
			fileSize: 1024 * 1024,
			errorMessage,
			fileRead: "readAsDataURL",
		})
			.then((data) => {
				if (type === "gst") {
					setGstFileValidate("");
					setGstFile({
						fileName: data.fileName,
						fileData: data.fileData,
					});
				} else {
					setBlCopyValidate("");
					setBlFile({
						fileName: data.fileName,
						fileData: data.fileData,
					});
				}
			})
			.catch((error) => {
				if (type === "gst") {
					setGstFileValidate(error.message);
				} else {
					setBlCopyValidate(error.message);
				}
			});
		event.target.value = null;
	}

	function CountryDropdown({ countryList }) {
		return countryList
			.filter((country) => country.countryCode === "in")
			.map((item) => (
				<option key={item._id} value={item._id}>
					{convertFirstLettersAsUpperCase(item.countryName)}
				</option>
			));
	}

	useEffect(() => {
		if (profileData.status === 5 || profileData.status === 6) {
			fetchExistingKycDetails.mutate(profileData.userId);
		}
	}, []);
	useEffect(() => {
		if (!isLoading) {
			reset({
				country: countryList.filter(
					(country) => country.countryCode === "in"
				)[0]._id,
			});
		}
	}, [isLoading]);

	const removeUploadedFile = (value) => {
		if (value === "gst") {
			setGstFileValidate("");
		} else {
			setBlCopyValidate("");
		}
	};

	if (isLoading || fetchExistingKycDetails.isLoading) {
		return <Loader />;
	}

	return (
		<div className={`container ${styles.flexdiv} pb-5`} id="disclaimerdiv">
			<div className={styles.newuser}>
				<p>
					Want to fill afterwards ?{" "}
					<button onClick={() => mutate()} className={styles.forgot}>
						Logout
					</button>
				</p>
			</div>
			<Form
				onSubmit={handleSubmit(postKycUserData)}
				className={styles.form}>
				<div className={styles.almostdiv}>
					<img
						src={Logo}
						alt="AllMasters Logo"
						className="masterlogo"
					/>
					<h5 className="pt-2">Almost There !</h5>
					<p>Filling the final formalities</p>
				</div>
				<Form.Group className="pt-3">
					<Form.Label
						className={styles.almostlabels}
						htmlFor="company">
						Legal Entity Name
					</Form.Label>
					<span style={{ color: "red" }}>*</span>
					<Controller
						name="legalName"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="company"
								className={`${styles.almostinputs} form-control col-md-3`}
								aria-describedby="passwordHelpBlock"
								placeholder="Enter Company Name"
							/>
						)}
					/>
					{errors.legalName && (
						<p className="errormsg">{errors.legalName.message}</p>
					)}
				</Form.Group>
				<Form.Group className="pt-3">
					<Form.Label
						className={styles.almostlabels}
						htmlFor="country">
						Country
					</Form.Label>
					<span style={{ color: "red" }}>*</span>
					<Controller
						name="country"
						control={control}
						render={({ field }) => (
							<Form.Select
								{...field}
								className={styles.almostinputs}
								disabled={true}
								id="country">
								{countryList && (
									<CountryDropdown
										countryList={countryList}
									/>
								)}
							</Form.Select>
						)}
					/>
					{errors.country && (
						<p className="errormsg">{errors.country.message}</p>
					)}
				</Form.Group>
				<Form.Group className="pt-3">
					<Form.Label className={styles.almostlabels} htmlFor="state">
						State
					</Form.Label>
					<span style={{ color: "red" }}>*</span>
					<Controller
						name="state"
						control={control}
						render={({ field }) => (
							<Form.Select
								{...field}
								className={styles.almostinputs}
								id="state">
								<option hidden>Choose State</option>
								{stateData?.map((e, index) => {
									return (
										<option key={index} value={e}>
											{convertFirstLettersAsUpperCase(e)}
										</option>
									);
								})}
							</Form.Select>
						)}
					/>
					{errors.state && (
						<p className="errormsg">{errors.state.message}</p>
					)}
				</Form.Group>
				<Form.Group className="pt-3">
					<Form.Label className={styles.almostlabels} htmlFor="city">
						City
					</Form.Label>
					<span style={{ color: "red" }}>*</span>
					<Controller
						name="city"
						control={control}
						render={({ field }) => (
							<Form.Select
								{...field}
								className={styles.almostinputs}
								id="city">
								<option hidden>Choose City</option>
								{cityData?.map((e, index) => {
									return (
										<option key={index} value={e}>
											{convertFirstLettersAsUpperCase(e)}
										</option>
									);
								})}
							</Form.Select>
						)}
					/>
					{errors.city && (
						<p className="errormsg">{errors.city.message}</p>
					)}
				</Form.Group>
				<Form.Group className="pt-3">
					<div className={styles.gstlabel}>
						<Form.Label
							className={styles.almostlabels}
							htmlFor="gst">
							GST
							<span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Tooltip
							style={{ paddingBottom: "0.5rem" }}
							title="Maximum 1MB PDF is allowed">
							<InfoIcon />
						</Tooltip>
					</div>
					<div className={styles.gstdiv}>
						<div className={styles.gstno}>
							<Controller
								name="gstNumber"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="text"
										onChange={(e) => {
											field.onChange(
												e.target.value?.toUpperCase()
											);
										}}
										id="gst"
										className={`${styles.almostinputs} ${styles.gstinputs} form-control  col-md-3`}
										placeholder="Enter GST Number"
										maxLength={15}
									/>
								)}
							/>
						</div>
						<div className={styles.gstfileupload}>
							<LabelComponent
								state={gstFile}
								type={"gst"}
								setter={setGstFile}
								removeFile={removeUploadedFile}
							/>
							<input
								id="gstfile"
								className={styles.gstfile}
								onChange={(event) => {
									uploadHandler(event, "gst");
								}}
								type="file"
							/>
						</div>
					</div>
					{errors.gstNumber ? (
						<p className="errormsg">{errors.gstNumber.message}</p>
					) : (
						<p className="errormsg">{gstFileValidate}</p>
					)}
				</Form.Group>
				<Form.Group className={`${styles.iconposition} pt-3`}>
					<Form.Label className={styles.almostlabels} htmlFor="pan">
						PAN
					</Form.Label>
					<span style={{ color: "red" }}>*</span>
					<Controller
						name="pan"
						control={control}
						render={({ field }) => (
							<Form.Control
								{...field}
								type="text"
								id="pan"
								className={`${styles.almostinputs} ${styles.gstinputs} form-control  col-md-3`}
								aria-describedby="passwordHelpBlock"
								placeholder="Enter PAN Number"
								maxLength={10}
							/>
						)}
					/>
					{errors.pan && (
						<p className="errormsg">{errors.pan.message}</p>
					)}
				</Form.Group>
				<div className={styles.traderdiv}>
					<Form.Group className={`${styles.iconposition} pt-3`}>
						<Form.Label
							className={styles.almostlabels}
							htmlFor="trader">
							MTO / Trade License
						</Form.Label>
						<span style={{ color: "red" }}>*</span>
						<Controller
							name="mto"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="trader"
									className={`${styles.almostinputs} form-control  col-md-3`}
									aria-describedby="passwordHelpBlock"
									placeholder="Enter MTO / Trade License"
								/>
							)}
						/>
						{errors.mto && (
							<p className="errormsg">{errors.mto.message}</p>
						)}
					</Form.Group>
					<Form.Group className={`${styles.iconposition} pt-3`}>
						<Form.Label
							className={styles.almostlabels}
							htmlFor="groupName">
							Group Name (if any)
						</Form.Label>
						<Controller
							name="groupName"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="groupName"
									className={`${styles.almostinputs} form-control  col-md-3`}
									aria-describedby="passwordHelpBlock"
									placeholder="Enter Name"
								/>
							)}
						/>
					</Form.Group>
				</div>
				<Form.Group className={`${styles.iconposition} pt-3`}>
					<div className={styles.bllabel}>
						<Tooltip
							style={{ paddingBottom: "0.5rem" }}
							title="Maximum 1MB PDF is allowed">
							<InfoIcon />
						</Tooltip>
					</div>
					<div className={styles.gstdiv}>
						<div className={styles.blcopy}>
							B/L Copy Stationery
							<span style={{ color: "red" }}>*</span>
						</div>
						<div className={styles.gstfileupload}>
							<LabelComponent
								state={blFile}
								type={"bl"}
								setter={setBlFile}
								removeFile={removeUploadedFile}
							/>
							<input
								id="blfileupload"
								className={styles.blfileupload}
								type="file"
								onChange={(event) => uploadHandler(event, "bl")}
							/>
						</div>
					</div>
					<p className="errormsg">{blCopyValidate}</p>
				</Form.Group>
				<Form.Group className={`${styles.iconposition} pt-3`}>
					<div className={styles.disclaimer}>
						<p>
							<span>Disclaimer</span> : MTO / Trade License, HBL
							Copy Stationery, GSTIN & PAN should belong to the
							same company
						</p>
					</div>
				</Form.Group>
				<Button
					type="submit"
					disabled={disable}
					id="Continuebtn"
					onClick={() => {
						if (gstFile.fileData === null) {
							setGstFileValidate("Please Upload GST File");
							setDisable(false);
						}
						if (blFile.fileData === null) {
							setBlCopyValidate("Please Upload BL File");
							setDisable(false);
						}
					}}
					className={`${styles.loginbtn} w-100`}>
					{disable ? <CircularProgress /> : "Continue"}
				</Button>
			</Form>
		</div>
	);
}

export default KycFormality;
