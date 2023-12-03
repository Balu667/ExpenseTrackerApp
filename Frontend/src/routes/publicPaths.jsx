import { Route, Routes, Navigate } from "react-router-dom";
import { lazy } from "react";

const LoginPageComponent = lazy(() =>
	import("../views/LoginPage/index")
);


const RegisterComponent = lazy(() =>
	import("../views/Register/index")
);


const publicPaths = [
	{
		path: "login",
		element: LoginPageComponent,
	},
	{
		path: "register",
		element: RegisterComponent,
	},
];

function PublicApp() {
	return (
		<Routes>
			{publicPaths.map((e, index) => (
				<Route key={index} path={e.path} element={<e.element />} />
			))}
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	);
}

export default PublicApp;
