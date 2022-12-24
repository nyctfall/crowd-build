import { useState } from "react"
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import { HTTPStatusCode } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useLazyPostLoginQuery } from "../redux-stuff/query"
import { sessionLogin } from "../redux-stuff/reducers/session"

// debugging logger:
const log = dbgLog.fileLogger("Login.tsx")

/**
 * Login using JWT header session.
 */
export default function Login({ createUser, onSubmit }: { createUser?: boolean; onSubmit?: Function }) {
  const Log = log.stackLogger("Login")

  const dispatch = useAppDispatch()

  const session = useAppSelector(state => state.session)

  // username and password to send to server:
  const [usernamePost, setUsername] = useState("")
  const [psswdPost, setPsswd] = useState("")

  // username and password state:
  const [usernameInput, setUsernameInput] = useState("")
  const [psswdInput, setPsswdInput] = useState("")

  // input typing state for help message:
  const typedUsername = usernameInput !== usernamePost
  const typedPsswd = psswdInput !== psswdPost
  const typed = typedUsername || typedPsswd

  // send credentials to server to auth:
  const [trigger, loginQuery] = useLazyPostLoginQuery()
  const { isSuccess, isUninitialized, isFetching, isError, error } = loginQuery

  // const RTKErrorData = error && "data" in error ? (error.data as typeof data) : undefined

  const RTKErrorHTTPStatusCode =
    error && "status" in error && typeof error.status === "number" ? error.status : undefined

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const log = Log.stackLoggerInc("handleSubmit()")

    // prettier-ignore
    log(
      "usernameInput", usernameInput,
      "psswdInput", psswdInput,
      "usernamePost", usernamePost,
      "psswdPost", psswdPost,
      "error", error
    )

    e.preventDefault()

    // set creds to current input field values:
    setPsswd(psswdInput)
    setUsername(usernameInput)

    // send request:
    if (usernamePost && psswdPost) {
      const queryRes = trigger({
        username: usernameInput,
        password: psswdInput,
        createUser
      })

      log("queryRes", queryRes)
      ;(async () => {
        try {
          const data = await queryRes.unwrap()

          log("data", data)

          // set creds in store cache for auth:
          dispatch(
            sessionLogin({
              user: data.user,
              token: data.token
            })
          )
        } catch (error) {
          log.error("query error", error)
        }
      })()
    }

    // call parent handler:
    onSubmit?.(e)
  }

  const usernameIsValid = isSuccess || !typedUsername || RTKErrorHTTPStatusCode === HTTPStatusCode["Unauthorized"]
  const usernameIsInvalid = isError && !typed && RTKErrorHTTPStatusCode === HTTPStatusCode["Not Found"]
  const psswdIsInvalid = isError && !typed ? RTKErrorHTTPStatusCode === HTTPStatusCode["Unauthorized"] : undefined

  return (
    <Form
      className="text-start w-75 mx-auto pt-5"
      style={{ maxWidth: "500px" }}
      onSubmit={handleSubmit}
      validated={!isUninitialized ? isSuccess : undefined}
    >
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Username
        </Form.Label>

        <Col>
          <Form.Control
            required
            type="text"
            placeholder="Username"
            onChange={e => setUsernameInput(e.target.value)}
            isValid={usernameIsValid}
            isInvalid={usernameIsInvalid}
          />

          {usernamePost ? (
            <Form.Control.Feedback type="valid" placeholder="Username">
              Hi {usernamePost}!
            </Form.Control.Feedback>
          ) : undefined}

          <Form.Control.Feedback type="invalid" placeholder="Username">
            {RTKErrorHTTPStatusCode === HTTPStatusCode["Conflict"]
              ? "Choose a different username."
              : RTKErrorHTTPStatusCode === HTTPStatusCode["Not Found"]
              ? "User does not exist."
              : "Username"}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Password
        </Form.Label>

        <Col>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            onChange={e => setPsswdInput(e.target.value)}
            isInvalid={psswdIsInvalid}
          />

          <Form.Control.Feedback type="invalid" placeholder="Password">
            {RTKErrorHTTPStatusCode === HTTPStatusCode["Unauthorized"] ? "Incorrect password." : "Password"}
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Row>
        {/** @todo convert to stateful button */}
        <Button
          variant={isFetching ? "outline-primary" : isError && !typed ? "danger" : "primary"}
          active={isFetching}
          type="submit"
          className="col-sm-2 ms-auto me-3"
        >
          {isFetching ? <Spinner animation="border" /> : "Send"}
        </Button>
      </Row>
    </Form>
  )
}
