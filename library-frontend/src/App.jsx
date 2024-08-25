import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import AppBar from './components/AppBar';
import LoginForm from './components/LoginForm';
import RecommendedBooks from './components/RecommendedBooks';
import { useSubscription } from '@apollo/client';
import { BOOK_ADDED } from './queries';

const App = () => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('loggedInUserToken') || '';
    });

    useSubscription(BOOK_ADDED, {
        onData: ({ data }) => {
            window.alert(`${data.data.bookAdded.title} added to the collection`);
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
