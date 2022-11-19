import { Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"


/**
 * 
 */
export default function Root(){
  return (
    <>
      <h1>Root</h1>
      
      <hr />
      
      <LinkContainer to="/signin" className="m-5">
        <Button>
          Sign In!
        </Button>
      </LinkContainer>

      <br />

      <LinkContainer to="/home" className="m-5">
        <Button>
          Main Page
        </Button>
      </LinkContainer>

      <br />

      <LinkContainer to="/my-list" className="m-5">
        <Button>
          Search for Lists to Copy!
        </Button>
      </LinkContainer>

      <br />

      <LinkContainer to="/database" className="m-5">
        <Button>
          Search for Parts to add to your list!
        </Button>
      </LinkContainer>
    </>
  )
}