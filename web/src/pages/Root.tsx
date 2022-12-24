import { Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

/**
 * @todo
 * The first page on the webiste, is mostly just a placeholder for now.
 */
export default function Root() {
  return (
    <div style={{ minHeight: "80vh" }} className="d-flex flex-column justify-content-center align-items-stretch m-5">
      <h1>Root</h1>

      <hr />

      <LinkContainer to="/signin">
        <Button variant="info" className="align-center m-1 flex-fill align-middle fs-1">
          Sign In!
        </Button>
      </LinkContainer>

      <br />

      <LinkContainer to="/home">
        <Button variant="secondary" className="align-center m-1 flex-fill align-middle fs-1">
          Home Page
        </Button>
      </LinkContainer>

      <br />

      <LinkContainer to="/my-list">
        <Button variant="secondary" className="align-center m-1 flex-fill align-middle fs-1">
          Search for Lists to Copy!
        </Button>
      </LinkContainer>

      <br />

      <LinkContainer to="/database">
        <Button variant="secondary" className="align-center m-1 flex-fill align-middle fs-1">
          Search for Parts to add to your list!
        </Button>
      </LinkContainer>
    </div>
  )
}
