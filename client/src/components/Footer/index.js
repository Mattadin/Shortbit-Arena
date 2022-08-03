import React from 'react';
import './footer.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer>
      {location.pathname !== '/' && (
      <div className="footer__container">
          <button className="footer__button" onClick={() => navigate(-1)}>
            &larr; Go Back
          </button>
      </div>
      )}
    </footer>
  );
};

export default Footer;
