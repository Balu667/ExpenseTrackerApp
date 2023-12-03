import styles from "./index.module.css";
import Form from "react-bootstrap/Form";
import { profileValidation } from "../../../validationSchema/profileValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { keyMatchLoop, removeDuplicates } from "../../../helper";
import {
	useMutateUserProfileData,
	useMutateUserPreferedLane,
} from "../../../hooks/profileData";
import { useEffect, useState } from "react";
import Popup from "../../../components/ConfirmationPopup";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import Loader from "../../../components/Loader/Loader";
import { CircularProgress } from "@mui/material";
import OriginForwarder from "./OriginForwarder/index";
import DestinationForwarder from "./DestinationForwarder/index";
import NotifyParty from "./NotifyParty/index";
import { useGetDestinationForwarderList } from "../../../hooks/destinationForwarder";
import { useDispatch, useSelector } from "react-redux";
import { useGetOriginForwarderList } from "../../../hooks/originForwarder";
import { useGetNotifyPartyList } from "../../../hooks/notifyParty";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import styled from "@emotion/styled";
import { useLane } from "../../../hooks/lane";
import { updateProfileData } from "../../../redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Phone } from "../../../assets/Icons/phone.svg";
import { ReactComponent as Mail } from "../../../assets/Icons/mail.svg";
import { useDeleteSubUser, useGetSubUsers } from "../../../hooks/addUser";
import DeleteIcon from "@mui/icons-material/Delete";
import { useProfileData } from "../../../hooks/userAuthManagement";
import { useQueryClient } from "@tanstack/react-query";

