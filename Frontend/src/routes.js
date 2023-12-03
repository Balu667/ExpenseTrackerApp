import Register from "./views/Register";
import Loginpage from "./views/LoginPage";


export let ApplicationRoutes = [
    { path: "/register", Component: Register },
    { path: "/login", Component: Loginpage },
    { path: "/", Component: Dashboard }];