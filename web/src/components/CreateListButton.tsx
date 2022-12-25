import { useState } from "react"
import { Container } from "react-bootstrap"
import { skipToken } from "@reduxjs/toolkit/dist/query"
import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useGetListsQuery, usePostListMutation } from "../redux-stuff/query"
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
  disown = false,
  onClick,
  onFinish
}: {
  disown?: boolean
  onClick?: Parameters<typeof StatefulButton>[0]["onClick"]
  onFinish?: (arg: Awaited<ReturnType<ReturnType<ReturnType<typeof usePostListMutation>[0]>["unwrap"]>>) => any
}) {
  const Log = log.stackLogger("CreateListButton")

  const dispatch = useAppDispatch()

  const myListId = useAppSelector(state => state.myListId.id)
  const listsCache = useAppSelector(state => state.listsCache)
  const sessionToken = useAppSelector(state => state.session.token)

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
  const { isSuccess, isLoading, isError, data } = saveListMut

  // if list is deleted, allow save button to function again after being disabled:
  const savedListQuery = useGetListsQuery(data && isSuccess ? { id: data?._id } : skipToken)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "disown", disown,
      "sessionToken", sessionToken,
      "isIdentical", isIdentical,
      "myListParts", myListParts,
      "myListId", myListId,
      "savedMyListParts", savedMyListParts,
      "savedListQuery",savedListQuery,
      "saveListMut", saveListMut
    )

    if (myListParts?.length) {
      try {
        const data = await trigger({
          parts: myListParts,
          token: !disown ? sessionToken : undefined
        }).unwrap()

        log("data", data)

        // remember parts to prevent saving an identical list:
        setSavedMyListParts(myListParts)

        dispatch(addOneList(data))

        // call parent handler:
        onFinish?.(data)
      } catch (error) {
        log.stackLoggerInc("catch").error("mutation error", error)
      }
    }

    // call parent handler:
    return onClick?.(e)
  }

  return (
    <>
      {disown || sessionToken == null ? (
        <StatefulButton
          variant="success"
          variantLoading="outline-success"
          variantUnclickable="outline-success"
          variantError="danger"
          isUnclickable={(!myListParts || myListParts.length < 1 || isIdentical) && !savedListQuery.isError}
          isLoading={isLoading}
          isError={isError}
          text="Save List"
          textUnclickable={isSuccess ? `Saved${data ? `: ${data._id}` : ""}` : "Save List"}
          textError={"Saving Failed"}
          onClick={handleClick}
          onFinish={onFinish}
        />
      ) : (
        <StatefulButton
          variant="success"
          variantLoading="outline-success"
          variantUnclickable="outline-success"
          variantError="danger"
          isUnclickable={(!myListParts || myListParts.length < 1 || isIdentical) && !savedListQuery.isError}
          isLoading={isLoading}
          isError={isError}
          text="Save List As Owner"
          textUnclickable={isSuccess ? `Saved${data ? `: ${data._id}` : ""}` : "Save List As Owner"}
          textError={"Saving Failed"}
          onClick={handleClick}
          onFinish={onFinish}
        />
      )}
      {data && !savedListQuery.isError ? <Container>Your new list ID: {data._id}</Container> : ""}
    </>
  )
}
