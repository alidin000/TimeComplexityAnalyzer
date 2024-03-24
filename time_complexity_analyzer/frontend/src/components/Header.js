import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header>
      <div className="logo">
        LOGO
      </div>
      <nav>
        <ul>
          {currentPath === '/learning' ? (
            <>
              <li>
                <NavLink to="/calculator" activeclassname="active" exact="true">
                  CALCULATOR
                </NavLink>
              </li>
              <li>
                <NavLink to="/algorithms" activeclassname="active">
                  ALGORITHMS
                </NavLink>
              </li>
              <li>
                <NavLink to="/quizzes" activeclassname="active">
                  QUIZZES
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/learning" activeclassname="active" exact="true">
                LEARNING
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/about-us" activeclassname="active">
              ABOUT U<span>S</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
