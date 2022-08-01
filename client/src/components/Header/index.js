import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './header.css';
import Auth from '../../utils/auth';

const Header = () => {
  const location = useLocation();
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header>
      {location.pathname !== '/' && (
      <div className="header__container">
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link className="profile__card" to="/dashboard">
                {Auth.getProfile().data.displayName}'s profile
              </Link>
              <button className="logout__card" onClick={logout}>
                Logout
              </button>
              <Link className="cta__card" to="/docs">
                Docs
              </Link>
            </>
          ) :  (
            <>
              <Link className="cta__card" to="/login">
                Login
              </Link>
              <Link className="cta__card" to="/signup">
                Signup
              </Link>
              <Link className="cta__card" to="/docs">
                Docs
              </Link>
            </>
          )}
        </div>
      </div>
      )}
    </header>
  );
};

export default Header;
