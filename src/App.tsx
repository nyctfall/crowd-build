import "vite/modulepreload-polyfill"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { Routes, Route } from "react-router-dom"
import "./styles/App.scss"
import NavBar from "./components/NavBar"
import Root from "./pages/Root"
import Home from "./pages/Home"
import Database from "./pages/Database"
import News from "./pages/News"
import Forum from "./pages/Forum"
import MyList from "./pages/MyList"
import NotFound from "./pages/NotFound"


function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/home" element={<Home />} />
        <Route path="/database" element={<Database />} />
        <Route path="/news" element={<News />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
