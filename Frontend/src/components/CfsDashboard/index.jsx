import React from "react";
import "./index.css";
import moment from "moment";
import Loader from "../Loader/Loader";
import { useGetCfsBookingList } from "../../hooks/cfs";
import BookingDetail from "../BookingManagementBookings";
import { keyMatchLoop } from "../../helper";
import { useLane } from "../../hooks/lane";
import { SentimentDissatisfied } from "@mui/icons-material";

function CfsDashboard({ type }) {
	const id = localStorage.getItem("allMasterId");

	const { data: originCfsBookingList, isLoading } = useGetCfsBookingList(id);

	const { isLoading: laneLoading, data: laneList } = useLane();

	if (isLoading || laneLoading) {
		return <Loader />;
	}
	return (
		<div className="min-vh-100 conatiner-fulid main-div">
			<div className="container">
				<h1>My Bookings</h1>
				<div className="bookingdetailsdiv">
					{originCfsBookingList.length > 0 ? (
						originCfsBookingList.map((value, index) => {
							let pol;
							let pod;
							let etd;
							let eta;
							let scheduleData;
							let bookingData;
							let bookings = [];
							let bookingCbm = 0;
							let cbmFilledPercent;
							let polName;
							let podName;

							scheduleData = value.scheduleData;

							bookingData = value.bookingData;

							bookingData.map((value) => {
								if (value.status === 1 || value.status === 9) {
									bookingCbm += Number(value.totalCbm);
									bookings.push(value);
								}
								return 0;
							});

							pol = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pol
							).portCode.toUpperCase();

							polName = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pol
							).portName;
							pod = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pod
							).portCode.toUpperCase();
							podName = keyMatchLoop(
								"_id",
								laneList,
								scheduleData.pod
							).portName;
							etd = moment(scheduleData.etd).format("DD-MM-YYYY");
							eta = moment(scheduleData.eta).format("DD-MM-YYYY");
							cbmFilledPercent =
								100 -
								Math.round(
									((scheduleData.volume - bookingCbm) /
										scheduleData.volume) *
										100
								);
							return (
								<BookingDetail
									polCode={pol}
									podCode={pod}
									polName={polName}
									podName={podName}
									key={index}
									scheduleId={`${scheduleData.scheduleId}`}
									// portName={`${pol} - ${pod}`}
									cbm={`${scheduleData.volume - bookingCbm}`}
									chargeTwo={bookings.length}
									nowValue={cbmFilledPercent}
									trendingStatus={1}
									ETD={`${etd}`}
									ETA={`${eta}`}
									url={`/${type}/bookinglist/${value._id}`}
									type={"cfs"}
								/>
							);
						})
					) : (
						<h5>
							Looks Empty{" "}
							<SentimentDissatisfied
								color="warning"
								fontSize="large"
							/>
						</h5>
					)}
				</div>
			</div>
		</div>
	);
}

export default CfsDashboard;
