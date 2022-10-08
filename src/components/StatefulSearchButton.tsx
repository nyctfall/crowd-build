import React, { useState } from "react"
import { Button, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap"


export default function StatefulSeachButton({ handleSearch, canSearch, hasSearched, isSearching, children }: { handleSearch: React.MouseEventHandler<HTMLButtonElement>, canSearch: boolean, hasSearched: boolean, isSearching: boolean} & React.PropsWithChildren){
  // popover tooltip state:
  const [ isPop, setPop ] = useState(false)

  return (
    <OverlayTrigger 
      onToggle={(nextShow) => setPop(nextShow)} 
      show={!(canSearch || !isPop)}
      overlay={
        <Tooltip id="part-search-button-tooltip">
          {hasSearched ? "Select different options" : "Select search option"}
        </Tooltip>
      }
    >
      <span className="ms-auto">
        <Button 
          className="ms-auto" 
          variant={"primary"} 
          onClick={handleSearch} 
          style={!canSearch ? { pointerEvents: "none" } : undefined}
          disabled={!canSearch} 
        >
          Search{ isSearching ?
            <>ing...<Spinner as="span" animation="border" role="status" aria-hidden="true" /></>
            : undefined
          }
        </Button>
      </span>
    </OverlayTrigger>
  )
}