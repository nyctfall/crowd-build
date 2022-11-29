import { Carousel, Container } from "react-bootstrap"
import { Link } from "react-router-dom"


/**
 * 
 */
export default function Home() {
  const imgs = [
    "https://c1.neweggimages.com/ProductImageCompressAll1280/14-932-550-12.jpg",
    "https://c1.neweggimages.com/ProductImageOriginal/19-113-771-S02.jpg",
    "https://c1.neweggimages.com/ProductImageCompressAll1280/19-118-412-V01.jpg",
    "https://c1.neweggimages.com/ProductImageOriginal/14-883-001-02.jpg",
    "https://c1.neweggimages.com/ProductImageCompressAll1280/14-202-417-V01.jpg",
    "https://c1.neweggimages.com/ProductImageOriginal/83-360-311-01.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-132-08.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-255-01.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-241-01.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-310-01.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-250-01.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-307-13.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-240-02.jpg",
    "https://c1.neweggimages.com/ProductImage/83-360-292-07.jpg"
  ]


  return (
    <>
      <h1>Home</h1>

      <Carousel 
        as="section" 
        id="headliner-mini" 
        variant="dark" 
        interval={2500} 
        pause={false}
      >
        {imgs.map((imgsrc, i) => 
          <Carousel.Item key={i} as="article">

            <div 
              style={{ 
                backgroundImage: `url("${imgsrc}")`, 
                backgroundSize: "cover", 
                backgroundPosition: "center", 
                width: "min(75vh, 100vw)", 
                height: "min(75vh, 100vw)" 
              }} 
              className="mx-auto">
            </div>
            
            {/* <img src={imgsrc} alt="user description" className="w-100 h-100" /> */}
            
            <Link to="/database">
              <Carousel.Caption className="text-bg-light opacity-75">
                User Description
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        )}
      </Carousel>

      <Container as="section" id="headliner" fluid>
        {[0,3,6].map((x, i) => 
          <div key={i}>
            {imgs.slice(x,x+3).map((imgsrc, i) =>
              <div 
                key={i} 
                style={{ 
                  backgroundImage: `url("${imgsrc}")`, 
                  backgroundSize: "cover", 
                  backgroundPosition: "center" 
                }}
              >
                <Link to="/database" className="w-100 h-100"></Link>
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  )
}