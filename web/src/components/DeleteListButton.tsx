import { dbgLog } from "~types/logger"
import { HTTPStatusCode } from "~types/api"
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
 * @param {string} props.listId The database id of the list to delete.
 * @param {string} props.owned The list to delete is owned by logged in user, should be false if not owned by user.
 * @param {Function} props.onClick Additional onClick handler.
 * @param {Function} props.onFinish Additional RTK Query result handler.
 */
export default function DeleteListButton({
  listId,
  owned,
  onClick,
  onFinish
}: {
  listId: string
  owned: boolean
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: (arg: Awaited<ReturnType<ReturnType<ReturnType<typeof useDeleteListMutation>[0]>["unwrap"]>>) => any
}) {
  const Log = log.stackLogger("DeleteListButton")

  const dispatch = useAppDispatch()

  const sessionToken = useAppSelector(state => state.session.token)

  // setup delete request:
  const [trigger, mutRes] = useDeleteListMutation()
  const { isLoading, isSuccess, isError, error } = mutRes

  const RTKErrorHTTPStatusCode =
    error && "status" in error && typeof error.status === "number" ? error.status : undefined

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "owned", owned,
      "listId", listId,
      "mutRes", mutRes,
      "sessionToken", sessionToken
    )

    try {
      // delete list in store cache:
      dispatch(removeOneList(listId))

      // send delete list until database responce:
      const data = await trigger({
        id: listId,
        token: owned ? sessionToken : undefined
      }).unwrap()

      log("data", data)

      onFinish?.(data)
    } catch (error) {
      log.stackLoggerInc("catch").error("mutation error", error)
    }

    // parent handler:
    onClick?.(e)
  }

  return (
    <StatefulButton
      isUnclickable={isSuccess || RTKErrorHTTPStatusCode === HTTPStatusCode["Forbidden"]}
      isLoading={isLoading}
      isError={isError || !!error}
      text="Delete List"
      textUnclickable="Deleted"
      textError={
        RTKErrorHTTPStatusCode === HTTPStatusCode["Forbidden"] ? "List Owned By Another User" : "Failed To Delete"
      }
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
