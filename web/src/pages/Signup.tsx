import { Button, Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import Login from "../components/Login"


/**
 * 
 */
export default function Signup() {
  return (
    <>
      <h1>Sign Up!</h1>

      <Login createUser={true} />

      <Container>
        Already have an account? <br />

        <LinkContainer to="/signin" className="my-5">
          <Button variant="secondary">Sign in!</Button>
        </LinkContainer>
      </Container>
    </>
  )
}