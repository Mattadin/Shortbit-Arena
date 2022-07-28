import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main id= "heroImage" className="container">
      <div className="enter__container">
        <p>
          <Link className="enter__card" to="/login">
            Enter.
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Home;
