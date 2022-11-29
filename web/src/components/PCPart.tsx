import { Button } from "react-bootstrap"
import reactLogo from "../assets/react.svg"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { dbgLog, PCPartInfo } from "~types/api"
import { addMyListPart, removeMyListPart } from "../redux-stuff/reducers/myList"


/**
 * Display PC part info from info object.
 * 
 * @param {PCPartInfo} props The object of pc part info.
 * @param {boolean} props.noToggle Don't display add to list button.
 */
export default function PCPart(info: PCPartInfo & { noToggle?: boolean }){
  const dispatch = useAppDispatch()
  
  const list = useAppSelector((state) => state.myList)
  

  const { _id: id, img = reactLogo, name = "product image", oem: manufacturer, model, MSRP, type, typeInfo } = info
  
  const onList = list.ids.includes(id)


  const handleClick = () => {
    dbgLog("PCPart.tsx", ["PCPart","handleClick"], "onList", onList, "info", info, "list", list)

    dispatch(!onList ? addMyListPart(info) : removeMyListPart(id))
  }


  return (
    <tr>
      <td>
        <img 
          src={img || "src/assets/react.svg"} 
          alt={name} 
          className="d-inline-block"
        />
      </td>
      <td>{type}</td>
      <td>{manufacturer}</td>
      <td>{model}</td>
      <td>${MSRP}</td>

      { typeInfo ? /** @todo Accordion */"" : ""}

      {info.noToggle ? "" :
        <td>
          <Button variant={!onList ? "success" : "danger"} onClick={handleClick}>
            {!onList ? "Add" : "Remove"}
          </Button>
        </td>
      }
    </tr>
  )
}