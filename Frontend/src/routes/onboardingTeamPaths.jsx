import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const operationAdminDrawerComponent = lazy(() =>
	import("../components/OperationAdminDrawer/OperationAdminDrawer")
);

const FullUserListComponent = lazy(() =>
	import("../views/OnboardingTeam/UserManagement/AllUsers/index")
);
const NewUserListComponent = lazy(() =>
	import("../views/OnboardingTeam/UserManagement/NewUsers/index")
);
const AcceptedUserListComponent = lazy(() =>
	import("../views/OnboardingTeam/UserManagement/AcceptedUser/index")
);
const RejectedUserListComponent = lazy(() =>
	import("../views/OnboardingTeam/UserManagement/RejectedUser/index")
);
const RevalidatedUserListComponent = lazy(() =>
	import("../views/OnboardingTeam/UserManagement/RevalidatedUsers/index")
);
const PendingListComponent = lazy(() =>
	import("../views/OnboardingTeam/UserManagement/PendingUsers/index")
);
const SubUserComponent = lazy(() =>
	import("../views/OnboardingTeam/TeamDetails/Subuser")
);

const CfsListComponent = lazy(() =>
	import("../views/Internals/CFSManagement/CFS/index")
);
const CfsSubUserComponent = lazy(() =>
	import("../views/Internals/CFSManagement/CfsTeamDetails/index")
);

const onboardingTeamPaths = [
	{
		path: "/obteam",
		element: operationAdminDrawerComponent,
		children: [
			{
				path: "newuser",
				element: NewUserListComponent,
			},
			{
				path: "accepteduser",
				element: AcceptedUserListComponent,
			},
			{
				path: "rejecteduser",
				element: RejectedUserListComponent,
			},
			{
				path: "revalidateduser",
				element: RevalidatedUserListComponent,
			},
			{
				path: "pendinguser",
				element: PendingListComponent,
			},
			{
				path: "users",
				element: FullUserListComponent,
			},
			{
				path: "users/:id",
				element: SubUserComponent,
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

export default function OnboardingTeamApp() {
	return (
		<Routes>
			{onboardingTeamPaths.map((parentElement, index) => (
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
			<Route path="*" element={<Navigate to="/obteam/users" />} />
		</Routes>
	);
}
