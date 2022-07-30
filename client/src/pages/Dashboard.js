import React, { useContext } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_USER } from '../utils/queries';
import PENGUIN from '../img/penguin.png';
import POLARBEAR from '../img/polar-bear.png';
import SEAL from '../img/seal.png'

import { ChoiceContext } from '../utils/Context';

import Auth from '../utils/auth';

const Dashboard = () => {
  const { email: userParam } = useParams();

  const { userChoice, setUserChoice } = useContext(ChoiceContext);

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { email: userParam },
  });

  const selectChester= async (event) => {
    event.preventDefault();
    setUserChoice("penguin");
    console.log(userChoice);
  }

  const selectPercival= async (event) => {
    event.preventDefault();
    setUserChoice("polarBear");
    console.log(userChoice);
  }

  const selectSylvester= async (event) => {
    event.preventDefault();
    setUserChoice("seal");
    console.log(userChoice);
  }

  console.log(data);
  console.log(userChoice);

  const user = data?.me || data?.user || {};
  if (Auth.loggedIn() && Auth.getProfile().data.email === userParam) {
    return <Navigate to="/dashboard" />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user?.email) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <main className="container">
      <div className="enter__game">
      </div>
      <div className= "enter__game">
        <h1>SELECT YOUR ALLEGIANCE</h1>
        <div className="choice__container">
          <button className="choice__button" type="submit" onClick={selectChester}>
          <Link to="/game">
          <img className="dash__img" src={PENGUIN} alt="Cutest penguin you've ever seen"></img>
            Penguin Clan
          </Link>
          </button>
      
          <button className="choice__button" type="submit" onClick={selectPercival}>
          <Link to="/game">
          <img className="dash__img" src={POLARBEAR} alt="Cutest polar bear you've ever seen"></img>
            Polar bear Tribe
          </Link>
          </button>

          <button className="choice__button" type="submit" onClick={selectSylvester}>
          <Link to="/game">
          <img className="dash__img" src={SEAL} alt="Cutest seal you've ever seen"></img>
            Seal Society
          </Link>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
