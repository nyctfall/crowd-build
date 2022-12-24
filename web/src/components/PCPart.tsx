import { Button } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import type { PCPartInfo } from "~types/api"
import reactLogo from "../assets/react.svg"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { updateOneList } from "../redux-stuff/reducers/listsCache"

// debugging logger:
const log = dbgLog.fileLogger("PCPart.tsx")

/**
 * Display PC part info from info object.
 *
 * @param {PCPartInfo} props The object of pc part info.
 * @param {?boolean} props.noToggle Don't display add to list button.
 * @param {?Function} props.onClick Additional handler for "add/remove from list" button.
 */
export default function PCPart(props: PCPartInfo & { noToggle?: boolean; onClick?: Function }) {
  const Log = log.stackLogger("PCPart")

  const dispatch = useAppDispatch()

  const {
    noToggle,
    onClick,
    _id: partId,
    img = reactLogo,
    name = "product image",
    oem,
    model,
    MSRP,
    type,
    typeInfo
  } = props

  const {
    myListId: { id: myListId },
    listsCache
  } = useAppSelector(state => state)

  // array of parts in myList:
  const myListParts = listsCache.entities[myListId]?.parts

  // check if part is in myList:
  const onList = !!myListParts?.includes(partId)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // prettier-ignore
    Log.stackLoggerInc("handleClick")(
      "info", props,
      "myListId", myListId,
      "lists", listsCache,
      "onList", onList,
      "myListParts", myListParts
    )

    if (myListParts)
      dispatch(
        updateOneList({
          id: myListId,
          changes: {
            parts: onList
              ? // remove if already on list:
                myListParts.filter(id => partId !== id)
              : // add part to list:
                [...myListParts, partId]
          }
        })
      )

    // call parent handler:
    onClick?.(e)
  }

  return (
    <tr className="py-auto">
      <td style={{ height: "max(15vh, 4rem)", width: "max(15vh, 4rem)" }}>
        <img src={img || "src/assets/react.svg"} alt={name} className="d-inline-block h-100" />
      </td>
      <td>{type}</td>
      <td>{oem}</td>
      <td>{model}</td>
      <td>${MSRP}</td>

      {/** @todo Accordion */}
      {/* {typeInfo ?  "" : ""} */}

      {noToggle ? (
        ""
      ) : (
        <td>
          <Button variant={!onList ? "success" : "danger"} onClick={handleClick}>
            {!onList ? "Add" : "Remove"}
          </Button>
        </td>
      )}
    </tr>
  )
}
