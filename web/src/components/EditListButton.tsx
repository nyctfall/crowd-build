import { dbgLog } from "~types/logger"
import type { ModifyResponce, SessionType } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePatchListMutation } from "../redux-stuff/query"
import { updateOneList } from "../redux-stuff/reducers/listsCache"
import StatefulButton from "./StatefulButton"

// debugging logger:
const log = dbgLog.fileLogger("EditListButton.tsx")

/**
 * Overwrite current myList to unowned lists or lists owned by user.
 *
 * Cannot edit lists owned by other users.
 *
 * @param {string} props.listId The database id of the list to edit.
 * @param {string} props.owned The list to edit is owned by a user, should be false if not owned by a user.
 */
export default function EditListButton({
  listId,
  owned,
  onClick,
  onFinish
}: {
  listId: string
  owned: boolean
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: (arg: Awaited<ReturnType<ReturnType<ReturnType<typeof usePatchListMutation>[0]>["unwrap"]>>) => any
}) {
  const Log = log.stackLogger("EditListButton")

  const dispatch = useAppDispatch()

  const myListId = useAppSelector(state => state.myListId.id)
  const listsCache = useAppSelector(state => state.listsCache)
  const sessionToken = useAppSelector(state => state.session.token)

  // the PC part ids from myList to overwrite the target list with:
  const myListParts = listsCache.entities[myListId]?.parts

  // no-op if target list and myList have all the same parts:
  const isIdentical =
    myListParts &&
    myListParts.length === listsCache.entities[listId]?.parts.length &&
    myListParts.every(partId => listsCache.entities[listId]?.parts.includes(partId))

  // setup patch request:
  const [trigger, editRes] = usePatchListMutation()
  const { isLoading, isUninitialized, isError, data } = editRes

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "owned", owned,
      "sessionToken", sessionToken,
      "myListId", myListId,
      "listsCache", listsCache,
      "myListParts", myListParts,
      "isIdentical", isIdentical,
      "editRes", editRes
    )

    // update list in database with parts in myList:
    if (myListParts) {
      try {
        const data = await trigger({
          id: listId,
          parts: myListParts,
          token: owned ? sessionToken : undefined
        }).unwrap()

        log("data", data)

        // update list in cache:
        if ((data as SessionType)?.success || (data as ModifyResponce)?.modifiedCount)
          dispatch(
            updateOneList({
              id: listId,
              changes: { parts: myListParts }
            })
          )

        // call parent handler:
        onFinish?.(data)
      } catch (error) {
        log.error("edit mut error", error)
      }
    }

    // call parent handler:
    onClick?.(e)
  }

  return (
    <StatefulButton
      text="Edit List"
      textLoading={"Editiing..."}
      textUnclickable={
        !myListParts?.length
          ? "Must Have PC Parts In My List"
          : !isUninitialized && !((data as SessionType)?.success || (data as ModifyResponce)?.modifiedCount)
          ? "Cannot Edit List"
          : "Same As My List"
      }
      textError={"Failed To Edit List"}
      isLoading={isLoading}
      isUnclickable={!myListParts?.length || isIdentical}
      isError={isError}
      variant="warning"
      variantLoading="warning"
      variantUnclickable="outline-warning"
      variantError="outline-warning"
      onClick={handleClick}
      onFinish={onFinish}
    />
  )
}
