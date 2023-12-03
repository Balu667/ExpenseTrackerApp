import { Route, Routes, Navigate } from "react-router-dom";
import { lazy } from "react";
import { useSelector } from "react-redux";

const AccountVerifiedComponent = lazy(() =>
	import("../views/User/AccountVerified/AccountVerified")
);
const kycVerificationComponent = lazy(() =>
	import("../views/User/KycVerification/KycVerification")
);

const MainUserLayoutComponent = lazy(() =>
	import("../components/MainUserLayout/MainUserLayout")
);

const DashboardComponent = lazy(() => import("../views/User/Dashboard"));

const BookingComponent = lazy(() => import("../components/BookingComponent"));

const CheckoutComponent = lazy(() => import("../views/User/Checkout/index"));

const MyAccountComponent = lazy(() => import("../views/User/MyAccount/index"));

const AddUserComponent = lazy(() => import("../views/User/AddUser/index"));

const VerificationComponent = lazy(() =>
	import("../views/User/VerificationPage/VerificationPage")
);
const MyBookingComponent = lazy(() => import("../views/User/MyBooking/Index"));
const MybookingViewComponent = lazy(() =>
	import("../views/User/MyBookingView/index")
);

const TermsConditionComponent = lazy(() =>
	import("../views/Common/TermsAndConditions/index")
);

let routeMismatchString;

const userPaths = [

	{
		path: "/",
		element: MainUserLayoutComponent,
		children: [
			{
				path: "Myaccount",
				element: MyAccountComponent,
			},
			{
				path: "Myaccount/addUser",
				element: AddUserComponent,
			},
			{
				path: "dashboard",
				element: DashboardComponent,
			},
			{
				path: "mybookings",
				element: MyBookingComponent,
			},
			{
				path: "booking/:scheduleId",
				element: BookingComponent,
			},
			{
				path: "booking/:scheduleId/Checkout",
				element: CheckoutComponent,
			},
			{
				path: "mybookings/:scheduleId/:bookingId",
				element: MybookingViewComponent,
			},
			{
				path: "termsconditons",
				element: TermsConditionComponent,
			},
		]
	},
];

function UserApp() {
	const profileData = useSelector((state) => state.profile.profileData);
	return (
		<Routes>
			{removeRoutes(userPaths, profileData.status).map(
				(parentElement, parentIndex) => (
					<Route
						key={parentIndex}
						path={parentElement.path}
						element={<parentElement.element />}>
						{parentElement?.children?.map(
							(childrenElement, childrenIndex) => (
								<Route
									path={childrenElement.path}
									element={<childrenElement.element />}
									key={childrenIndex}>
									{childrenElement?.children?.map(
										(nestedChild, nestedChildIndex) => (
											<Route
												key={nestedChildIndex}
												path={nestedChild.path}
												element={
													<nestedChild.element />
												}
											/>
										)
									)}
								</Route>
							)
						)}
					</Route>
				)
			)}
			<Route path="*" element={<Navigate to={"/"} />} />
		</Routes>
	);
}

export default UserApp;
