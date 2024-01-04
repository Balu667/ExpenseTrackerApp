import { Route, Routes, Navigate } from "react-router-dom";
import { lazy } from "react";

const MainUserLayoutComponent = lazy(() =>
	import("../components/MainUserLayout/MainUserLayout")
);
const DashboardComponent = lazy(() => import("../views/Dashboard"));
const BudgetComponent = lazy(() => import("../views/Budgets/index"))

const userPaths = [
	{
		path: "/",
		element: MainUserLayoutComponent,
		children: [
			{
				path: "/",
				element: DashboardComponent,
			},
			{
				path: "/budgets",
				element: BudgetComponent,
			}
		],
	},
];

function UserApp() {
	return (
		<Routes>
			{userPaths.map((parentElement, parentIndex) => (
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
											element={<nestedChild.element />}
										/>
									)
								)}
							</Route>
						)
					)}
				</Route>
			))}
			<Route path="*" element={<Navigate to={"/"} />} />
		</Routes>
	);
}

export default UserApp;
