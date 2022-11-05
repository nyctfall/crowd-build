import "vite/modulepreload-polyfill"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { Routes, Route, Navigate } from "react-router-dom"
import "./styles/App.scss"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import Root from "./pages/Root"
import Home from "./pages/Home"
import News from "./pages/News"
import Tests from "./pages/Tests"
import Forum from "./pages/Forum"
import MyList from "./pages/MyList"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Reviews from "./pages/Reviews"
import Database from "./pages/Database"
import NotFound from "./pages/NotFound"
import Benchmarks from "./pages/Benchmarks"
import Profile from "./pages/Profile"
import { useAppSelector } from "./redux-stuff/hooks"
import { dbgLog } from "../types/api"


/**
 * 
 */
function App() {
  // login session state:
  const state = useAppSelector(state => state)
  const { session } = state

  
  dbgLog("App.tsx", "App", "state", state)


  return (
    <>
      <div className="min-vh-100 d-flex flex-column align-items-stretch align-self-stretch align-content-between">
        <NavBar />

        <main className="flex-fill">
          <Routes>
            {session.isLoggedIn ? <>
                <Route path="/" element={<Navigate to="/profile" />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/*" element={<Profile />} />
                <Route path="/signup" element={<Navigate to="/profile" />} />
                <Route path="/signin" element={<Navigate to="/profile" />} />
              </>
              : <>
                <Route path="/" element={<Root />} />
                <Route path="/profile" element={<Navigate to="/signin" />} />
                <Route path="/profile/*" element={<Navigate to="/signin" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
              </>
            }
            
            <Route path="/" element={<Root />} />
            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/database" element={<Database />} />
            <Route path="/benchmarks" element={<Benchmarks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </>
  )
}

export default App
