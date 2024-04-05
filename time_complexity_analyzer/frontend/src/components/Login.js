// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for accessing navigation functions

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simulated login logic
        console.log('User logged in successfully');

        // Redirect to calculator page after successful login
        handleLogin(); // Call handleLogin function passed from App component
        navigate('/calculator');
    };

    return (
        <div className="wrapper signIn">
            <div className="form">
                <div className="heading">LOGIN</div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">E-Mail</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter your email" 
                            className='input-field' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
