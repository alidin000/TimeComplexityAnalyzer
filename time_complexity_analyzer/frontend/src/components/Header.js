// Header.jsx

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Header = () => {
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
        </ul>
      </nav>
    </header>
  );
};

export default Header;
