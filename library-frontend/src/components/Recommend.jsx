import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ME } from "../queries"

const Recommend = (props) => {
    const result = useQuery(ALL_BOOKS)
    const user = useQuery(ME)

    if (!props.show) {
        return null
    }

    if (result.loading || user.loading) {
        return <div>loading...</div>
    }

    const books = result.data.allBooks

    const filter = user.data.me.favoriteGenre

    const filteredBooks = books.filter(book => book.genres.includes(filter))

    return (
        <div>
            <h2>favorite books</h2>
            <p>books in your favorite genre <strong>{filter}</strong></p>
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
        </div>
    )
 }

 export default Recommend