import { Placeholder, Table } from "react-bootstrap"
import { Container } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import useCacheList from "../hooks/useCacheList"
import PCPartId from "./PCPartId"

// debugging logger:
const log = dbgLog.fileLogger("PCPartListId.tsx")

/**
 * Render PC parts from array of database or entity ids, or from PC Part List database or entity id.
 *
 * @param {string[]} props.partIds The array of PC part ids to display.
 * @param {string} props.listId The entity or database id of the list of PC parts to display.
 * @param {boolean} props.noToggle Allow add/remove from myList button on list parts.
 */
export default function PCPartListId({
  partIds,
  listId,
  noToggle
}: { noToggle?: boolean } & ({ partIds: string[]; listId?: never } | { listId: string; partIds?: never })) {
  // const Log = log.stackLogger("PCPartListId")

  // get list from store cache or database:
  const {
    data,
    rtkQuery: { isError }
  } = useCacheList(listId ? listId : "", { skip: !listId })

  return (
    <Container fluid>
      <Table className="mx-auto">
        <tbody>
          {partIds ? (
            partIds.map((id, i) => <PCPartId key={i} partId={id} noToggle={!!noToggle} />)
          ) : data ? (
            data.parts.map((id, i) => <PCPartId key={i} partId={id} noToggle={!!noToggle} />)
          ) : (
            <tr>
              <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
              <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
              <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
              <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
              <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{ height: "3em" }} />
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  )
}
