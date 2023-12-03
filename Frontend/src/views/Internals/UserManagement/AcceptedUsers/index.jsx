import IndividualStatusUserList from "../../../../components/IndividualStatusUserList";

function AcceptedUser() {
	return (
		<IndividualStatusUserList userArray={[1]} heading={"Accepted Users"} />
	);
}

export default AcceptedUser;
