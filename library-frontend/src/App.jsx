import { useState } from "react"
import { useQuery, useApolloClient } from "@apollo/client"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"

import { ALL_AUTHORS, ALL_BOOKS } from "./queries"
import Recommend from "./components/Recommend"

const App = () => {
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const client = useApolloClient()


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("login")}>login</button>
      </div>
        <Authors authors={authors} show={page === "authors"} />

        <Books show={page === "books"} />

        <LoginForm setToken={setToken} setError={notify} show={page == "login"} setPage={setPage}/>
      </>
    )
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors authors={authors} show={page === "authors"} token={token}/>

      <Books show={page === "books"} />

      <NewBook setError={notify} show={page === "add"} />
      <Recommend show={page === "recommend"} />
    </div>
  )
}

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return <div style={{ color: "red" }}>{errorMessage}</div>
}

export default App;
