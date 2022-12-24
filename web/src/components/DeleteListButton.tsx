import { dbgLog } from "~types/logger"
import type { DeleteResponce, SessionType } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useDeleteListMutation } from "../redux-stuff/query"
import { removeOneList } from "../redux-stuff/reducers/listsCache"
import StatefulButton from "./StatefulButton"

// debugging logger:
const log = dbgLog.fileLogger("DeleteListButton.tsx")

/**
 * Delete unowned list or list owned by signed-in user.
 *
 * Cannot delete lists owned by other users.
 *
 * @param {string} props.id The database id of the list to delete.
 * @param {Function} props.onClick Additional onClick handler.
 * @param {Function} props.onFinish Additional RTK Query result handler.
 */
export default function DeleteListButton({
  id,
  onClick,
  onFinish
}: {
  id: string
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: Parameters<typeof StatefulButton>[0]["onFinish"]
}) {
  const Log = log.stackLogger("DeleteListButton")

  const dispatch = useAppDispatch()

  const { session } = useAppSelector(state => state)

  // setup delete request:
  const [trigger, mutRes] = useDeleteListMutation()
  const { isLoading, isSuccess, isUninitialized, data, isError } = mutRes

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "mutRes", mutRes,
      "session", session
    )

    // parent handler:
    onClick?.(e)

    try {
      // send delete list until database responce:
      const mutRes = trigger({ id, token: session.token })

      log("mutRes", mutRes)

      const data = await mutRes.unwrap()

      log("data", data)

      // delete list in store cache:
      if ((data as SessionType)?.success || (data as DeleteResponce)?.deletedCount) dispatch(removeOneList(id))
    } catch (error) {
      log.stackLoggerInc("catch").error("mutation error", error)
    }
  }

  return (
    <StatefulButton
      isUnclickable={
        isSuccess ||
        ((!isUninitialized || isError) && !((data as SessionType)?.success || (data as DeleteResponce)?.deletedCount))
      }
      isLoading={isLoading}
      isError={isError}
      text="Delete List"
      textUnclickable="Deleted"
      textError={isError ? "Failed To Delete" : "Cannot Delete List"}
      textLoading="Deleting..."
      variant="danger"
      variantUnclickable="outline-danger"
      variantError="outline-danger"
      variantLoading="outline-danger"
      onClick={handleClick}
      onFinish={onFinish}
    />
  )
}
