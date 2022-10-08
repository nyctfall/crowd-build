import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import reactLogo from "../assets/react.svg"


function NavBar(){
  return (
    <Navbar as="header" sticky="top" bg="dark" variant="dark" expand="md" collapseOnSelect>
      <Container as="nav" fluid>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img 
              src={reactLogo}
              alt="logo"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            CrowdBuild
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav as="ul" justify defaultActiveKey="/" className="w-100 me-auto">
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar