import { Navigate, useLocation } from "react-router-dom";
import BookingStepper from "../BookingStepper/BookingStepper";
import PreBooking from "../../views/User/CargoDetail";
import OriginForwarder from "../../views/User/OriginForwarder";
import DestinationForwarder from "../../views/User/DestinationForwarder";
import NotifyParty from "../../views/User/NotifyParty";
import UploadDoc from "../../views/User/UploadDoc";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { useGetDestinationForwarderList } from "../../hooks/destinationForwarder";
import { useGetNotifyPartyList } from "../../hooks/notifyParty";
import { useGetOriginForwarderList } from "../../hooks/originForwarder";

export default function BookingComponent() {
	const { hash } = useLocation();

	const userDetail = useSelector((state) => state.profile.profileData);

	const { data: originFList, isLoading: originLoading } =
		useGetOriginForwarderList(userDetail?.legalName);

	const { data: destinationFList, isLoading: destinationLoading } =
		useGetDestinationForwarderList(userDetail?.legalName);

	const {
		data: notifySavedAddressList,
		isLoading: notifySavedAddressListLoading,
	} = useGetNotifyPartyList(userDetail?.legalName);

	if (originLoading || destinationLoading || notifySavedAddressListLoading) {
		return <Loader />;
	}

	function GetComponentByType({ id }) {
		switch (id) {
			case "#1":
				return <PreBooking />;
			case "#2":
				return <OriginForwarder originFList={originFList} />;
			case "#3":
				return (
					<DestinationForwarder destinationFList={destinationFList} />
				);
			case "#4":
				return (
					<NotifyParty
						notifySavedAddressList={notifySavedAddressList}
					/>
				);
			case "#5":
				return <UploadDoc />;
			default:
				return <Navigate to={"/user/dashboard"} />;
		}
	}

	return (
		<>
			<BookingStepper activeStep={parseInt(hash.replace("#", "") - 1)} />
			<GetComponentByType id={hash} />
		</>
	);
}
