import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import AppBar from './components/AppBar';
import LoginForm from './components/LoginForm';
import RecommendedBooks from './components/RecommendedBooks';
import { useApolloClient, useSubscription } from '@apollo/client';
import { BOOK_ADDED, ALL_BOOKS } from './queries';
import { updateCache } from './cache';

const App = () => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('loggedInUserToken') || '';
    });
    const client = useApolloClient();

    useSubscription(BOOK_ADDED, {
        onData: ({ data }) => {
            const addedBook = data.data.bookAdded;
            window.alert(`${addedBook.title} added to the collection`);
            updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
        },
    });

    return (
        <Router>
            <AppBar token={token} setToken={setToken} />
            <Routes>
                <Route path="/" element={<Authors />} />
            </Routes>
            <Routes>
                <Route path="/books" element={<Books />} />
            </Routes>
            <Routes>
                <Route path="/addBook" element={<NewBook />} />
            </Routes>
            <Routes>
                <Route path="/login" element={<LoginForm setToken={setToken} />} />
            </Routes>
            <Routes>
                <Route path="/recommended" element={<RecommendedBooks />} />
            </Routes>
        </Router>
    );
};

export default App;
