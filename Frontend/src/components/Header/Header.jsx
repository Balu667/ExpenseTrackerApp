import "./index.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useLogout } from "../../hooks/category";

function Header() {
	const { mutate } = useLogout();
	return (
		<Navbar collapseOnSelect expand="lg">
			<Container className="container">
				<Link to="/home" className="brandlogo">
					<h3>EXPENSE TRACKER</h3>
				</Link>
				<Navbar.Toggle aria-controls="responsive-navbar-nav">
					<GiHamburgerMenu style={{ color: "#fff" }} />
				</Navbar.Toggle>
				<Navbar.Collapse
					id="responsive-navbar-nav"
					className="justify-content-end">
					<Nav>
						<Link className="linktag" to="/">
							Dashboard
						</Link>
						<Link className="linktag" to="/budgets">
							Budgets
						</Link>
						<Nav.Item className="d-flex gap-2">
						</Nav.Item>
						<Nav.Item>
							<button className="header-btn"
								onClick={() => mutate()}
							>Logout</button>
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
