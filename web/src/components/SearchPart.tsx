import { ButtonToolbar, Container, Dropdown, DropdownButton, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import { PCPartType } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useLazyGetPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsCache"
import { setAllFilterTypes } from "../redux-stuff/reducers/partSearchParams"
import PCPartList from "./PCPartList"
import StatefulButton from "./StatefulButton"
import { useEffect } from "react"

// debugging logger:
const log = dbgLog.fileLogger("SearchPart.tsx")

/**
 * Search for PC parts by type.
 * @todo enable query string in url using React Router useQuery() hook
 */
export default function SearchPart() {
  const Log = log.stackLogger("SearchPart")

  const dispatch = useAppDispatch()

  // get search queryState from store, part type selected state:
  const searchParams = useAppSelector(state => state.partSearchParams)

  // fetch parts:
  const [trigger, searchQuery] = useLazyGetPartsQuery()
  const { data, isFetching, isError, isSuccess } = searchQuery

  // auto relaod previous search:
  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[])")(
      "searchParams", searchParams
    )

    if (
      searchParams.types.length > 0 ||
      searchParams.oems.length > 0 ||
      searchParams.ids.length > 0 ||
      searchParams.minPrice ||
      searchParams.maxPrice
    )
      trigger(searchParams, true)
  }, [])

  // change search options:
  const handleToggle = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
    newPartType: PCPartType
  ) => {
    const log = Log.stackLoggerInc("handleToggle")

    // prettier-ignore
    log(
      "newPartType", newPartType,
      // @ts-ignore
      "e.target?.value", e.target?.value,
      // @ts-ignore
      "e.target?.name", e.target?.name,
      // @ts-ignore
      "e.target?.attributes?.value?.value", e.target?.attributes?.value?.value,
      "searchParams.types", searchParams.types,
      "searchParams", searchParams,
      "sesearchQuery",searchQuery,
      "e", e,
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
      "searchParams", searchParams,
      "searchQuery", searchQuery,
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
                active={searchParams.types.includes(type)}
                onClick={e => handleToggle(e, type)}
              >
                {type}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          {/* for large screens: toolbar */}
          <ToggleButtonGroup name="SearchPCPartType" type="radio" style={{ flexWrap: "wrap" }} id="search-type-toolbar">
            {Object.values(PCPartType).map((type, i) => (
              <ToggleButton
                key={i}
                id={`${type}-${Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER)}`}
                variant={`${searchParams.types.includes(type) ? "" : "outline-"}secondary`}
                value={type}
                name={type}
                type="radio"
                active={searchParams.types.includes(type)}
                onChange={e => handleToggle(e, type)}
              >
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <StatefulButton
            className="ms-auto"
            isLoading={isFetching}
            isError={isError}
            variant="primary"
            variantError="danger"
            text="Search"
            textLoading="Searching..."
            onClick={handleSearch}
          />
        </ButtonToolbar>
      </Container>

      {data ? (
        !isError && !isFetching && isSuccess && data.length > 0 ? (
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
