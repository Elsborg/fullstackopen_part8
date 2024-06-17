import React, { useState } from 'react'
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState(null)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div> books loading...</div>
  }

  //Filter logic
  const books = result.data.allBooks

  const genres = []

  books.forEach(book => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
  })

  const filteredBooks = filter ? books.filter(book => book.genres.includes(filter)) : books


  return (
    <div>
      <h2>books</h2>
      {filter ? (<p>in genre <strong>{filter}</strong></p>) : (<p>in <strong>all genres</strong></p>)}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(genre => <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>)}
      </div>
      <button onClick={() => setFilter(null)}>reset filter</button>
    </div>
  )
}

export default Books
