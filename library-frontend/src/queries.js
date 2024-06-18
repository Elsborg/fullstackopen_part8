import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBooks {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const FIND_BOOKS_BY_GENRE = gql`
  query FindBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const FIND_BOOKS_BY_AUTHOR = gql`
  query FindBooksByAuthor($author: String!) {
    allBooks(author: $author) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`