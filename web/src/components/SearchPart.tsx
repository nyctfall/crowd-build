import { useEffect, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query/react"
import { ButtonToolbar, Container, Dropdown, DropdownButton, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import { PCPartType } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useLazyGetPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsCache"
import { setAllFilterTypes } from "../redux-stuff/reducers/partSearchParams"
import { setReSearched, setSearched } from "../redux-stuff/reducers/search-state"
import StatefulSeachButton from "./StatefulSearchButton"
import PCPartList from "./PCPartList"

// debugging logger:
const log = dbgLog.fileLogger("SearchPart.tsx")

/**
 * Search for PC parts by type.
 * @todo enable query string in url using React Router useQuery() hook
 */
export default function SearchPart({
  onGetSearch
}: {
  onGetSearch?: (searchQureyResult: ReturnType<typeof useLazyGetPartsQuery>) => any
}) {
  const Log = log.stackLogger("SearchPart")

  const dispatch = useAppDispatch()

  // get search queryState from store, part type selected state:
  const { partSearchParams: searchParams } = useAppSelector(state => state)

  // fetch parts:
  const [trigger, searchQuery] = useLazyGetPartsQuery()
  const { data, isFetching } = searchQuery

  // change search options:
  const handleToggle = (
    e: React.MouseEvent<HTMLButtonElement | HTMLElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
    newPartType: PCPartType
  ) => {
    const log = Log.stackLoggerInc("handleToggle")

    // prettier-ignore
    log(
      "newPartType", newPartType,
      "searchParams.types", searchParams.types,
      "searchParams", searchParams,
      "e", e
    )

    // check same search option is not being set again:
    if (searchParams.types.includes(newPartType)) return

    // set the part search options:
    dispatch(setAllFilterTypes([newPartType]))
  }

  // search db with options set:
  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleSearch")

    // prettier-ignore
    log(
      "searching... queryState", searchParams,
      "e", e
    )

    try {
      // serach for part matching options:
      const partsQryRes = await trigger(searchParams, true).unwrap()
  
      log("partsQryRes", partsQryRes)
      
      // add the fetched parts to the store:
      dispatch(addManyParts(partsQryRes))
    } catch (e) {
      log.error("err", e)
    }
  }

  return (
    <>
      <Container fluid id="search-bar">
        <ButtonToolbar>
          {/* for small screens: dropdown */}
          <DropdownButton
            title={searchParams.types.length > 0 ? `Type: ${searchParams.types.join(", ")}` : "Part Type"}
            id="search-type-select"
            variant={`${searchParams.types.length > 0 ? "" : "outline-"}secondary`}
          >
            {Object.values(PCPartType).map((type, i) => (
              <Dropdown.Item
                key={i}
                id={`${type}-${Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)}`}
                name={type}
                variant={`${searchParams.types.includes(type) ? "" : "outline-"}secondary`}
                value={type}
                onClick={e => handleToggle(e, type)}
              >
                {type}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          {/* for large screens: toolbar */}
          <ToggleButtonGroup
            name="SearchPCPartType"
            type="radio"
            style={{ flexWrap: "wrap" }}
            id="search-type-toolbar"
          >
            {Object.values(PCPartType).map((type, i) => (
              <ToggleButton
                key={i}
                id={`${type}-${Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)}`}
                variant={`${searchParams.types.includes(type) ? "" : "outline-"}secondary`}
                value={type}
                name={type}
                type="radio"
                onChange={e => handleToggle(e, type)}
              >
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <StatefulSeachButton
            isSearching={isFetching}
            hasSearched={searchParams.types.length > 0}
            canSearch={true}
            handleSearch={handleSearch}
          />
        </ButtonToolbar>
      </Container>

      {data ? (
        data.length > 0 ? (
          <PCPartList list={data} />
        ) : (
          <h2>Sorry, no results matched that search...</h2>
        )
      ) : (
        <h2>Try searching for parts to add to your build!</h2>
      )}
    </>
  )
}
