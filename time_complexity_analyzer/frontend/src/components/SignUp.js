import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosInstance from './Axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AxiosInstance.post('/users/', {
        username: name, 
        email: email,
        password: password
      });

      console.log('User signed up successfully:', response.data);

    } catch (error) {
      // Handle error
      console.error('Error signing up:', error);
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="wrapper signIn">
      <div className="form">
        <div>
          <h3>Create an account</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input className='input-field' type="text" id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input className='input-field' type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              className='input-field'
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="submit-btn">Submit</button>
          </div>
          <div className="flex justify-center">
            <span>or</span>
          </div>
        </form>
        <p>
          Have an account ? <Link to="/login"> Login </Link>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
