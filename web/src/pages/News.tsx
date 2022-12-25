import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import { HTTPStatusCode, NewsStory } from "~types/api"
import StatefulButton from "../components/StatefulButton"
import { useGetNewsQuery } from "../redux-stuff/query"

// debugging logger:
const log = dbgLog.fileLogger("News.tsx")

/**
 * Show a news feed.
 */
export default function News() {
  const Log = log.stackLogger("News")

  // news stories per request:
  const newsFetchLimit = 1

  /** @todo investigate using 304 Not Modified HTTP code for caching already retrieved data instead of using offset */
  // skip already fetched stories:
  const [latestNewsOffset, setLatestNewsOffset] = useState(0)

  // populate initial stories:
  const [newsStories, setNewsStories] = useState<NewsStory[]>([])

  // fetch news stories:
  const newsQuery = useGetNewsQuery(
    {
      limit: newsFetchLimit,
      offset: latestNewsOffset
    },
    {
      // check for new stories every 15 min:
      pollingInterval: 1000 * 60 * 15
    }
  )

  const { data, isFetching, isSuccess, isError, error } = newsQuery

  const RTKErrorHTTPStatusCode =
    error && "status" in error && typeof error.status === "number" ? error.status : undefined

  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[data])")(
      "newsFetchLimit", newsFetchLimit,
      "latestNewsOffset", latestNewsOffset,
      "newsStories", newsStories,
      "data", data,
      "newsQuery", newsQuery
    )

    if (data) setNewsStories(newsStories.concat(data))
  }, [data])

  const handleClick = () => {
    // prettier-ignore
    Log.stackLoggerInc("handleClick")(
      "newsFetchLimit", newsFetchLimit,
      "latestNewsOffset", latestNewsOffset,
      "newsStories", newsStories,
      "data", data,
      "newsQuery", newsQuery
    )

    if (isSuccess && data.length === newsFetchLimit) setLatestNewsOffset(data.length + latestNewsOffset)
  }

  return (
    <>
      <h1>News</h1>

      <Container fluid>
        {newsStories.length > 0 ? (
          newsStories.map(({ title, link, content, createdAt }, i) => (
            <Row key={i} className="m-5 p-5 text-bg-light">
              <h3>{link ? <a href={link}>{title}</a> : title}</h3>

              <Col className="w-75 my-5">{content}</Col>

              <span>Date: {new Date(createdAt).toLocaleString()}</span>
            </Row>
          ))
        ) : (
          <h2>{"Nothing to show... :("}</h2>
        )}
      </Container>

      <StatefulButton
        className="w-50 py-4 mb-5"
        text="More..."
        textUnclickable="No More News Stories"
        textLoading="Loading..."
        textError="Error"
        isLoading={isFetching}
        isError={isError && RTKErrorHTTPStatusCode !== HTTPStatusCode["Not Found"]}
        isUnclickable={(data && data.length < newsFetchLimit) || RTKErrorHTTPStatusCode === HTTPStatusCode["Not Found"]}
        variant="primary"
        variantUnclickable="secondary"
        variantLoading="secondary"
        variantError="secondary"
        onClick={handleClick}
      />
    </>
  )
}
