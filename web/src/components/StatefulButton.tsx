import { Button, Spinner } from "react-bootstrap"
import { dbgLog } from "~types/logger"

// debugging logger:
const log = dbgLog.fileLogger("StatefulButton.tsx")

/**
 * A Button that has a clickable state, actively clicked state, loading state, error state, and unclickable disabled state.
 *
 * @param {?Function} props.onClick Additional onClick handler.
 * @param {?Function} props Passed directly to internal BootStrap Button.
 */
export default function StatefulButton(
  props: {
    isLoading?: boolean
    isUnclickable?: boolean
    isError?: boolean
    text?: string | JSX.Element
    textLoading?: string | JSX.Element
    textUnclickable?: string | JSX.Element
    textError?: string | JSX.Element
    variant?: Parameters<typeof Button>[0]["variant"]
    variantLoading?: Parameters<typeof Button>[0]["variant"]
    variantUnclickable?: Parameters<typeof Button>[0]["variant"]
    variantError?: Parameters<typeof Button>[0]["variant"]
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  } & Omit<Parameters<typeof Button>[0], "variant" | "active" | "disabled" | "onClick">
) {
  const Log = log.stackLogger("StatefulButton")

  const {
    onClick,
    isLoading,
    isError,
    isUnclickable,
    text,
    textLoading,
    textError,
    textUnclickable,
    variant,
    variantLoading,
    variantError,
    variantUnclickable
  } = props

  // button state color:
  const buttonVariant = isLoading
    ? variantLoading
    : isError
    ? variantError
    : isUnclickable
    ? variantUnclickable
    : variant

  // button loading spinner color:
  const spinnerVariant = buttonVariant?.replace("outline-", "")

  // props for internal Button:
  const attributes = Object.fromEntries(
    Object.entries(props).filter(
      ([prop]) =>
        ![
          "onClick",
          "onFinish",
          "isLoading",
          "isError",
          "isUnclickable",
          "text",
          "textLoading",
          "textError",
          "textUnclickable",
          "variant",
          "variantLoading",
          "variantError",
          "variantUnclickable"
        ].includes(prop)
    )
  )

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const log = Log.stackLoggerInc("handleClick")

    // prettier-ignore
    log(
      "buttonVariant", buttonVariant,
      "spinnerVariant", spinnerVariant,
      "attributes", attributes,
      "props", props
    )

    // call parent handler:
    const clickResult = onClick?.(e)

    log("e", e, "clickResult", clickResult)
  }

  return (
    <Button variant={buttonVariant} active={isLoading} disabled={isUnclickable} onClick={handleClick} {...attributes}>
      {isLoading ? (
        <>
          {textLoading}
          <Spinner variant={spinnerVariant} animation="border" />
        </>
      ) : isError ? (
        textError
      ) : isUnclickable ? (
        textUnclickable
      ) : (
        text
      )}
    </Button>
  )
}
