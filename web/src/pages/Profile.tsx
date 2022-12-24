import { skipToken } from "@reduxjs/toolkit/dist/query"
import { Button, Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useDeleteUserMutation, useGetUserQuery, usePatchUserMutation } from "../redux-stuff/query"
import { sessionLogout } from "../redux-stuff/reducers/session"
import PCPartListId from "../components/PCPartLIstId"

// debugging logger:
const log = dbgLog.fileLogger("Profile.tsx")

/**
 * The user home page when logged in.
 *
 * @todo allow changing username and password.
 * @todo improve UI.
 */
export default function Profile() {
  const Log = log.stackLogger("Profile")

  const dispatch = useAppDispatch()

  const { session } = useAppSelector(state => state)

  // keep user data updated, to be used when editing user profile:
  const { data: user } = useGetUserQuery(session.user ? session.user._id : skipToken, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  })

  // for deleting account and all lists:
  const deleteUserMut = useDeleteUserMutation()
  const [triggerDelete, mutDeleteRes] = deleteUserMut

  /** @todo allow changing username and password */
  // for changing account username:
  // const [triggerUpdate, mutUpdateRes] = usePatchUserMutation()

  // delete user account and all user owned lists:
  const handleClick = () => {
    // prettier-ignore
    Log.stackLoggerInc("handleClick")(
      "mutDeleteRes", mutDeleteRes,
      "deleteUserMut", deleteUserMut,
      "session", session
    )

    if (confirm("THIS WILL DELETE YOUR ACCOUNT AND ALL OF YOUR LISTS!\nCONTINUE WITH DELETING?") && session.token) {
      triggerDelete(session.token)
      dispatch(sessionLogout())
    }
  }

  return (
    <>
      <h1>{`${user?.username}'s Profile! :)`}</h1>

      <hr />

      <h2>Session:</h2>

      <pre className="text-start mx-5">{JSON.stringify(session, undefined, "  ")}</pre>

      <hr />

      <h2>User:</h2>

      <pre className="text-start mx-5">{JSON.stringify(user, undefined, "  ")}</pre>

      <hr />

      <h2 className="my-5">My Lists:</h2>

      {user && user.lists.length > 0 ? (
        user.lists.map((id, i) => (
          <Container key={i} fluid className="py-5 my-5 bg-light mx-auto w-75">
            <h4 className="mb-5">List: {id}</h4>

            <PCPartListId listId={id} />
          </Container>
        ))
      ) : (
        <>
          You don't have any list yet...
          <br />
          <LinkContainer to="/my-list" className="mt-5 mb-2">
            <Button>Search for Lists to Copy</Button>
          </LinkContainer>
          <br />
          <LinkContainer to="/database">
            <Button variant="link">Or search for parts</Button>
          </LinkContainer>
        </>
      )}

      <br />

      <Button variant="danger" className="m-5" onClick={handleClick}>
        DELETE My Account and ALL of My Lists
      </Button>
    </>
  )
}
