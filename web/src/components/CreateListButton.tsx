import { useState } from "react"
import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePostListMutation } from "../redux-stuff/query"
import { addOneList } from "../redux-stuff/reducers/listsCache"
import StatefulButton from "./StatefulButton"

// debugging logger:
const log = dbgLog.fileLogger("CreateListButton.tsx")

/**
 * Create a list on the database by saving it with RTK Query.
 *
 * Defaults to saving as public list.
 *
 * @todo once list is saved, allow editing uusing RTK Query cache to get saved myList _id to edit on db.
 * @todo track is list is in db use rtkq invalidate cache tag for created list to allow resave if deleted.
 * @param {boolean} props.disown Will save as a public list, instead of as a list owned by signed-in user.
 * @param {?Function} props.onClick Called on button click with onClick event.
 * @param {?Function} props.onFunction Called on button click with RTK Query Action.
 */
export default function CreateListButton({
  disown,
  onClick,
  onFinish
}: {
  disown?: boolean
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: (arg: ReturnType<ReturnType<ReturnType<typeof usePostListMutation>[0]>["unwrap"]>) => any
}) {
  const Log = log.stackLogger("CreateListButton")

  const dispatch = useAppDispatch()

  const {
    myListId: { id: myListId },
    listsCache,
    session
  } = useAppSelector(state => state)

  // myList parts as part id array:
  const myListParts = listsCache.entities[myListId]?.parts

  // version of myList already saved:
  const [savedMyListParts, setSavedMyListParts] = useState<string[]>([])

  // checks if myList is already saved:
  const isIdentical =
    myListParts &&
    myListParts.length === savedMyListParts.length &&
    savedMyListParts.every(id => myListParts.includes(id))

  // if there are myList contents, save list to database:
  const [trigger, saveListMut] = usePostListMutation()

  const { isSuccess, isLoading, isError, data, error } = saveListMut

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "myListId", myListId,
      "savedMyListParts", savedMyListParts,
      "myListParts", myListParts,
      "data", data,
      "error", error,
      "saveListMut", saveListMut
    )

    if (myListParts?.length) {
      ;(async () => {
        try {
          const mutRes = trigger({
            parts: myListParts,
            token: session.token && !disown ? session.token : undefined
          })

          log("mutRes", mutRes)

          const data = await mutRes.unwrap()

          log("data", data)

          setSavedMyListParts(myListParts)

          dispatch(addOneList(data))
        } catch (error) {
          log.stackLoggerInc("catch").error("mutation error", error)
        }
      })()
    }

    // call parent handler:
    return onClick?.(e)
  }

  return (
    <StatefulButton
      variant="success"
      variantLoading="outline-success"
      variantUnclickable="outline-success"
      variantError="danger"
      isUnclickable={!myListParts || myListParts.length < 1 || isIdentical}
      isLoading={isLoading}
      isError={isError}
      text="Save List"
      textUnclickable={isSuccess ? "Saved" : "Save List"}
      textError={"Saving Failed"}
      onClick={handleClick}
      onFinish={onFinish}
    />
  )
}
