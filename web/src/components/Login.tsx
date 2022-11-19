import { useEffect, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/dist/query"
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePostLoginQuery } from "../redux-stuff/query"
import { sessionLogin, sessionSetToken } from "../redux-stuff/reducers/session"
import { dbgLog } from "../../types/api"


/** 
 * Login using JWT header session.
 */
export default function Login({ createUser }: { createUser?: boolean }){
  const dispatch = useAppDispatch()

  const session = useAppSelector(state => state.session)


  // input typing state:
  const [typed, setTyped] = useState(false)
  const [typedPsswd, setTypedPsswd] = useState(false)
  const [typedUsername, setTypedUsername] = useState(false)

  // username and password to send to server:
  const [usernamePost, setUsername] = useState("")
  const [psswdPost, setPsswd] = useState("")

  // username and password state:
  const [usernameInput, setUsernameInput] = useState("")
  const [psswdInput, setPsswdInput] = useState("")


  // send credentials to server to auth:
  const loginQuery = usePostLoginQuery(usernamePost && psswdPost ? { username: usernamePost, password: psswdPost, createUser } : skipToken)

  const { data, isSuccess, isUninitialized, isFetching } = loginQuery
  
  
  // set creds in store cache for auth:
  useEffect(() => {
    dbgLog("Login.tsx", ["Login","useEffect(,[data])"], "loginQuery", loginQuery, "session", session)
    
    if (data && data.success && data.user && data.token){
      dispatch(sessionLogin(data.user))
      dispatch(sessionSetToken(data.token))
    }
  }, [data])
  
  
  // track help message state:
  useEffect(() => {
    dbgLog("Login.tsx", ["Login","useEffect(,[usernameInput, psswdInput, usernamePost, psswdPost])"], "typed", typed, "typedPsswd", typedPsswd, "typedUsername", typedUsername, "usernameInput", usernameInput, "psswdInput", psswdInput, "usernamePost", usernamePost, "psswdPost", psswdPost)
    
    // no difference in typed input field and creds being sent:
    if (usernameInput === usernamePost && psswdInput === psswdPost) setTyped(false)
    // typed input field and new creds have not been sent:
    else setTyped(true)
    
    // no difference in typed input field and creds being sent:
    if (usernameInput === usernamePost) setTypedUsername(false)
    // typed input field and new creds have not been sent:
    else setTypedUsername(true)
    
    // no difference in typed input field and creds being sent:
    if (psswdInput === psswdPost) setTypedPsswd(false)
    // typed input field and new creds have not been sent:
    else setTypedPsswd(true)
  }, [usernameInput, psswdInput, usernamePost, psswdPost])


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    dbgLog("Login.tsx", "Login() > handleSubmit()", "usernameInput", usernameInput, "psswdInput", psswdInput, "usernamePost", usernamePost, "psswdPost", psswdPost)
    
    e.preventDefault()
    
    // set creds to current input field values:
    setPsswd(psswdInput)
    setUsername(usernameInput)
  }
  

  const usernameIsValid = !typedUsername && data && data.incorrect && !(createUser ? data.nonexistant : data.preexisting)
  const usernameIsInvalid = !isFetching && !typed && Boolean(data && (data.preexisting || data.nonexistant))
  const psswdIsInvalid = !isFetching && data && !typed ? Boolean(data.incorrect) : undefined
  
  dbgLog("Login.tsx", "Login", "usernameIsValid", usernameIsValid, "usernameIsInvalid", usernameIsInvalid, "psswdIsInvalid", psswdIsInvalid, "usernameInput", usernameInput, "psswdInput", psswdInput, "usernamePost", usernamePost, "psswdPost", psswdPost, "loginQuery", loginQuery, "session", session)
  

  return (
    <>
      <Form 
        className="text-start w-75 mx-auto pt-5" 
        style={{maxWidth: "500px"}}
        onSubmit={handleSubmit} 
        validated={data ? data.success : undefined}
      >
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Username</Form.Label>
          
          <Col>
            <Form.Control 
              required  
              type="text" 
              placeholder="Username" 
              onChange={e => setUsernameInput(e.target.value)} 
              isValid={usernameIsValid} 
              isInvalid={usernameIsInvalid}
            />
            
            <Form.Control.Feedback type="valid" placeholder="Username">
              {usernamePost ? `Hi ${usernamePost}!` : ""}
            </Form.Control.Feedback>

            <Form.Control.Feedback type="invalid" placeholder="Username">
              {data ?
                createUser && data.preexisting?.includes("username") ?
                  "Choose a different username."
                  : !createUser && data.nonexistant ?
                    "User does not exist."
                    : "Error"
                : "Username"
              }
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Password</Form.Label>
          
          <Col>
            <Form.Control 
              required 
              type="password" 
              placeholder="Password" 
              onChange={e => setPsswdInput(e.target.value)} 
              isInvalid={psswdIsInvalid}
            />

            <Form.Control.Feedback type="invalid" placeholder="Password">
              {data ?
                !createUser && data.incorrect?.includes("password") ?
                  "Incorrect password."
                  : "Error"
                : "Password"
              }
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        
        <Row>
          <Button variant={isFetching ? "outline-primary" : ((!isSuccess && !isUninitialized) || (data && !data.success)) && !typed ? "danger" : "primary"} type="submit" className="col-sm-2 ms-auto me-3">
            {isFetching ? 
                <Spinner animation="border"/>
              : "Send"
            }
          </Button>
        </Row>
      </Form>
    </>
  )
}