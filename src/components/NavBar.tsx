import { Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useAppSelector } from "../redux-stuff/hooks"
import LogOutButton from "./Logout"
import reactLogo from "../assets/react.svg"
import "../styles/NavBar.scss"


/**
 * Nav bar.
 */
function NavBar(){
  // user login state:
  const { isLoggedIn, user } = useAppSelector(state => state.session)
  
  
  return (
    <Navbar as="header" sticky="top" bg="dark" variant="dark" expand="md" collapseOnSelect className="text-bg-dark">
      <Container as="nav" fluid>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img 
              src={reactLogo}
              id="company-logo"
              alt="logo"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            <span id="company-logo-name">CrowdBuild</span>
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav as="ul" navbarScroll justify defaultActiveKey="/"  style={{ maxHeight: "max(20vh, 10vw)" }} className="w-100 me-auto">
            <h4 id="company-dropdown-name" className="navbar-text"><strong>CrowdBuild</strong></h4>
            
            <hr className="company-dropdown-name" />
            
            <Nav.Item as="li">
              <LinkContainer to="/home">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item as="li">
              <LinkContainer to="/news">
                <Nav.Link>News</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item as="li">
              <NavDropdown title="Lists" menuVariant="dark">
                <LinkContainer to="/my-list">
                  <NavDropdown.Item>My List</NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Divider />

                <LinkContainer to="/database">
                  <NavDropdown.Item>PC Part Database</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav.Item>

            <Nav.Item as="li">
              <LinkContainer to="/reviews">
                <Nav.Link>Reviews</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item as="li">
              <LinkContainer to="/forum">
                <Nav.Link>Forum</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item as="li">
              <LinkContainer to="/benchmarks">
                <Nav.Link>Benchmarks</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item as="li">
              <LinkContainer to="/tests">
                <Nav.Link>Tests</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item as="li">
              <NavDropdown align="end" title={isLoggedIn && user ? user.username : "Login"} menuVariant="dark" className="dropdown-menu-right min-w" >
                {isLoggedIn && user ? <>
                    <NavDropdown.Header  className="text-center text-capitalize fs-4 fw-bold text-decoration-underline">
                      {user.username}
                    </NavDropdown.Header>

                    <LinkContainer to="/profile"  className="text-center">
                      <NavDropdown.Item>My Profile</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />
                    
                    <NavDropdown.Item>
                      <Row className="w-100 h-100 mx-auto">
                        <LogOutButton />
                      </Row>
                    </NavDropdown.Item>
                  </>
                  : <>
                    <LinkContainer to="/signin">
                      <NavDropdown.Item>Sign In</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />

                    <LinkContainer to="/signup">
                      <NavDropdown.Item>Sign Up</NavDropdown.Item>
                    </LinkContainer>
                  </>
                }
              </NavDropdown>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar