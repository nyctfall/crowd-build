import { Button, Spinner } from "react-bootstrap"
import { dbgLog } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePostLogoutMutation } from "../redux-stuff/query"
import { sessionLogout } from "../redux-stuff/reducers/session"


/**
 * Logout user and clear user data from store cache.
 */
export default function LogOutButton() {
  const dispatch = useAppDispatch()
  
  // user login credentials state:
  const session = useAppSelector(state => state.session)
  
  const { isLoggedIn, token } = session
  
  
  // setup logout post req:
  const signoutMut = usePostLogoutMutation()
  const [trigger, mutRes] = signoutMut
  const { isLoading } = mutRes


  dbgLog("Logout.tsx", "LogOutButton", "session", session, "signoutMut", signoutMut)
  
  
  const handleClick = () => {
    dbgLog("Logout.tsx", ["LogOutButton","handleClick"], "session", session, "signoutMut", signoutMut)

    // send logout POST:
    if (token != undefined) trigger(token)

    // remove global login state:
    dispatch(sessionLogout())
  }


  return (
    <Button disabled={!isLoggedIn} variant={isLoggedIn ? "danger" : "outline-danger"} onClick={handleClick}>
      {isLoading ? <>
          Logging Out...<Spinner animation="border"/>
        </>
        : "Log Out"
      }
    </Button>
  )
}