import { Placeholder, Table } from "react-bootstrap"
import { Container } from "react-bootstrap"
import { dbgLog } from "~types/api"
import useCacheList from "../hooks/useCacheList"
import PCPartId from "./PCPartId"


/** 
 * Render PC parts from array of database or entity ids, or from PC Part List database or entity id.
 * 
 * @param {string[]} props.partIds The array of PC part ids to display.
 * @param {string} props.listId The entity or database id of the list of PC parts to display.  
 */
export default function PCPartListId({ partIds, listId }: { partIds: string[], listId?: never } | { listId: string, partIds?: never }){
  // get list from store cache or database:
  const listCache = useCacheList(listId ? listId : "", { skip: !listId })
  const { data, rtkQuery: { isError } } = listCache

  
  dbgLog("PCPartListId.tsx", "PCPartListId", "partIds", partIds, "listId", listId, "data", data, "listCache", listCache)
  
  
  return (
    <>
      <Container fluid>
        <Table className="mx-auto">
          <tbody>
            {partIds ? 
              partIds.map((id, i) => <PCPartId key={i} id={id} noToggle={true} />)
              : data ?
                data.parts.map((id, i) => <PCPartId key={i} id={id} noToggle={true} />)
                : <tr>
                  <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
                  <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
                  <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
                  <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
                  <Placeholder as="td" animation="glow" bg={isError ? "danger" : "secondary"} style={{height:"3em"}} />
                </tr>
            }
          </tbody>
        </Table>
      </Container>
    </>
  )
}