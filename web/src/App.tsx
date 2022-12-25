import { lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import "vite/modulepreload-polyfill"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { dbgLog } from "~types/logger"
import { useAppSelector } from "./redux-stuff/hooks"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import Chunker from "./components/Chunker"

// debugging logger:
const log = dbgLog.fileLogger("App.tsx")

// dynamic imports for rollup to make automatic chunks:
const Root = lazy(() => import("./pages/Root"))
const Home = lazy(() => import("./pages/Home"))
const News = lazy(() => import("./pages/News"))
const Tests = lazy(() => import("./pages/Tests"))
const Forum = lazy(() => import("./pages/Forum"))
const MyList = lazy(() => import("./pages/MyList"))
const Signup = lazy(() => import("./pages/Signup"))
const Signin = lazy(() => import("./pages/Signin"))
const Reviews = lazy(() => import("./pages/Reviews"))
const Profile = lazy(() => import("./pages/Profile"))
const Database = lazy(() => import("./pages/Database"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Benchmarks = lazy(() => import("./pages/Benchmarks"))

// mapping of lazy loaded component/chunk to route path.
const chunkRoutes: [React.LazyExoticComponent<() => JSX.Element>, string][] = [
  [Root, "/"],
  [Home, "/home"],
  [News, "/news"],
  [Tests, "/tests"],
  [Forum, "/forum"],
  [MyList, "/my-list"],
  [Signup, "/signup"],
  [Signin, "/signin"],
  [Reviews, "/reviews"],
  [Profile, "/profile"],
  [Database, "/database"],
  [Benchmarks, "/benchmarks"],
  [NotFound, "*"]
]

/**
 * The main App, also has all of the react-router routes.
 */
export default function App() {
  // const Log = log.stackLogger("App")

  // login session state:
  const isLoggedIn = useAppSelector(state => state.session.isLoggedIn)

  return (
    <>
      <div className="min-vh-100 d-flex flex-column align-items-stretch align-self-stretch align-content-between">
        <NavBar />

        <main className="flex-fill">
          <Routes>
            {isLoggedIn ? (
              <>
                {(
                  [
                    [Profile, "/profile"],
                    [Profile, "/profile/*"]
                  ] as typeof chunkRoutes
                ).map(([Element, path], i) => (
                  <Route key={i} path={path} element={<Chunker {...{ Element }} />} />
                ))}
                <Route path="/" element={<Navigate to="/profile" />} />
                <Route path="/signup" element={<Navigate to="/profile" />} />
                <Route path="/signin" element={<Navigate to="/profile" />} />
              </>
            ) : (
              <>
                {chunkRoutes
                  .filter(([Element]) => Element === Signin || Element === Signup || Element === Root)
                  .map(([Element, path], i) => (
                    <Route key={i} path={path} element={<Chunker {...{ Element }} />} />
                  ))}
                <Route path="/profile" element={<Navigate to="/signin" />} />
                <Route path="/profile/*" element={<Navigate to="/signin" />} />
              </>
            )}

            {chunkRoutes
              .filter(
                ([element]) => element !== Signin && element !== Signup && element !== Root && element !== Profile
              )
              .map(([Element, path], i) => (
                <Route key={i} path={path} element={<Chunker {...{ Element }} />} />
              ))}
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  )
}
