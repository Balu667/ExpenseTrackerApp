import "./index.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useLogoutUser, useProfileData } from "../../hooks/userAuthManagement";
import { convertFirstLettersAsUpperCase } from "../../helper";
import logo from "../../assets/Images/AllMastersHeaderLogo.png";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

function Header({ redirectLink }) {
	const { mutate } = useLogoutUser();
	const id = localStorage.getItem("allMasterId");
	const role = useSelector((state) => state.profile.role);
	const { data: userData, isLoading } = useProfileData(id, role);

	function checkArrayAndReturnName(userData) {
		if (userData != null) {
			return Array.isArray(userData)
				? convertFirstLettersAsUpperCase(userData[0].fullName)
				: convertFirstLettersAsUpperCase(userData.fullName);
		} else {
			return "";
		}
	}

	return (
		<Navbar collapseOnSelect expand="lg">
			<Container className="container">
				<Link to="/home" className="brandlogo">
					<img src={logo} className="headerlogo" alt="" />
					AllMasters
				</Link>
				<Navbar.Toggle aria-controls="responsive-navbar-nav">
					<GiHamburgerMenu />
				</Navbar.Toggle>
				<Navbar.Collapse
					id="responsive-navbar-nav"
					className="justify-content-end">
					<Nav>
						{role === 1 && (
							<Link className="linktag" to="/user/dashboard">
								Dashboard
							</Link>
						)}
						{role === 1 && (
							<Link
								className="linktag"
								to={redirectLink(role) + "mybookings#all"}>
								My Bookings
							</Link>
						)}
						<Nav.Item className="d-flex gap-2">
							<div className="hellotextdiv">
								<span className="linktag">Hello</span>
								<NavDropdown
									title={
										isLoading ? (
											<CircularProgress />
										) : (
											checkArrayAndReturnName(userData)
										)
									}
									id="basic-nav-dropdown">
									<Link
										to={redirectLink(role) + "Myaccount"}
										className="dropdownlink">
										My Account
									</Link>
									<NavDropdown.Item
										className="dropdownlink"
										onClick={() => mutate()}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							</div>
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
