import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries';
import FilterBooks from './FilterBooks';
import BookTable from './BookTable';

const Books = () => {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const { data: allBooksData, loading: allBooksLoading } = useQuery(ALL_BOOKS);
    const { data: booksDataByGenre, loading: booksByGenreLoading } = useQuery(BOOKS_BY_GENRE, {
        variables: { genre: selectedGenre },
    });

    const uniqueGenres = useMemo(() => {
        if (allBooksData) {
            console.log(allBooksData);
            const allGenres = allBooksData.allBooks.flatMap((book) => book.genres);
            const uniqueGenres = allGenres.filter((genre, index) => allGenres.indexOf(genre) === index);
            return uniqueGenres;
        }
        return [];
    }, [allBooksData]);

    if (allBooksLoading || booksByGenreLoading) {
        return <div>Loading...</div>;
    }

    const allBooks = selectedGenre ? booksDataByGenre.allBooks : allBooksData.allBooks;

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
    };

    const handleNoFilterClick = () => {
        setSelectedGenre(null);
    };

    return (
        <div>
            <h2>books</h2>
            <p>
                in genre <b>{selectedGenre || 'all'}</b>
            </p>
            <BookTable books={allBooks} />
            <FilterBooks
                uniqueGenres={uniqueGenres}
                handleGenreClick={handleGenreClick}
                handleNoFilterClick={handleNoFilterClick}
            />
        </div>
    );
};

export default Books;
