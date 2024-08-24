import { useNavigate } from 'react-router-dom';

const AppBar = ({ token, setToken }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('loggedInUserToken');
        setToken('');
        navigate('/login');
    };

    return (
        <div>
            <button onClick={() => navigate('/')}>authors</button>
            <button onClick={() => navigate('/books')}>books</button>
            {token && (
                <>
                    <button onClick={() => navigate('/addBook')}>add book</button>
                    <button onClick={() => navigate('/recommended')}>recommended</button>
                </>
            )}
            {!token ? (
                <button onClick={() => navigate('/login')}>login</button>
            ) : (
                <button onClick={logout}>logout</button>
            )}
        </div>
    );
};

export default AppBar;
