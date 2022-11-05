import { Button, Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import Login from "../components/Login"


/**
 * 
 */
export default function Signin() {
  return (
    <>
      <h1>Sign In!</h1>

      <Login />

      <Container>
        Don't have an account? <br />
        
        <LinkContainer to="/signup" className="m-5">
          <Button variant="secondary">Sign up!</Button>
        </LinkContainer>
      </Container>
    </>
  )
}