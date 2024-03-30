// Header.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header>
      <div className="logo">LOGO</div>
      <nav>
        <ul>
          {currentPath === '/learning' ? (
            <>
              <li>
                <NavLink to="/calculator" activeClassName="active" exact>
                  CALCULATOR
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/learning" activeClassName="active" exact>
                LEARNING
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/about-us" activeClassName="active">
              ABOUT U<span>S</span>
            </NavLink>
          </li>
          {isLoggedIn ? (
            <li>
              <NavLink to="/logout" activeClassName="active">
                Logout
              </NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login" activeClassName="active">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" activeClassName="active">
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      {isLoggedIn && (
        <div className="user-icon">
          <i className="fab fa-react"></i>
        </div>
      )}
    </header>
  );
};

export default Header;
