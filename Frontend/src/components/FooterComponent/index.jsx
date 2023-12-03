import "./styles.css";
import { AiOutlineCopyrightCircle } from "react-icons/ai";

function FooterComponent() {
	return (
		<div className="footerdiv">
			<div className="container">
				<h5 className="footertext">
					<AiOutlineCopyrightCircle />
					2023 ,Groupage technologies (s) pte.ltd.All Rights Reserved
				</h5>
			</div>
		</div>
	);
}
export default FooterComponent;
