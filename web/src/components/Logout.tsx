import { Button, Spinner } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePostLogoutMutation } from "../redux-stuff/query"
import { sessionLogout } from "../redux-stuff/reducers/session"

// debugging logger:
const log = dbgLog.fileLogger("Logout.tsx")

/**
 * Logout user and clear user data from store cache.
 */
export default function LogOutButton() {
  const Log = log.stackLogger("LogOutButton")

  const dispatch = useAppDispatch()

  // user login credentials state:
  const session = useAppSelector(state => state.session)

  const { isLoggedIn, token } = session

  // setup logout post req:
  const [trigger, signoutMut] = usePostLogoutMutation()
  const { isLoading } = signoutMut

  const handleClick = () => {
    const log = Log.stackLoggerInc("handleClick")
    // prettier-ignore
    log(
      "session", session,
      "signoutMut", signoutMut
    )

    // send logout POST:
    if (token != undefined) {
      const mutRes = trigger(token)

      log("mutRes", mutRes)
      ;(async () => {
        const data = await mutRes.unwrap()

        log("data", data)

        // remove global login state:
        dispatch(sessionLogout())
      })()
    }
  }

  return (
    /** @todo convert to stateful button */
    <Button disabled={!isLoggedIn} variant={isLoggedIn ? "danger" : "outline-danger"} onClick={handleClick}>
      {isLoading ? (
        <>
          Logging Out...
          <Spinner animation="border" />
        </>
      ) : (
        "Log Out"
      )}
    </Button>
  )
}
