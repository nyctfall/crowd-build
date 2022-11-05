import { useState } from "react"
import { Button, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap"


/**
 * Button used from PC part search.
 * 
 * @param {boolean} props.handleSearch The onClick handler for the button.
 * @param {boolean} props.canSearch Button is not disabled.
 * @param {boolean} props.hasSearched Button was previously clicked.
 * @param {boolean} props.isSearching Button action has not finished yet.
 * @param {boolean} props.children Unused.
 */
export default function StatefulSeachButton({ handleSearch, canSearch, hasSearched, isSearching, children }: { handleSearch: React.MouseEventHandler<HTMLButtonElement>, canSearch: boolean, hasSearched: boolean, isSearching: boolean} & React.PropsWithChildren){
  // popover tooltip state:
  const [isPop, setPop] = useState(false)


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
          Search{ isSearching ? <>
              ing...<Spinner as="span" animation="border" role="status" aria-hidden="true" />
            </>
            : ""
          }
        </Button>
      </span>
    </OverlayTrigger>
  )
}