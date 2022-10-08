import { Container, Table } from "react-bootstrap"
import PCPart from "./PCPart"
import type { PCPartInfo } from "../../types/api"
import "../styles/PCPartList.scss"


function PCPartList({ list = [] }: { list: PCPartInfo[] }){
  let i = 0
  
  return (
    <Container fluid>
      <Table id="pc-part-table" className="mx-auto">
        <tbody>
          {list.map((part: PCPartInfo) => (
            <PCPart key={i++} {...part} />
            ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default PCPartList