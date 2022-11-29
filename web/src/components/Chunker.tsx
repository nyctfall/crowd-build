import { Suspense } from "react"
import { Spinner } from "react-bootstrap"


/**
 * Helper for react suspence of lazy loaded routes.
 */
export default function Chunker({ Element }: { Element: React.LazyExoticComponent<() => JSX.Element> }){
  return (
    <Suspense 
      fallback={
        <Spinner animation="border" variant="secondary" id="center" />
      }
    >
      <Element />
    </Suspense>
  )
}