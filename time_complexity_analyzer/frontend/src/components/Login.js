import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AxiosInstance from './Axios';

const Login = ({ handleLogin }) => { // receive handleLogin function from props
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for accessing navigation functions

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await AxiosInstance.post('/login/', {
                username,
                password,
            });

            if (response.status === 200) { // assuming server responds with a success flag
                handleLogin(); // Call handleLogin function passed from App component
                navigate('/');
            } else {
                console.error('Login failed');
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to login. Please try again.');
        }
    };

    return (
        <div className="wrapper signIn">
            <div className="form">
                <div className="heading">LOGIN</div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Enter your username" 
                            className='input-field' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Enter your password" 
                            className='input-field' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
                {/* Link to sign up */}
                <p>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
