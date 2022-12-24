import { useEffect } from "react"
import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { updateOneList } from "../redux-stuff/reducers/listsCache"
import useLazyCacheList from "../hooks/useLazyCacheList"
import StatefulButton from "./StatefulButton"

// debugging logger:
const log = dbgLog.fileLogger("CopyListButton.tsx")

/**
 * Add all parts on target list to myList.
 *
 * @param {string} props.id The database or entity id of the list to use.
 * @param {?Function} props.onClick Additional onClick handler.
 * @param {?Function} props.onFinish Handler for the onClick RTK Query Action.
 */
export default function CopyListButton({
  id,
  onClick,
  onFinish
}: {
  id: string
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: (arg: Awaited<ReturnType<ReturnType<typeof useLazyCacheList>["trigger"]>>) => any
}) {
  const Log = log.stackLogger("CopyListButton")

  const dispatch = useAppDispatch()

  const state = useAppSelector(state => state)
  const {
    myListId: { id: myListId },
    partsCache,
    listsCache
  } = state

  // myList as array of part ids:
  const myList = listsCache.entities[myListId]?.parts

  // get list from id, should be from cache or fetch from database:
  const listCache = useLazyCacheList()

  const {
    trigger,
    data: targetList,
    rtkQuery: { isError: isErrorList, isFetching },
    populated: {
      rtkQuery: { isError: isErrorParts }
    }
  } = listCache

  // list to copy:
  const targetListParts = targetList?.parts

  // no-op if target list and myList have all the same parts:
  const isIdentical =
    myList &&
    targetListParts &&
    myList.length === targetListParts.length &&
    myList.every(partId => targetListParts.includes(partId))

  // replace myList with target list:
  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[targetList])")(
      "targetListParts", targetListParts,
      "targetList", targetList,
      "myList", myList,
      "isIdentical", isIdentical,
      "listCache", listCache,
      "myListId", myListId,
      "state.myListId", state.myListId,
      "lists", listsCache,
      "partsDB", partsCache
    )

    // get target list by id, then add all of it's parts to overwrite myList:
    if (targetListParts)
      dispatch(
        updateOneList({
          id: myListId,
          changes: {
            parts: targetListParts
          }
        })
      )
  }, [targetList])

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "targetListParts", targetListParts,
      "targetList", targetList,
      "myList", myList,
      "isIdentical", isIdentical,
      "listCache", listCache,
      "myListId", myListId,
      "state.myListId", state.myListId,
      "lists", listsCache,
      "partsDB", partsCache
    )

    // get target list by id, then add all of it's parts to overwrite myList,
    const listCacheRes = await trigger({ id }, true)

    log("listCacheRes", listCacheRes)

    if (listCacheRes.list)
      dispatch(
        updateOneList({
          id: myListId,
          changes: {
            parts: listCacheRes.list.parts
          }
        })
      )

    // call parent handler:
    onClick?.(e)
    onFinish?.(listCacheRes)
  }

  return (
    <StatefulButton
      text="Copy To My List"
      variant={"info"}
      textLoading="Loading..."
      isLoading={isFetching}
      textUnclickable="Same As My List"
      isUnclickable={isIdentical}
      variantUnclickable={"outline-secondary"}
      textError="Error Copying List"
      isError={isErrorList || isErrorParts}
      onClick={handleClick}
    />
  )
}
