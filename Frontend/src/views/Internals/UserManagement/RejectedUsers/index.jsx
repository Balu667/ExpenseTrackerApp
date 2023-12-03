import IndividualStatusUserList from "../../../../components/IndividualStatusUserList";

function RejectedUser() {
	return (
		<IndividualStatusUserList userArray={[7]} heading={"Rejected Users"} />
	);
}

export default RejectedUser;
