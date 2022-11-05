import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useFetchNewsQuery } from "../redux-stuff/query"
import { dbgLog, NewsStory } from "../../types/api"


/**
 * 
 */
export default function News(){
  // news story fetch limit:
  const [newsFetchLimit] = useState(1)
  const [latestNewsOffset, setLatestNewsOffset] = useState(0)
  
  const [newsStories, setNewsStories] = useState<NewsStory[]>([])
  
  const newsQuery = useFetchNewsQuery({ offset: latestNewsOffset, limit: newsFetchLimit })
  const { data, isFetching } = newsQuery
  
  
  useEffect(() => {
    dbgLog("News.tsx", ["News","useEffect(,[data])"], "newsFetchLimit", newsFetchLimit, "latestNewsOffset", latestNewsOffset, "newsStories", newsStories, "data", data, "newsQuery", newsQuery)
    
    if (data) setNewsStories(newsStories.concat(data))
  }, [data])
  
  
  const handleClick = () => {
    dbgLog("News.tsx", ["News","handleClick"], "newsFetchLimit", newsFetchLimit, "latestNewsOffset", latestNewsOffset, "newsStories", newsStories, "data", data, "newsQuery", newsQuery)

    if (data && data.length > 0) setLatestNewsOffset(newsFetchLimit + latestNewsOffset)
  }


  return (
    <>
      <h1>News</h1>

      <Container fluid>
        {newsStories.length > 0 ? 
          newsStories.map(({title, link, content, createdAt}, i) => 
            <Row key={i} className="m-5 p-5 text-bg-light">
              <h3>
                {link ? <a href={link}>{title}</a> : title}
              </h3>

              <Col className="w-75 my-5">{content}</Col>

              <span>
                Date: {new Date(createdAt).toLocaleString()}
              </span>
            </Row>
          )
          : <>
            <h2>{"Nothing to show... :("}</h2>
          </>
        }
      </Container>
      
      <Button 
        disabled={!(data && data.length > 0)} 
        active={isFetching}
        variant={data && data.length > 0 ? isFetching ? "info" : "primary" : "secondary"} 
        className="w-50 py-4 mb-5"
        onClick={handleClick} 
      >
        {data && data.length > 0 ? "More..." : "No more news"}
      </Button>
    </>
  )
}