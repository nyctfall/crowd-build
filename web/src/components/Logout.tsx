import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePostLogoutMutation } from "../redux-stuff/query"
import { sessionLogout } from "../redux-stuff/reducers/session"
import StatefulButton from "./StatefulButton"

// debugging logger:
const log = dbgLog.fileLogger("Logout.tsx")

/**
 * Logout user and clear user data from store cache.
 */
export default function LogOutButton() {
  const Log = log.stackLogger("LogOutButton")

  const dispatch = useAppDispatch()

  // user login credentials state:
  const isLoggedIn = useAppSelector(state => state.session.isLoggedIn)
  const token = useAppSelector(state => state.session.token)

  // setup logout post req:
  const [trigger, signoutMut] = usePostLogoutMutation()

  const { isLoading, isError } = signoutMut

  const handleClick = async () => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "isLoggedIn", isLoggedIn,
      "token", token,
      "signoutMut", signoutMut
    )

    // send logout POST:
    if (token != undefined) {
      // remove global login state:
      dispatch(sessionLogout())

      try {
        const data = await trigger(token).unwrap()

        log("data", data)
      } catch (error) {
        log.error("logout error", error)
      }
    }
  }

  return (
    <StatefulButton
      text="Log Out"
      textLoading="Logging Out..."
      textUnclickable="Logged Out"
      textError="Error"
      variant="danger"
      variantUnclickable="outline-danger"
      isLoading={isLoading}
      isUnclickable={!isLoggedIn}
      isError={isError}
      onClick={handleClick}
    />
  )
}
