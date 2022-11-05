import { Container, Table } from "react-bootstrap"
import PCPart from "./PCPart"
import type { PCPartInfo } from "../../types/api"
import "../styles/PCPartList.scss"


/**
 * Display table list of array of PC parts.
 * 
 * @param {PCPartInfo[]} props.list The array of PC parts to display.
 */
export default function PCPartList({ list = [] }: { list: PCPartInfo[] }){
  return (
    <Container fluid>
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