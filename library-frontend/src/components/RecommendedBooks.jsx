import { useQuery } from '@apollo/client';
import { ME, ALL_BOOKS } from '../queries';
import BookTable from './BookTable';

const RecommendedBooks = () => {
    const { data: userData, loading: userLoading } = useQuery(ME);
    const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
        skip: userLoading || !userData?.me?.favoriteGenre,
        variables: { genre: userData?.me?.favoriteGenre },
    });

    if (userLoading || booksLoading) {
        return <div>Loading...</div>;
    }
    if (!booksData || booksData.allBooks.length === 0) {
        return <div>No recommended books</div>;
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>
                books in your favorite genre <b>patterns</b>
            </p>
            <BookTable books={booksData.allBooks} />
        </div>
    );
};

export default RecommendedBooks;
