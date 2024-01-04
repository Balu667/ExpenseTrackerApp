import { BrowserRouter } from "react-router-dom";
import PublicApp from "./publicPaths";
import UserApp from "./userPaths";
import { useDispatch, useSelector } from "react-redux";

function RouteChecker() {
	const profile = useSelector((state) => state.profile)
	if (profile.signedIn === false) {
		return <PublicApp />;
	} else {
		try {
			const token = localStorage.getItem("token");
			if (token == null) {
				return <PublicApp />;
			} else {
				return <UserApp />;
			}
		} catch (error) {
			return <PublicApp />;
		}
	}
}

export default function RouterRender() {
	return (
		<BrowserRouter>
			<RouteChecker />
		</BrowserRouter>
	);
}
