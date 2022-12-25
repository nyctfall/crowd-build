import { Button, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

/**
 * @todo
 * The first page on the webiste, is mostly just a placeholder for now.
 */
export default function Root() {
  return (
    <div style={{ minHeight: "80vh" }} className="d-grid gap-5 m-5">
      <Row>
        <h1>Root</h1>
        <hr />
      </Row>

      <Link to="/signin">
        <Button variant="info" className="fs-1 w-100 h-100">
          Sign In!
        </Button>
      </Link>

      <Link to="/home">
        <Button variant="secondary" size="lg" className="fs-1 w-100 h-100">
          Home Page
        </Button>
      </Link>

      <Link to="/my-list">
        <Button variant="secondary" size="lg" className="fs-1 w-100 h-100">
          Search for Lists to Copy!
        </Button>
      </Link>

      <Link to="/database">
        <Button variant="secondary" size="lg" className="fs-1 w-100 h-100">
          Search for Parts to add to your list!
        </Button>
      </Link>
    </div>
  )
}
