import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../queries';
import { useMutation } from '@apollo/client';

const LoginForm = ({ setToken }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            console.log(error.graphQLErrors[0].message);
        },
    });

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        login({
            variables: { username: formData.username, password: formData.password },
        });
    };

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value;
            setToken(token);
            localStorage.setItem('loggedInUserToken', token);
            navigate('/');
        }
    }, [navigate, result.data, setToken]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    name <input type="text" name="username" onChange={handleChange} />
                </div>
                <div>
                    password <input type="password" name="password" onChange={handleChange} />
                </div>
                <button>login</button>
            </form>
        </div>
    );
};

export default LoginForm;
