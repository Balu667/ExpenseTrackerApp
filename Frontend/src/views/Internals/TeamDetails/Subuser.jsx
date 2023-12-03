import { useState } from "react";
import "./Subuser.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { ReactComponent as Indflag } from "../../../assets/Images/indflag.svg";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import {
	useGetTeamDetails,
	useMutateUser,
} from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import moment from "moment/moment";
import { useInternalUser } from "../../../hooks/internalUser";
import {
	convertFirstLettersAsUpperCase,
	openFileNewWindow,
} from "../../../helper";
import Popup from "../../../components/ConfirmationPopup";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import { useGetSubUsers } from "../../../hooks/addUser";
import ViewHistoryModal from "../../../components/ViewHistoryModal";

function Subuser() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [path, setPath] = useState("");
	const [viewHistoryModalShow, setViewHistoryModalShow] = useState(false);
	const sidebar = useSelector((state) => state.sidebar);
	const date = moment().format("DD-MM-YYYY");
	const { mutate, isLoading: isMutatingUser } = useMutateUser(path);
	const userId = localStorage.getItem("allMasterId");
	const [confirmPopup, setConfirmPopup] = useState({
		approve: false,
		reject: false,
		revalidate: false,
	});
	const [titleText, setTitleText] = useState("");
	const [contentText, setContentText] = useState("");

	const columns = [
		{
			field: "fullName",
			flex: 1,
			headerName: "FULL NAME",
			width: 200,
			valueFormatter: (params) => {
				if (params.value == null) {
					return "";
				}
				return convertFirstLettersAsUpperCase(params.value);
			},
		},
		{ field: "mobileNumber", flex: 1, headerName: "MOBILE", width: 200 },
		{
			field: "email",
			flex: 1,
			headerName: "EMAIL",
			width: 200,
			valueFormatter: (params) => {
				if (params.value == null) {
					return "";
				}
				return params.value;
			},
		},
	];

	const { data, isLoading, isError, error } = useGetTeamDetails(id);

	const { data: userList, isLoading: userLoading } = useInternalUser();

	const { data: SubUserList, isLoading: subUserLoading } = useGetSubUsers(id);

	if (isLoading || userLoading || subUserLoading) {
		return <Loader />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	const singleUserData = data;
	const userProfile = userList.filter((e) => e._id === userId);
	const reasonLength = singleUserData[0].reason.length;
	const role =
		singleUserData[0].status !== 4
			? singleUserData[0].reason[reasonLength - 1].role
			: "";

	const approveUser = () => {
		mutate({
			id,
			status: 1,
			reason: {
				message: " ",
				role: `${userProfile[0].fullName}`,
				time: date,
				status: "Approved",
				id: userId,
			},
		});
		dispatch(closePopup());
	};
	const rejectUser = () => {
		mutate({
			id,
			status: 7,
			reason: {
				message: " ",
				role: `${userProfile[0].fullName}`,
				time: date,
				status: "Rejected",
				id: userId,
			},
		});
		dispatch(closePopup());
	};
	const revalidateUser = () => {
		mutate({
			id,
			status: 6,
			reason: {
				message: " ",
				role: `${userProfile[0].fullName}`,
				time: date,
				status: "Revalidated",
				id: userId,
			},
		});
		dispatch(closePopup());
	};
	const openConfirmationPopup = () => {
		if (confirmPopup.approve === true) {
			approveUser();
		} else if (confirmPopup.reject === true) {
			rejectUser();
		} else if (confirmPopup.revalidate === true) {
			revalidateUser();
		}
	};

	const alluser = singleUserData.concat(SubUserList);

	return (
		<div className="countrydiv">
			<div className="headingdiv">
				<div className="titlediv">
					{!sidebar.sidebarStatus && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => dispatch(openSidebar())}
							className="icon">
							<MenuIcon />
						</IconButton>
					)}
					<h3 className="title">Team Details</h3>
				</div>
			</div>
			{singleUserData[0].status === 4 && (
				<div className="buttonDiv">
					<button
						className="approvebutton"
						disabled={isMutatingUser}
						onClick={() => {
							setPath("/admin/users/");
							dispatch(openPopup());
							setTitleText(" Approve NewUser ?");
							setContentText(
								"Are you sure, You want to Approve this User ?"
							);
							setConfirmPopup((prevState) => ({
								...prevState,
								approve: true,
							}));
						}}>
						Approve
					</button>
					<button
						className="rejectbutton"
						disabled={isMutatingUser}
						onClick={() => {
							setPath("/admin/users/");
							dispatch(openPopup());
							setTitleText(" Reject NewUser ?");
							setContentText(
								"Are you sure, You want to Reject this User?"
							);
							setConfirmPopup((prevState) => ({
								...prevState,
								reject: true,
							}));
						}}>
						Reject
					</button>
					<button
						className="revalidatebutton"
						disabled={isMutatingUser}
						onClick={() => {
							setPath("/admin/users/");
							dispatch(openPopup());
							setTitleText(" Revalidate NewUser ?");
							setContentText(
								"Are you sure, You want to Revalidate this User?"
							);
							setConfirmPopup((prevState) => ({
								...prevState,
								revalidate: true,
							}));
						}}>
						Revalidate
					</button>
				</div>
			)}
			<div className="searchdiv">
				<div className="searchUserbox">
					<div className="upperDiv">
						<div className="companyName">
							<h4 style={{ textTransform: "capitalize" }}>
								<Indflag /> {singleUserData[0].legalName}
							</h4>
							<span
								className="groupname"
								style={{ textTransform: "capitalize" }}>
								{singleUserData[0].groupName}
							</span>
						</div>
					</div>
					<div className="upperDivs">
						<div className="commonDiv">
							<p className="commonDivhead">Country</p>
							<p className="commonDivval">India </p>
						</div>
						<div className="commonDiv">
							<p className="commonDivhead">State</p>
							<p
								className="commonDivval"
								style={{ textTransform: "capitalize" }}>
								{singleUserData[0].state}
							</p>
						</div>
						<div className="commonDiv">
							<p className="commonDivhead">City</p>
							<p
								className="commonDivval"
								style={{ textTransform: "capitalize" }}>
								{singleUserData[0].city}
							</p>
						</div>
						<div className="commonDiv">
							<p className="commonDivhead">PAN</p>
							<p
								className="commonDivval"
								style={{ textTransform: "uppercase" }}>
								{singleUserData[0].pan}
							</p>
						</div>
						<div className="commonDiv">
							<p className="commonDivhead">MTO/Trader License</p>
							<p className="commonDivval">
								{convertFirstLettersAsUpperCase(
									singleUserData[0].mto
								)}
							</p>
						</div>

						<div className="commonDiv">
							<p className="commonDivhead">Documents</p>
							<a
								className="commonDivvalyellow"
								onClick={(e) => {
									e.preventDefault();
									openFileNewWindow(
										singleUserData[0].gstFilePath
									);
								}}
								style={{ textTransform: "uppercase" }}>
								{singleUserData[0].gstNumber}
							</a>
							<a
								className="commonDivvalyellow"
								target="_blank"
								referrerPolicy="no-referrer"
								onClick={(e) => {
									e.preventDefault();
									openFileNewWindow(
										singleUserData[0].blCopyPath
									);
								}}>
								BL file
							</a>
						</div>
						<div className="commonDiv">
							<button
								className="viewBtn"
								onClick={() => setViewHistoryModalShow(true)}>
								View History
							</button>
						</div>
					</div>
					<div className="lowerDiv">
						{singleUserData[0].status === 1 && (
							<>
								<div className="commonDiv">
									<p className="commonDivhead">Approved By</p>
									<p
										className="commonDivval"
										style={{ textTransform: "capitalize" }}>
										{role}
									</p>
								</div>
								<div className="commonDiv">
									<p className="commonDivhead">Approved on</p>
									<p className="commonDivval">
										{moment(
											singleUserData[0].approvedOn
										).format("DD-MM-YYYY")}
									</p>
								</div>
							</>
						)}
						{singleUserData[0].status === 7 && (
							<>
								<div className="commonDiv">
									<p className="commonDivhead">Rejected By</p>
									<p
										className="commonDivval"
										style={{ textTransform: "capitalize" }}>
										{role}
									</p>
								</div>
								<div className="commonDiv">
									<p className="commonDivhead">Rejected on</p>
									<p className="commonDivval">
										{moment(
											singleUserData[0].approvedOn
										).format("DD-MM-YYYY")}
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<ViewHistoryModal
				show={viewHistoryModalShow}
				handleClose={() => setViewHistoryModalShow(false)}
				reasonArray={singleUserData[0].reason}
			/>
			<div
				style={{
					height: 430,
					width: "100%",
					marginTop: "10px",
					borderRadius: "5px",
				}}>
				<DataGrid
					getRowId={(row) => row._id}
					rows={alluser}
					columns={columns}
					pageSize={6}
					rowsPerPageOptions={[6]}
					loading={isLoading}
					autoPageSize
				/>
			</div>
			<Popup
				setConfirmPopup={setConfirmPopup}
				handleAgree={() => openConfirmationPopup()}
				titleText={titleText}
				contentText={contentText}
			/>
		</div>
	);
}

export default Subuser;
