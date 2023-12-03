import styles from "./index.module.css";
import CheckoutAddressCard from "../CheckoutAddressCard";
import { useCountries } from "../../hooks/country";
import { CircularProgress } from "@mui/material";
import { keyMatchLoop } from "../../helper";

export function ForwarderCard({ data, convert, shipper }) {
	const { data: countryData, isLoading } = useCountries();

	function convertCountry(data, country) {
		if (convert === true) {
			return keyMatchLoop("_id", data, country).countryName;
		} else {
			return country;
		}
	}

	function returnAddress(data) {
		return `No. ${data.doorNo}, ${data.building}, ${data.street}, ${
			data.area
		} ,${data.city}, ${data.state}, ${convertCountry(
			countryData,
			data.country
		)} ${data?.pincode ? `,${data?.pincode}` : ""}`;
	}

	function countryCode(data, country) {
		if (convert === true) {
			return keyMatchLoop("_id", data, country).countryCode;
		} else {
			return country;
		}
	}

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div className={styles.checkoutflex}>
			<CheckoutAddressCard
				logistics={data.companyName}
				shipper={shipper}
				shipperName={data.hblName}
				mail={data.email}
				phone={data.mobile}
				name={data.name}
				Ccode={countryCode(countryData, data.country)}
				address={returnAddress(data)}
			/>
		</div>
	);
}
