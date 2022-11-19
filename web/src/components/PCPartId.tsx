import { Placeholder } from "react-bootstrap"
import useCachePart from "../hooks/useCachePart"
import PCPart from "./PCPart"


/**
 * Dipslay PC part info from entity or database id.
 * 
 * @param {string} props.id The entity of database id of the pc part info.
 * @param {boolean} props.noToggle Don't show add the myList button.
 */
export default function PCPartId({ id, noToggle }: { id: string, noToggle?: boolean }){
  // get part from store cache or database:
  const { data, rtkQuery: { isError } } = useCachePart(id)

  
  return (
    <>
      {data ? 
        <PCPart {...data} noToggle={noToggle} />
        : <>
          <tr>
            <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
            <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
            <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
            <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
            <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
          </tr>
        </>
      }
    </>
  )
}