function MyAccount() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const id = localStorage.getItem("allMasterId");
	const [disable, setDisable] = useState(true);
	const [preferredLane, setPreferredLane] = useState("");
	const [subUserId, setSubUserId] = useState("");
	const [toggleState, setToggleState] = useState("originForwarder");
	const role = useSelector((state) => state.profile.role);
	let userDetail = useSelector((state) => state.profile.profileData);
	const { data: profileData, isLoading: userDataLoading } = useProfileData(
		id,
		role
	);
	const queryClient = useQueryClient();
	const titleText = "Delete User ?";
	const contentText = "Are you sure that you want to delete this User ?";

	const userData = profileData != null ? profileData[0] : null;

	const {
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm({
		resolver: yupResolver(profileValidation),
		mode: "onTouched",
		defaultValues: {
			legalName: "",
			fullName: "",
			mobileNumber: "",
			email: "",
		},
		values: userData,
	});

	const mutateOnSuccessFunctions = async () => {
		setDisable(true);
		await queryClient.invalidateQueries({ queryKey: ["profileData"] });
		reset({ ...userData });
	};

	const { data: destinationFList, isLoading: destinationFLoading } =
		useGetDestinationForwarderList(userData?.legalName);

	const { data: originFList, isLoading: originfLoading } =
		useGetOriginForwarderList(userData?.legalName);
	const { data: notifySavedAddressList, isLoading: notifyPartyLoading } =
		useGetNotifyPartyList(userData?.legalName);

	const { mutate, isLoading: isUpdating } = useMutateUserProfileData(
		mutateOnSuccessFunctions
	);

	const onPreferedLaneSuccess = () => {
		const updatePreferedLane = keyMatchLoop(
			"portCode",
			laneList,
			preferredLane
		)._id;
		dispatch(updateProfileData({ preferredGateway: updatePreferedLane }));
	};

	const { mutate: deleteSubUser } = useDeleteSubUser();

	const { data: laneList, isLoading: laneListLoading } = useLane({
		refetchInterval: false,
		refetchOnWindowFocus: false,
	});

	const userId = () => {
		if (userData != null) {
			if (userData.userId) {
				return userData.userId;
			} else {
				return userData._id;
			}
		} else {
			return null;
		}
	};

	const { isLoading: subUserDataLoading, data: subUserData } = useGetSubUsers(
		userId()
	);

	const { mutate: mutateUserPreferredLane } = useMutateUserPreferedLane(
		onPreferedLaneSuccess
	);

	const CustomisedToggleButton = styled(ToggleButtonGroup)`
		.MuiToggleButton-root.Mui-selected {
			background: black !important;
			color: #fff !important;
		}
		.MuiButtonBase-root {
			max-width: 150px;
		}
	`;

	useEffect(() => {
		if (
			userData != null &&
			userData?.preferredGateway != null &&
			laneList != null
		) {
			const bindPreferredLane = keyMatchLoop(
				"_id",
				laneList,
				userData.preferredGateway
			).portCode;
			setPreferredLane(bindPreferredLane);
		}
	}, [laneList, userData]);

	if (
		destinationFLoading ||
		originfLoading ||
		notifyPartyLoading ||
		subUserDataLoading ||
		laneListLoading ||
		userDataLoading
	) {
		return <Loader />;
	}

	const userPreferredLane = (event, value) => {
		if (value !== null) {
			setPreferredLane(value);
		}
		const postData = {};
		const preferredLaneId = keyMatchLoop("portCode", laneList, value)._id;
		postData.userId = userDetail.userId;
		postData.preferredGateway = preferredLaneId;
		mutateUserPreferredLane(postData);
	};

	const handleToggle = (type) => {
		switch (type) {
			case "originForwarder":
				setToggleState("originForwarder");
				break;
			case "destinationForwarder":
				setToggleState("destinationForwarder");
				break;
			case "notifyParty":
				setToggleState("notifyParty");
				break;
			default:
				break;
		}
	};
	const deleteSubUsers = () => {
		deleteSubUser(subUserId);
		dispatch(closePopup());
	};

	const onSubmit = (data) => {
		const postData = {
			id: data._id,
			fullName: data.fullName,
			mobileNumber: data.mobileNumber,
		};
		mutate(postData);
	};

	const uniqueArray = removeDuplicates(originFList, "pincode");

	return (
		<>
			<div className={styles.mainbody}>
				<div className={`container ${styles.containerdiv}`}>
					<h1>My Account</h1>
				</div>
				<div className="container">
					<div className={styles.personalcon}>
						<div className={styles.personaldiv}>
							<h2>Personal Details</h2>
							<button
								className={styles.editbtn}
								onClick={() => setDisable(false)}>
								Edit
							</button>
						</div>
						<div
							className={`${styles.detailsdiv} ${styles.personaldetailsdiv}`}>
							<Form onSubmit={handleSubmit(onSubmit)}>
								<div className={styles.fromdiv}>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor="fullName"
											className={styles.formlabel}>
											Name
										</Form.Label>
										<Controller
											name="fullName"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="fullName"
													disabled={disable}
													className={styles.disable}
												/>
											)}
										/>
										{errors.fullName && (
											<p className="errormsg">
												{errors.fullName.message}
											</p>
										)}
									</Form.Group>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor="email"
											className={styles.formlabel}>
											Email
										</Form.Label>
										<Controller
											name="email"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="email"
													disabled={true}
													className={`${styles.disable} ${styles.style}`}
												/>
											)}
										/>
									</Form.Group>
								</div>
								<div className={styles.fromdiv}>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor="Mobile"
											className={styles.formlabel}>
											Mobile Number
										</Form.Label>
										<Controller
											name="mobileNumber"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="Mobile"
													maxLength={10}
													onChange={(event) => {
														field.onChange(
															event.target.value.replace(
																/[^\d]+/g,
																""
															)
														);
													}}
													disabled={disable}
													className={styles.disable}
												/>
											)}
										/>
										{errors.mobileNumber && (
											<p className="errormsg">
												{errors.mobileNumber.message}
											</p>
										)}
									</Form.Group>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor="Company Name"
											className={styles.formlabel}>
											Company Name
										</Form.Label>
										<Controller
											name="legalName"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													style={{
														textTransform:
															"capitalize",
													}}
													id="Company Name"
													disabled={true}
													className={styles.disable}
												/>
											)}
										/>
									</Form.Group>
								</div>
								{!disable && (
									<div className={styles.btndiv}>
										<button
											disabled={isUpdating}
											type="submit"
											className={styles.savebtn}>
											{isUpdating ? (
												<CircularProgress />
											) : (
												"Save Changes"
											)}
										</button>
									</div>
								)}
							</Form>
						</div>
					</div>
					{!userData?.userId && (
						<div className={styles.personalcon}>
							<div className={styles.personaldiv}>
								<h2>Preferred Lane</h2>
							</div>
							<div className={styles.lanediv}>
								<CustomisedToggleButton
									value={preferredLane}
									exclusive
									onChange={(event, value) =>
										userPreferredLane(event, value)
									}
									className={styles.customButton}
									aria-label="text alignment">
									{laneList.length > 0 &&
										laneList
											.filter(
												(value) =>
													value.type === 1 &&
													value.status === 1
											)
											.map((value) => {
												return (
													<ToggleButton
														key={value._id}
														sx={{
															backgroundColor:
																"#EDEDED",
														}}
														value={value.portCode}
														aria-label="left aligned"
														style={{
															borderRadius: "5px",
															border: "solid 0.1px grey",
														}}
														className={`toggle ${styles.periorityLane}`}>
														<div
															className={
																styles.togglediv
															}>
															<p
																className={
																	styles.portname
																}>
																{value.portName}
															</p>
															<h1>
																{value.portCode}
															</h1>
														</div>
													</ToggleButton>
												);
											})}
								</CustomisedToggleButton>
							</div>
						</div>
					)}

					{
						<div className={styles.toggleGroupClassdiv}>
							<div className={styles.toggleGroupClass}>
								{uniqueArray.length > 0 && (
									<div className={styles.buttonsdiv}>
										<p
											className={`${styles.count} ${
												toggleState ===
												"originForwarder"
													? styles.activenumber
													: ""
											}`}>
											{uniqueArray.length}
										</p>
										<button
											className={`${styles.subToggle} ${
												toggleState ===
												"originForwarder"
													? styles.activbtn
													: ""
											}`}
											onClick={() =>
												handleToggle("originForwarder")
											}>
											Origin Forwarder
										</button>
									</div>
								)}
								{destinationFList.length > 0 && (
									<div className={styles.buttonsdiv}>
										<p
											className={`${styles.count} ${
												toggleState ===
												"destinationForwarder"
													? styles.activenumber
													: ""
											}`}>
											{destinationFList.length}
										</p>
										<button
											className={`${styles.subToggle} ${
												toggleState ===
												"destinationForwarder"
													? styles.activbtn
													: ""
											}`}
											onClick={() =>
												handleToggle(
													"destinationForwarder"
												)
											}>
											Destination Forwarder
										</button>
									</div>
								)}
								{notifySavedAddressList.length > 0 && (
									<div className={styles.buttonsdiv}>
										<p
											className={`${styles.count} ${
												toggleState === "notifyParty"
													? styles.activenumber
													: ""
											}`}>
											{notifySavedAddressList.length}
										</p>
										<button
											className={`${styles.subToggle} ${
												toggleState === "notifyParty"
													? styles.activbtn
													: ""
											}`}
											onClick={() =>
												handleToggle("notifyParty")
											}>
											Notify Party
										</button>
									</div>
								)}
							</div>
						</div>
					}
					{toggleState === "originForwarder" &&
						uniqueArray.length > 0 && (
							<OriginForwarder
								show={userData?.userId}
								originFList={originFList}
							/>
						)}
					{toggleState === "destinationForwarder" &&
						destinationFList.length > 0 && (
							<DestinationForwarder
								destinationFList={destinationFList}
							/>
						)}
					{toggleState === "notifyParty" &&
						notifySavedAddressList.length > 0 && (
							<NotifyParty
								notifySavedAddressList={notifySavedAddressList}
							/>
						)}

					<div className={styles.personalcon} style={{}}>
						<div className={styles.personaldiv}>
							<h2>My Team</h2>
							{!userData?.userId && (
								<button
									className={styles.editbtn}
									onClick={() =>
										navigate("/user/Myaccount/addUser")
									}
									disabled={
										subUserData.length >= 4 ||
										userData?.userId
									}>
									Add Member
								</button>
							)}
						</div>
						<div className={styles.card}>
							{subUserData.length > 0 ? (
								subUserData.map((subUser, index) => {
									return (
										<div
											key={subUser._id}
											className={styles.AddressCarddiv}>
											<div
												className={
													styles.AddressCardtxt
												}>
												<div
													className={
														styles.subUserName
													}>
													<div
														className={
															styles.subUserName
														}>
														<h1>
															{subUser.fullName}
														</h1>
														<div
															style={{
																display: "flex",
																gap: "10px",
																alignItems:
																	"center",
															}}>
															<div
																style={{
																	width: "7px",
																	height: "7px",
																	background:
																		subUser.status ===
																		1
																			? "green"
																			: "red",
																	borderRadius:
																		"10px",
																	margin: "0 0 7px 10px",
																}}></div>
														</div>
													</div>
													{!userData?.userId && (
														<DeleteIcon
															sx={{
																cursor: "pointer",
																color: "red",
															}}
															onClick={() => {
																if (
																	!userData?.userId
																) {
																	dispatch(
																		openPopup()
																	);
																	setSubUserId(
																		subUser._id
																	);
																}
															}}
															disabled={true}
														/>
													)}
												</div>
												<p>
													<Mail />
													<span
														className={
															styles.emails
														}>
														{subUser.email}
													</span>
												</p>
												<p>
													<Phone />
													{`${subUser.mobileCode} ${subUser.mobileNumber}`}
												</p>
											</div>
										</div>
									);
								})
							) : (
								<div>
									<h5>No Sub Users</h5>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Popup
				handleAgree={deleteSubUsers}
				titleText={titleText}
				contentText={contentText}
			/>
		</>
	);
}

export default MyAccount;
