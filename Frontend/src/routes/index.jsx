import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const countryComponent = lazy(() =>
	import("../views/Internals/Country/Country")
);

const laneComponent = lazy(() => import("../views/Internals/Lane/Lane"));

const costHeadingComponent = lazy(() =>
	import("../views/Internals/CostHeading/CostHeading")
);

const scheduleComponent = lazy(() =>
	import("../views/Internals/Schedules/Schedules")
);
const rateListComponent = lazy(() =>
	import("../views/Internals/Ratelist/index")
);
const rateAddComponent = lazy(() => import("../views/Internals/RateAdd/index"));
const rateViewComponent = lazy(() =>
	import("../views/Internals/RateView/ViewPage")
);

const operationAdminDrawerComponent = lazy(() =>
	import("../components/OperationAdminDrawer/OperationAdminDrawer")
);

const PortHoliday = lazy(() => import("../views/Internals/PortHoliday/index"));

const CfsListComponent = lazy(() =>
	import("../views/Internals/CFSManagement/CFS/index")
);
const CfsSubUserComponent = lazy(() =>
	import("../views/Internals/CFSManagement/CfsTeamDetails/index")
);

const operationAdminPaths = [
	{
		path: "/",
		element: operationAdminDrawerComponent,
		children: [
			{
				path: "country",
				element: countryComponent,
			},
			{
				path: "lane",
				element: laneComponent,
			},
			{
				path: "costheading",
				element: costHeadingComponent,
			},
			{
				path: "rate",
				element: rateListComponent,
			},
			{
				path: "rate/add",
				element: rateAddComponent,
			},
			{
				path: "rate/:id",
				element: rateViewComponent,
			},
			{
				path: "schedules",
				element: scheduleComponent,
			},
			{
				path: "holidays",
				element: PortHoliday,
			},
			{
				path: "cfsmanagement",
				element: CfsListComponent,
			},
			{
				path: "cfsmanagement/:id",
				element: CfsSubUserComponent,
			},
		],
	},
];

export default function ApplicationRoutes() {
	return (
		<Routes>
			{operationAdminPaths.map((parentElement, index) => (
				<Route
					key={index}
					path={parentElement.path}
					element={<parentElement.element />}>
					{parentElement.children.map((element, index) => (
						<Route
							key={index}
							path={element.path}
							element={
								<Suspense fallback={<Loader />}>
									<element.element />
								</Suspense>
							}
						/>
					))}
				</Route>
			))}
			<Route path="*" element={<Navigate to="/rdt/country" />} />
		</Routes>
	);
}
