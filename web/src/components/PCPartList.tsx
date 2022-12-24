import { Container, Table } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import type { PCPartInfo } from "~types/api"
import PCPart from "./PCPart"

// debugging logger:
const log = dbgLog.fileLogger("PCPartList.tsx")

/**
 * Display table list of array of PC parts.
 *
 * @param {PCPartInfo[]} props.list The array of PC parts to display.
 */
export default function PCPartList({ list = [] }: { list: PCPartInfo[] }) {
  return (
    <Container fluid="xl">
      <Table id="pc-part-table" className="mx-auto">
        <tbody>
          {list.map((part, i) => (
            <PCPart key={i} {...part} />
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
