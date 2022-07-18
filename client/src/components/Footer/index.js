import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <footer className="">
      <div className="">
        {location.pathname !== '/' && (
          <button className="" onClick={() => navigate(-1)}>
            &larr; Go Back
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
