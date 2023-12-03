import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { ReactComponent as Tick } from "../../../assets/Images/overlapTick.svg";
import { ReactComponent as Box } from "../../../assets/Images/box.svg";
import { ReactComponent as Saved } from "../../../assets/Images/saved.svg";
import { ReactComponent as Prebookingicon } from "../../../assets/Icons/prebookingicon.svg";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import BookingDetail from "../../../components/BookingDetail";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import {
	useGetBookingList,
	useGetScheduleRates,
	useSearchStatus,
} from "../../../hooks/dashboard";
import Loader from "../../../components/Loader/Loader";
import { ShipmentDetail } from "./ShipmentDetail";
import { useLane } from "../../../hooks/lane";
import SearchBar from "../../../components/SearchBar";
import { keyMatchLoop } from "../../../helper";
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { useUserProfileData } from "../../../hooks/profileData";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/FooterComponent";

const CustomisedToggleButton = styled(ToggleButtonGroup)`
	.MuiToggleButton-root.Mui-selected {
		background: black !important;
		color: #fff !important;
	}
`;

function Dashboard() {
	let periorityLane = 0;
	let bookingMade = 0;
	let cargoSent = 0;
	let youSaved = 0;
	let preBookingMade = 0;

	const createdBy = localStorage.getItem("allMasterId");

	const navigate = useNavigate();

	const id = localStorage.getItem("allMasterId");

	const mobileView = useMediaQuery("(max-width:765px)");

	const tabView = useMediaQuery("(max-width: 1200px)");

	const { legalName } = useSelector((state) => state.profile.profileData);

	const [popup, setPopup] = useState(false);

	const [activePort, setActivePort] = useState("");

	const [activeCard, setActiveCard] = useState(null);

	const [detailSchedule, setDetailSchedule] = useState(null);

	const [filterValues, setFilterValues] = useState({
		lane: activePort,
		searchTerm: "",
	});

	const { mutate } = useSearchStatus();

	const { data: userDetail, isLoading } = useUserProfileData(id, {
		onSuccessFunctions: () => {},
		refetchInterval: true,
		refetchOnWindowFocus: true,
	});

	const {
		data: scheduleRateList,
		isLoading: scheduleRateLoading,
		isSuccess: scheduleRateSuccess,
	} = useGetScheduleRates();

	const {
		data: bookingList,
		isSuccess: bookingSuccess,
		isLoading: bookingLoading,
	} = useGetBookingList();

	const { data: laneList, isLoading: laneLoading } = useLane({
		refetchInterval: false,
	});

	const handleAlignment = (event, newAlignment) => {
		setActiveCard(null);
		setFilterValues({ ...filterValues, lane: newAlignment });
		if (newAlignment !== null) {
			setActivePort(newAlignment);
		}
	};

	const toggleDrawer = () => (event) => {
		setPopup(!popup);
	};

	useEffect(() => {
		if (laneList != null && userDetail != null) {
			if (userDetail[0].preferredGateway != null) {
				let preferredGateway = keyMatchLoop(
					"_id",
					laneList,
					userDetail[0].preferredGateway
				).portCode;
				setActivePort(preferredGateway);
			} else {
				let activeLanes = laneList.filter(
					(lane) => lane.status === 1 && lane.type === 1
				);
				let mumbaiPort = activeLanes.filter(
					(lane) => lane.portCode === "innsa"
				);
				if (mumbaiPort.length > 0) {
					setActivePort(mumbaiPort[0]?.portCode);
				} else {
					setActivePort(activeLanes[0]?.portCode);
				}
			}
		}
		// let scheduleWithtotalCbmBooked;
		// let laneWithTotalCbmBooked;

		// if (laneSuccess && scheduleRateSuccess && bookingSuccess) {
		// 	scheduleWithtotalCbmBooked = scheduleRateList.map((schedule) =>
		// 		calculateTotalCbmBookedBySchedule(bookingList, schedule)
		// 	);

		// 	laneWithTotalCbmBooked = laneList
		// 		.filter((lane) => lane.type === 1 && lane.status === 1)
		// 		.map((lane) => {
		// 			lane.totalCbmBooked = 0;
		// 			scheduleWithtotalCbmBooked.forEach((schedule) => {
		// 				if (schedule.pol === lane._id) {
		// 					lane.totalCbmBooked += schedule.totalCbmBooked;
		// 				}
		// 			});
		// 			return lane;
		// 		});
		// 	laneWithTotalCbmBooked = laneWithTotalCbmBooked.sort((a, b) => {
		// 		return a.totalCbmBooked - b.totalCbmBooked;
		// 	});

		// 	setActivePort(laneWithTotalCbmBooked[0].portCode);
		// }
	}, [userDetail, laneList]);

	if (scheduleRateSuccess) {
		scheduleRateList.sort(function (left, right) {
			return moment.utc(left.etd).diff(moment.utc(right.etd));
		});
	}

	if (scheduleRateLoading || laneLoading || bookingLoading || isLoading) {
		return <Loader />;
	}

	if (bookingSuccess) {
		for (let index = 0; index < bookingList.length; index++) {
			const element = bookingList[index];
			if (element.legalName === legalName) {
				if (element.status === 1 || element.status === 9) {
					bookingMade += 1;
					cargoSent += parseFloat(element.totalCbm);
				} else if (element.status === 2) {
					preBookingMade += 1;
				}
			}
		}
	}

	const detailScheduleHandler = (data, i) => {
		setDetailSchedule(data);
		setActiveCard(i);
		mutate({
			pol: data.pol,
			pod: data.pod,
			status: 2,
			createdBy,
			scheduleId: data._id,
		});
	};

	const filterShipmentCards = (scheduleDatas, state) => {
		let pol = activePort;
		let pod;

		pod = state.searchTerm
			? state.searchTerm.split(",")[1].toLowerCase().trim()
			: state.searchTerm;

		return scheduleDatas.filter((item) => {
			let polSheduleFlag = false;
			let podSheduleFlag = false;

			polSheduleFlag =
				keyMatchLoop("_id", laneList, item.pol).portCode === pol;
			if (pod !== "") {
				podSheduleFlag =
					keyMatchLoop("_id", laneList, item.pod).portCode === pod;
			} else {
				podSheduleFlag = true;
			}

			return polSheduleFlag && podSheduleFlag;
		});
	};

	const searchApiHandler = (searchValue) => {
		if (searchValue) {
			const pol = keyMatchLoop("portCode", laneList, activePort)._id;
			const searchPod = searchValue.split(",")[1].trim().toLowerCase();
			const pod = keyMatchLoop("portCode", laneList, searchPod)._id;
			mutate({
				pol,
				pod,
				status: 1,
				createdBy,
			});
		}
	};

	let filteredCards = filterShipmentCards(scheduleRateList, filterValues);

	return (
		<>
			<div className={styles.maindiv}>
				<div className={`container ${styles.conatinercon}`}>
					{bookingMade + preBookingMade + cargoSent + youSaved !==
					0 ? (
						<div>
							<div className={styles.overview}>
								<h1 className={styles.overviewtxt}>Overview</h1>
							</div>
							<div className={styles.gridcontainer}>
								<div
									onClick={() => {
										navigate("/user/mybookings#booking");
									}}
									className={`${styles.griditem} ${styles.item1}`}>
									<div className={styles.logodiv}>
										<Tick />
									</div>
									<h1>{bookingMade}</h1>
									<h5>Booking(s) Made</h5>
								</div>
								<div
									onClick={() => {
										navigate("/user/mybookings#prebooking");
									}}
									className={`${styles.griditem} ${styles.item}`}>
									<div className={styles.logodiv}>
										<Prebookingicon />
									</div>
									<h1>{preBookingMade}</h1>
									<h5>PreBooking(s) Made</h5>
								</div>
								<div
									className={`${styles.griditem} ${styles.item}`}>
									<div className={styles.logodiv}>
										<Box />
									</div>
									<h1>{cargoSent.toFixed(1)}</h1>
									<h5>Cargo Sent (CBM)</h5>
								</div>
								<div
									className={`${styles.griditem} ${styles.item}`}>
									<div className={styles.logodiv}>
										<Saved />
									</div>
									<h1>{Math.ceil(cargoSent * 2.5)}</h1>
									<h5>$ Saved</h5>
								</div>
							</div>
						</div>
					) : (
						<div>
							<h1 className={styles.welcometxt}>
								Welcome to{" "}
								<span className={styles.span}>All</span>Masters
							</h1>
							<h1 className={styles.lessthantxt}>
								Discover the revolutionary concept of{" "}
								<b>Controllidation</b>
							</h1>
						</div>
					)}
					<div className={styles.searchdiv}>
						<div className={styles.searchbody}>
							<h2>Your search begins here...</h2>
							<div className={styles.searchcontainer}>
								<div className={styles.toggledivs}>
									<CustomisedToggleButton
										value={activePort}
										exclusive
										onChange={handleAlignment}
										aria-label="text alignment">
										{laneList.length > 0 &&
											laneList
												.filter(
													(value) =>
														value.type === 1 &&
														value.status === 1
												)
												.map((value, i) => {
													periorityLane =
														periorityLane + 1;
													return (
														<ToggleButton
															key={value._id}
															sx={{
																backgroundColor:
																	"#EDEDED",
															}}
															value={
																value.portCode
															}
															aria-label="left aligned"
															className={`"toggle" ${styles.periorityLane}`}>
															<div
																className={
																	styles.togglediv
																}>
																<p
																	className={
																		styles.portname
																	}>
																	{
																		value.portName
																	}
																</p>
																<h1>
																	{
																		value.portCode
																	}
																</h1>
															</div>
														</ToggleButton>
													);
												})}
									</CustomisedToggleButton>
								</div>
								<div className={styles.inputdiv}>
									<div className={styles.searchboxdiv}>
										<SearchBar
											sx={{ width: "100% !important" }}
											onChange={(e, value) => {
												searchApiHandler(value);
												setFilterValues({
													...filterValues,
													searchTerm: value || "",
												});
											}}
											options={laneList.filter(
												(lane) => lane.type === 2
											)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.containerdiv}>
				<div className={`container ${styles.cardcontainer}`}>
					<Swiper
						slidesPerView={mobileView ? 1 : tabView ? 2 : 3}
						grid={{
							rows: mobileView ? 1 : 2,
						}}
						spaceBetween={10}
						navigation={true}
						modules={[Grid, Navigation]}
						className={styles.mySwiper}>
						{filteredCards.length > 0 ? (
							filteredCards.map((item, i) => {
								return (
									<SwiperSlide key={item._id}>
										<BookingDetail
											activeCard={activeCard}
											index={i}
											bookingList={bookingList}
											scheduleData={item}
											detailScheduleHandler={
												detailScheduleHandler
											}
											laneList={laneList}
											toggleDrawer={toggleDrawer()}
										/>
									</SwiperSlide>
								);
							})
						) : (
							<SwiperSlide>
								<p className={styles.nodata}>
									<strong>Attention!</strong> <br />
									Registrations now open! <br />
									We will be launching our services shortly!{" "}
									<br />
									Stay Tuned!
								</p>
							</SwiperSlide>
						)}
					</Swiper>
				</div>
			</div>
			<Footer />
			<RightDrawer popup={popup}>
				<ShipmentDetail
					scheduleData={detailSchedule}
					laneList={laneList}
					setPopup={setPopup}
					popup={popup}
				/>
			</RightDrawer>
		</>
	);
}

export default Dashboard;
