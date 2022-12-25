import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { updateOneList } from "../redux-stuff/reducers/listsCache"
import useCacheList from "../hooks/useCacheList"
import StatefulButton from "./StatefulButton"

// debugging logger:
const log = dbgLog.fileLogger("CopyListButton.tsx")

/**
 * Add all parts on target list to myList.
 *
 * @param {string} props.listId The database or entity id of the list to use.
 * @param {?Function} props.onClick Additional onClick handler.
 * @param {?Function} props.onFinish Handler for the onClick RTK Query Action.
 */
export default function CopyListButton({
  listId,
  onClick,
  onFinish
}: {
  listId: string
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: (arg: ReturnType<typeof useCacheList>) => any
}) {
  const Log = log.stackLogger("CopyListButton")

  const dispatch = useAppDispatch()

  const myListId = useAppSelector(state => state.myListId.id)
  const listsCache = useAppSelector(state => state.listsCache)

  // myList as array of part ids:
  const myList = listsCache.entities[myListId]?.parts

  // get list from id, should be from cache or fetch from database:
  const listCache = useCacheList(listId)

  const {
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
    // list hasn't loaded yet, unclickable:
    !targetListParts
      ? true
      : // start myList by copying this list:
      !myList
      ? false
      : // check for same parts in both lists:
        myList.length === targetListParts.length && myList.every(partId => targetListParts.includes(partId))

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "listId", listId,
      "targetListParts", targetListParts,
      "targetList", targetList,
      "myList", myList,
      "isIdentical", isIdentical,
      "listCache", listCache,
      "myListId", myListId
    )

    // overwrite myList parts with target lists parts:
    if (targetListParts)
      dispatch(
        updateOneList({
          id: myListId,
          changes: {
            parts: targetListParts
          }
        })
      )

    // call parent handlers:
    onClick?.(e)
    onFinish?.(listCache)
  }

  return (
    <StatefulButton
      text="Copy To My List"
      variant={"info"}
      textLoading="Loading..."
      isLoading={isFetching}
      textUnclickable="Same As My List"
      isUnclickable={isIdentical}
      variantUnclickable={"outline-info"}
      textError="Error Copying List"
      isError={isErrorList || isErrorParts}
      onClick={handleClick}
    />
  )
}
