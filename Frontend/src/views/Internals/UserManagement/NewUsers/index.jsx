import IndividualStatusUserList from "../../../../components/IndividualStatusUserList";

function NewUser() {
	return (
		<IndividualStatusUserList
			userArray={[4]}
			heading={"New Registrations"}
		/>
	);
}
export default NewUser;
