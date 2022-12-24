import { Placeholder } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import useCachePart from "../hooks/useCachePart"
import PCPart from "./PCPart"

// debugging logger:
const log = dbgLog.fileLogger("PCPartId.tsx")

/**
 * Dipslay PC part info from entity or database id.
 *
 * @param {string} props.partId The entity of database id of the pc part info.
 * @param {boolean} props.noToggle Don't show add the myList button.
 */
export default function PCPartId(props: { partId: string; noToggle?: boolean }) {
  // const Log = log.stackLogger("PCPartId")

  const { partId, noToggle } = props

  // get part from store cache or database:
  const partCache = useCachePart(partId)
  const {
    data,
    rtkQuery: { isError }
  } = partCache

  return (
    data ? (
      <PCPart {...data} noToggle={!!noToggle} />
    ) : (
      <tr>
        <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
        <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
        <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
        <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
        <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
      </tr>
    )
  )
}
