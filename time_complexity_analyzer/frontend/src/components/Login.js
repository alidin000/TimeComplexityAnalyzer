// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for accessing navigation functions

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (response.ok) {
                const user = await response.json();
                handleLogin(user); // Call handleLogin function passed from App component
                navigate('/calculator');
            } else {
                console.error('Login failed');
                // Handle login failure (e.g., display error message to user)
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle other errors (e.g., network error)
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
                {/* Link to sign up */}
                <p>
                    Don't have an account ? <Link to="/signup"> Sign Up </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
