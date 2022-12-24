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
 * @param {string} props.id The database id of the list to edit.
 */
export default function EditListButton({
  id,
  onClick,
  onFinish
}: {
  id: string
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: Parameters<typeof StatefulButton>[0]["onFinish"]
}) {
  const Log = log.stackLogger("EditListButton")

  const dispatch = useAppDispatch()

  const {
    myListId: { id: myListId },
    listsCache,
    session
  } = useAppSelector(state => state)

  // the PC part ids from myList to overwrite the target list with:
  const myListParts = listsCache.entities[myListId]?.parts

  // no-op if target list and myList have all the same parts,
  // useMemo to only recomput on change and for performance in large lists:
  const isIdentical =
    myListParts &&
    myListParts.length === listsCache.entities[id]?.parts.length &&
    myListParts.every(partId => listsCache.entities[id]?.parts.includes(partId))

  /** @todo track if myList or target lists was changed since last edit: */

  // setup patch request:
  const [trigger, editRes] = usePatchListMutation()
  const { isSuccess, isLoading, isUninitialized, isError, data } = editRes

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "session", session,
      "myListId", myListId,
      "lists", listsCache,
      "myListParts", myListParts,
      "isIdentical", isIdentical,
      "editRes", editRes
    )

    // update list in database with parts in myList:
    if (myListParts) {
      const mutRes = trigger({
        id,
        token: session.token,
        parts: myListParts
      })

      log("mutRes", mutRes)
      ;(async () => {
        const data = await mutRes.unwrap()

        log("data", data)

        // update list in cache:
        if ((data as SessionType)?.success || (data as ModifyResponce)?.modifiedCount)
          dispatch(updateOneList({ id: id, changes: { parts: myListParts } }))
      })()
    }

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
      variantError="outline-secondary"
      onClick={handleClick}
      onFinish={onFinish}
    />
  )
}
