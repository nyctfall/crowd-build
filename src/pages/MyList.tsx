import React from "react"
import { Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import type { PCPartInfo } from "../../types/api"
import PCPartList from "../components/PCPartList"
import { useAppSelector } from "../redux-stuff/hooks"


export default function MyList(){
  const entities = useAppSelector(state => state.myList.entities)
  const list = Object.values(entities)

  return (
    <>
      <h1>My List</h1>
      {list.length > 0 ? 
        <PCPartList list={list as PCPartInfo[]} /> : 
        <>
          <h2>Try searching for parts to add to your build!</h2>
          <LinkContainer to="/database"><Button>PC Part Database</Button></LinkContainer>
        </>
      }
    </>
  )
}