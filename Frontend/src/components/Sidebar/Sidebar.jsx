import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ReactComponent as RateIcon } from "../../assets/Icons/rate.svg";
import { ReactComponent as LaneIcon } from "../../assets/Icons/lane.svg";
import { ReactComponent as SchedulesIcon } from "../../assets/Icons/schedules.svg";
import { ReactComponent as CostHeadingIcon } from "../../assets/Icons/costheading.svg";
import { ReactComponent as CountryIcon } from "../../assets/Icons/country.svg";
import { ReactComponent as UserIcon } from "../../assets/Icons/usermanagement.svg";
import { ReactComponent as VendorIcon } from "../../assets/Icons/vendormanagment.svg";
import { ReactComponent as BookingIcon } from "../../assets/Icons/bookingmanagement.svg";
import { ReactComponent as Signout } from "../../assets/Icons/switch.svg";
import { AiOutlineDown } from "react-icons/ai";
import { BiCalendarEvent } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { useLogoutUser } from "../../hooks/userAuthManagement";
import { useSelector } from "react-redux";
import AllMastersAdminlogo from "../../assets/Images/AllMastersAdminlogo.jpg";

function Sidebar({ onClick }) {
	const [dropdown, setDropdown] = useState(false);
	const ProfileRole = useSelector((state) => state.profile.role);

	const { mutate } = useLogoutUser();

	let location = useLocation();
	const [activeStep, setActiveStep] = useState(
		location.pathname.split("/").pop()
	);

	useEffect(() => {
		setActiveStep(location.pathname.split("/").pop());
	}, [location]);

	return (
		<div className={styles.sidebardiv}>
			<div className={styles.sidebarcontainer}>
				<div className={styles.logodiv}>
					<div className={styles.allmasterlogodiv}>
						<img
							src={AllMastersAdminlogo}
							className={styles.allmasterimg}
							alt=""
						/>
						<h1 className={styles.allmastertxt}>AllMasters</h1>
					</div>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={onClick}
						edge="start">
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<div className={styles.listdiv}>
					<ul className={styles.slist}>
						{(ProfileRole === 2 || ProfileRole === 4) && (
							<>
								<li
									className={
										activeStep === "country"
											? styles.activesidebarstep
											: ""
									}>
									<Link
										to={"country"}
										className={`${styles.listitem} ${
											activeStep === "country"
												? styles.activesidebar
												: ""
										}`}>
										<CountryIcon
											className={
												activeStep === "country"
													? styles.activeicon
													: styles.inActvieIcon
											}
										/>
										Country
									</Link>
								</li>
								<li
									className={
										activeStep === "lane"
											? styles.activesidebarstep
											: ""
									}>
									<Link
										to={"lane"}
										className={`${styles.listitem} ${
											activeStep === "lane"
												? styles.activesidebar
												: ""
										}`}>
										<LaneIcon
											className={
												activeStep === "lane"
													? styles.activeicon
													: styles.inActvieIcon
											}
										/>
										Lane
									</Link>
								</li>
								<li
									className={
										activeStep === "costheading"
											? styles.activesidebarstep
											: ""
									}>
									<Link
										to={"costheading"}
										className={`${styles.listitem} ${
											activeStep === "costheading"
												? styles.activesidebar
												: ""
										}`}>
										<CostHeadingIcon
											className={
												activeStep === "costheading"
													? styles.activeicon
													: styles.inActvieIcon
											}
										/>
										Cost Heading
									</Link>
								</li>
								<li
									className={
										activeStep === "cfsmanagement"
											? styles.activesidebarstep
											: ""
									}>
									<VendorIcon
										className={
											activeStep === "cfsmanagement"
												? styles.activeicon
												: styles.inActvieIcon
										}
									/>
									<Link
										to={"cfsmanagement"}
										style={{
											textDecoration: "none",
											color: "black",
										}}
										className={`${styles.listitem} ${
											activeStep === "cfsmanagement"
												? styles.activesidebar
												: ""
										}`}>
										Vendor (CFS)
									</Link>
								</li>
								<li
									className={
										activeStep === "holidays"
											? styles.activesidebarstep
											: ""
									}>
									<Link
										to={"holidays"}
										className={`${styles.listitem} ${
											activeStep === "holidays"
												? styles.activesidebar
												: ""
										}`}>
										<BiCalendarEvent
											className={`${
												styles.holidaysicon
											} ${
												activeStep === "holidays"
													? styles.activeicon
													: styles.inActvieIcon
											}`}
										/>
										Holiday
									</Link>
								</li>
								<li
									className={
										activeStep === "schedules"
											? styles.activesidebarstep
											: ""
									}>
									<Link
										to={"schedules"}
										className={`${styles.listitem} ${
											activeStep === "schedules"
												? styles.activesidebar
												: ""
										}`}>
										<SchedulesIcon
											className={
												activeStep === "schedules"
													? styles.activeicon
													: styles.inActvieIcon
											}
										/>
										Schedule
									</Link>
								</li>
								<li
									className={
										activeStep === "rate"
											? styles.activesidebarstep
											: ""
									}>
									<Link
										to={"rate"}
										className={`${styles.listitem} ${
											activeStep === "rate"
												? styles.activesidebar
												: ""
										}`}>
										<RateIcon
											className={
												activeStep === "rate"
													? styles.activeicon
													: styles.inActvieIcon
											}
										/>
										Rate
									</Link>
								</li>
							</>
						)}
						{(ProfileRole === 2 || ProfileRole === 5) && (
							<li
								className={
									activeStep === "booking"
										? styles.activesidebarstep
										: ""
								}>
								<Link
									to={
										ProfileRole === 2
											? "/admin/booking"
											: "/ot/booking"
									}
									className={`${styles.listitem} ${
										activeStep === "booking"
											? styles.activesidebar
											: ""
									}`}>
									<BookingIcon
										className={
											activeStep === "booking"
												? styles.activeicon
												: styles.inActvieIcon
										}
									/>
									Booking
								</Link>
							</li>
						)}
					</ul>
				</div>
				<div className={styles.listdiv}>
					{ProfileRole === 3 && (
						<ul className={styles.slist}>
							<li
								className={
									activeStep === "cfsmanagement"
										? styles.activesidebarstep
										: ""
								}>
								<VendorIcon
									className={
										activeStep === "cfsmanagement"
											? styles.activeicon
											: styles.inActvieIcon
									}
								/>
								<Link
									to={"cfsmanagement"}
									className={`${styles.listitem} ${
										activeStep === "cfsmanagement"
											? styles.activesidebar
											: ""
									}`}>
									Vendor(CFS)
								</Link>
							</li>
						</ul>
					)}
				</div>
				{(ProfileRole === 2 || ProfileRole === 3) && (
					<div className={styles.listdiv}>
						<ul className={styles.slist}>
							<li
								onClick={() => setDropdown(!dropdown)}
								className={
									activeStep === "users"
										? styles.activesidebarstep
										: ""
								}>
								<Link
									to={"users"}
									className={`${styles.listitem} ${
										activeStep === "users"
											? styles.activesidebar
											: ""
									}`}>
									<UserIcon
										className={
											activeStep === "users"
												? styles.activeicon
												: styles.inActvieIcon
										}
									/>
									Users
									<AiOutlineDown />
								</Link>
							</li>
							{dropdown && (
								<div className={styles.dropdowndiv}>
									{ProfileRole === 2 && (
										<ul
											className={`${styles.dropdownlist} animate__animated animate__fadeInDown`}>
											<li
												className={
													activeStep === "newuser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep === "newuser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													className={`${
														styles.listitem
													} ${
														activeStep === "newuser"
															? styles.activesidebar
															: ""
													}`}
													to={"newuser"}>
													New Registration
												</Link>
											</li>
											<li
												className={
													activeStep ===
													"revalidateduser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep ===
														"revalidateduser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"revalidateduser"}
													className={`${
														styles.listitem
													} ${
														activeStep ===
														"revalidateduser"
															? styles.activesidebar
															: styles.inActvieIcon
													}`}>
													Revalidated
												</Link>
											</li>
											<li
												className={
													activeStep ===
													"accepteduser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep ===
														"accepteduser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"accepteduser"}
													className={`${
														styles.listitem
													} ${
														activeStep ===
														"accepteduser"
															? styles.activesidebar
															: ""
													}`}>
													Approved Users
												</Link>
											</li>

											<li
												className={
													activeStep ===
													"rejecteduser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep ===
														"rejecteduser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"rejecteduser"}
													className={`${
														styles.listitem
													} ${
														activeStep ===
														"rejecteduser"
															? styles.activesidebar
															: ""
													}`}>
													Rejected Users
												</Link>
											</li>
										</ul>
									)}
									{ProfileRole === 3 && (
										<ul
											className={`${styles.dropdownlist} animate__animated animate__fadeInDown`}>
											<li
												className={
													activeStep === "newuser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep === "newuser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"newuser"}
													className={`${
														styles.listitem
													} ${
														activeStep === "newuser"
															? styles.activesidebar
															: ""
													}`}
													style={{
														textDecoration: "none",
														color: "black",
													}}>
													New Registration
												</Link>
											</li>
											<li
												className={
													activeStep === "pendinguser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep ===
														"pendinguser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"pendinguser"}
													className={`${
														styles.listitem
													} ${
														activeStep ===
														"pendinguser"
															? styles.activesidebar
															: ""
													}`}
													style={{
														textDecoration: "none",
														color: "black",
													}}>
													Pending
												</Link>
											</li>
											<li
												className={
													activeStep ===
													"revalidateduser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep ===
														"revalidateduser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"revalidateduser"}
													className={`${
														styles.listitem
													} ${
														activeStep ===
														"revalidateduser"
															? styles.activesidebar
															: ""
													}`}
													style={{
														textDecoration: "none",
														color: "black",
													}}>
													Revalidated
												</Link>
											</li>
											<li
												className={
													activeStep ===
													"accepteduser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep ===
														"accepteduser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"accepteduser"}
													className={`${
														styles.listitem
													} ${
														activeStep ===
														"accepteduser"
															? styles.activesidebar
															: ""
													}`}
													style={{
														textDecoration: "none",
														color: "black",
													}}>
													Approved Users
												</Link>
											</li>

											<li
												className={
													activeStep ===
													"rejecteduser"
														? styles.activesidebarstep
														: ""
												}>
												<UserIcon
													className={
														activeStep ===
														"rejecteduser"
															? styles.activeicon
															: styles.inActvieIcon
													}
												/>
												<Link
													to={"rejecteduser"}
													className={`${
														styles.listitem
													} ${
														activeStep ===
														"rejecteduser"
															? styles.activesidebar
															: ""
													}`}
													style={{
														textDecoration: "none",
														color: "black",
													}}>
													{" "}
													Rejected Users
												</Link>
											</li>
										</ul>
									)}
								</div>
							)}
						</ul>
					</div>
				)}
				<div className={styles.listdiv}>
					<ul className={`${styles.slist} ${styles.accountdiv}`}>
						<li
							className={`${styles.forgot} ${styles.signout}`}
							style={{ cursor: "pointer" }}
							onClick={() => mutate()}>
							Sign Out
							<Signout />
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
