import { Button, Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import PCPartList from "../components/PCPartList"
import { useAppSelector } from "../redux-stuff/hooks"
import type { PCPartInfo } from "../../types/api"
import SearchListDB from "../components/SearchListDB"
import CreateListButton from "../components/CreateListButton"


/**
 * The main hub for most list operations, edit local myList, save local myList the database, search for database lists, use, edit, and delete lists from database.
 */
export default function MyList(){
  const myListState = useAppSelector(state => state.myList)

  const myList = Object.values(myListState.entities).filter(part => part != undefined) as PCPartInfo[]
  
  
  return (
    <>
      <h1>My List</h1>

      <Container fluid className="my-5">
        <SearchListDB />
      </Container>

      {myList.length > 0 ? <>
          <PCPartList list={myList} />

          <Container fluid className="mw-100 m-3 mx-auto">
            <CreateListButton />
          </Container>
        </>
        : <>
          <h2>Try searching for parts to add to your build!</h2>
        </>
      }

      <LinkContainer to="/database" className="m-5 mx-auto">
        <Button variant={myList.length > 0 ? "secondary" : "info"}>PC Part Database</Button>
      </LinkContainer>
    </>
  )
}