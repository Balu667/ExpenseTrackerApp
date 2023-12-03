import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const MainUserLayoutComponent = lazy(() =>
	import("../components/MainUserLayout/MainUserLayout")
);

const MyAccountComponent = lazy(() => import("../components/CfsMyAccount"));

const MyBookingsComponent = lazy(() =>
	import("../views/OriginCfs/OcfsDashboard")
);
const MyBookingViewComponent = lazy(() =>
	import("../views/OriginCfs/OcfsBookingSummary/index")
);
const BookingList = lazy(() => import("../views/OriginCfs/OcfsBookingList"));

const originCfsPaths = [
	{
		path: "ocfs",
		element: MainUserLayoutComponent,
		children: [
			{
				path: "MyAccount",
				element: MyAccountComponent,
			},
			{
				path: "mybookings",
				element: MyBookingsComponent,
			},
			{
				path: "bookinglist/:scheduleId",
				element: BookingList,
			},
			{
				path: "bookings/:scheduleId/:bookingId",
				element: MyBookingViewComponent,
			},
		],
	},
];

export default function OriginCfsApp() {
	return (
		<Routes>
			{originCfsPaths.map((e, index) => (
				<Route key={index} path={e.path} element={<e.element />}>
					{e?.children.map((childrenElement, childrenIndex) => (
						<Route
							key={childrenIndex}
							path={childrenElement.path}
							element={<childrenElement.element />}
						/>
					))}
				</Route>
			))}
			<Route path="*" element={<Navigate to="/ocfs/mybookings" />} />
		</Routes>
	);
}
