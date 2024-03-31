import React from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="wrapper signIn">
      <div className="form">
        <div className="">
          <h3>Create an account</h3></div>
        <form className=''>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" className='w-20rem h-1rem'/>
          </div>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email" placeholder="Enter your email" className='w-20rem h-1rem'/>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className='w-20rem h-1rem'
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-center"> 
            <button type="submit" className='w-8rem ml-1'>Submit</button>
          </div>
          <div className="flex justify-center"> 
          <span >
            or
          </span>         
          </div>
        </form>
        <p>
          Have an account ? <Link to="/login"> Login </Link>
        </p>
      </div>
    </div>
  );
}