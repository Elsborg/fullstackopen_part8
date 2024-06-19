import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const BirthYear = props => {
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [birthYear, setBirthYear] = useState('');

    const [ editAuthor ] = useMutation(EDIT_AUTHOR , { refetchQueries: [{ query: ALL_AUTHORS }]})

    const submit = async (event)  => {
        event.preventDefault()

        if (birthYear === '') {
            alert('Please enter a birthyear')
            return
        }
        
        editAuthor({ variables: { name: selectedAuthor, setBornTo: parseInt(birthYear) }})
        
        setSelectedAuthor('')
        setBirthYear('')

    }


    return (
        <div>
            <h2>Set birthyear</h2>

            <form onSubmit={submit}>
                <div>
                    <label>name</label>
                    <select value={selectedAuthor} onChange={({ target }) => setSelectedAuthor(target.value)}>
                        {props.authors.map(author => 
                        <option key={author.name} value={author.name}>{author.name}</option>
                        )}
                    </select>
                </div>
                <div>
                  <label>born</label>
                  <input type="number" value={birthYear} onChange={({ target }) => setBirthYear(target.value)} />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    );
};

export default BirthYear;
