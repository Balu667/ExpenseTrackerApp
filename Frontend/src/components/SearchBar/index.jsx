import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Autocomplete } from "@mui/material";
import styles from "../../views/User/Dashboard/index.module.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { convertFirstLettersAsUpperCase } from "../../helper";
import styled from "@emotion/styled";

const CustomisedAutocomplete = styled(Autocomplete)`
	.Mui-expanded {
		outline: none;
	}
	& .MuiAutocomplete-root {
		border: none;
	}
	& .MuiAutocomplete-input {
		border: none !important;
		padding: 0px !important;
	}
	& .MuiAutocomplete-endAdornment {
		top: 8px !important;
		right: 0px;
	}
`;
const Customisedinput = styled(TextField)`
	.MuiOutlinedInput-root {
		outline: none;
		padding: 16px !important;
	}
`;

function SearchBar({ options, onChange }) {
	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
			<CustomisedAutocomplete
				sx={{ textTransform: "capitalize", padding: "0" }}
				className={styles.ashboardsearbar}
				disablePortal
				forcePopupIcon={false}
				onChange={onChange}
				noOptionsText={"No Ports Found"}
				id="combo-box-demo"
				options={options.map(
					(option) =>
						convertFirstLettersAsUpperCase(option.portName) +
						", " +
						option.portCode.toUpperCase()
				)}
				renderInput={(params) => (
					<Customisedinput
						sx={{ border: "none", width: "100%", padding: "0px" }}
						className={styles.searchbarinput}
						placeholder="Search Destination Port"
						{...params}
						InputProps={{
							...params.InputProps,
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				)}
			/>
		</Stack>
	);
}

export default SearchBar;
