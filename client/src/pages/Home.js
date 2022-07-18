import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <p>INTRO SCREEN LESS GO BOIS</p>
      <p>
        Success! You may now head <Link to="/login">to login.</Link>
      </p>
    </main>
  );
};

export default Home;
