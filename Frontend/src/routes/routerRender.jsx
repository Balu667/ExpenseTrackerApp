import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, useNavigate } from "react-router-dom";
import PublicApp from "./publicPaths";
import UserApp from "./userPaths";
import { removeProfileData } from "../redux/slices/profileSlice";

function RouteChecker() {
	const profileData = useSelector((state) => state.profile);
	const dispatch = useDispatch();
	if (profileData.signedIn === false) {
		return <PublicApp />;
	} else {
		try {
			const token = localStorage.getItem("allMasterToken");
			if (token == null) {
				dispatch(removeProfileData());
				return <PublicApp />;
			}else{
				return <UserApp />
			}
	
		} catch (error) {
			dispatch(removeProfileData());
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
