import React from "react";
import "./index.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import { ReactComponent as Indflag } from "../../../../assets/Images/indflag.svg";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../../redux/slices/sidebarSlice";
import { getCfsTeamDetails } from "../../../../hooks/cfsManagement";
import { useCountries } from "../../../../hooks/country";
import { useLane } from "../../../../hooks/lane";
import Loader from "../../../../components/Loader/Loader";
import {
	convertFirstLettersAsUpperCase,
	keyMatchLoop,
	openFileNewWindow,
} from "../../../../helper";
import { useInternalUser } from "../../../../hooks/internalUser";
import moment from "moment";

function Subuser() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const sidebar = useSelector((state) => state.sidebar);
	const ProfileRole = useSelector((state) => state.profile.role);
	const { data: userList, isLoading: userLoading } = useInternalUser();

	let gateway;
	let destination;

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
		{ field: "mobileNo", flex: 1, headerName: "MOBILE", width: 200 },
		{ field: "email", flex: 1, headerName: "EMAIL", width: 200 },
	];
	const { data: countryList, isLoading: countryLoading } = useCountries();
	const { data: laneList, isLoading: laneLoading } = useLane();
	const { data, isLoading, isError, error } = getCfsTeamDetails(id);

	if (isLoading || laneLoading || countryLoading || userLoading) {
		return <Loader />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (laneList.length !== 0) {
		for (let i = 0; i < laneList.length; i++) {
			if (laneList[i]._id === data.gateway) {
				gateway = laneList[i].portName;
			}
			if (laneList[i]._id === data.destination) {
				destination = laneList[i].portName;
			}
		}
	}

	const countryName = keyMatchLoop(
		"_id",
		countryList,
		data.countryName
	).countryName;

	const userProfile = userList.filter((e) => e._id === data.createdBy);

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
					<h3 className="title">
						<Link
							to={`/${
								ProfileRole === 2 ? "admin" : "obteam"
							}/cfsmanagement/`}
							style={{
								color: "black",
								textDecoration: "none",
							}}>
							CFS Details
						</Link>
					</h3>
				</div>
			</div>

			<div className="searchdiv">
				<div className="searchUserbox">
					<div className="upperDiv">
						<div className="companyName">
							<h4>
								{" "}
								<Indflag />{" "}
								{convertFirstLettersAsUpperCase(data.cfsName)}
							</h4>
							<span className="groupname">
								{convertFirstLettersAsUpperCase(data.cfsBranch)}
							</span>
						</div>
					</div>
					<div className="lowerDiv">
						<div className="commonDiv">
							<p className="commonDivhead">Country</p>
							<p
								className="commonDivval"
								style={{ textTransform: "capitalize" }}>
								{countryName}
							</p>
						</div>
						<div className="commonDiv">
							<p className="commonDivhead">Type</p>
							<p className="commonDivval">
								{data.type === 1
									? "Origin CFS"
									: "Destination CFS"}
							</p>
						</div>
						{data.type === 1 && (
							<div className="commonDiv">
								<p className="commonDivhead">Gateway</p>
								<p className="commonDivval">{gateway}</p>
							</div>
						)}
						{data.type === 2 && (
							<div className="commonDiv">
								<p className="commonDivhead">Destination</p>
								<p className="commonDivval">{destination}</p>
							</div>
						)}
						<div className="commonDiv">
							<p className="commonDivhead">Created By</p>
							<p
								className="commonDivval"
								style={{ textTransform: "capitalize" }}>
								{userProfile[0].fullName}
							</p>
						</div>
						<div className="commonDiv">
							<p className="commonDivhead">Created On</p>
							<p className="commonDivval">
								{" "}
								{moment(data.createdAt).format("DD-MM-YYYY")}
							</p>
						</div>
						<div className="commonDiv">
							<p className="commonDivhead">Documents</p>
							{data.cfsCertificate &&
								data.cfsCertificate.map((file, i) => {
									return (
										<a
											key={i}
											target="_blank"
											referrerPolicy="no-referrer"
											className="commonDivvalyellow"
											onClick={(e) => {
												e.preventDefault();
												openFileNewWindow(
													file.filePath
												);
											}}>
											{file.fileName}
										</a>
									);
								})}
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					height: 430,
					width: "100%",
					marginTop: "10px",
					borderRadius: "5px",
				}}>
				<DataGrid
					getRowId={(row) => row._id}
					rows={[data]}
					columns={columns}
					pageSize={10}
					autoPageSize
					loading={isLoading}
				/>
			</div>
		</div>
	);
}

export default Subuser;
