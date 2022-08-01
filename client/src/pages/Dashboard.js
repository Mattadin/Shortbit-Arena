import React, { useContext } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_USER } from '../utils/queries';
import PENGUIN from '../img/penguin1k.png';
import POLARBEAR from '../img/bear1k.png';
import SEAL from '../img/seal1k.png'
import MOVEMENT from '../img/instructionsMovement.PNG';
import ATTACK from '../img/instructionsAttack.PNG';
import LEVEL from '../img/instructionsLevel.PNG';

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
        <h1>HOW TO PLAY:</h1>

        <h2 className="instruction__title">
          To move, simply use the WASD keys with your left hand.
          They control cardinal directions as shown below:
        </h2>
        <div className="flex__box">
          <img className="instruction__image" src={MOVEMENT} alt="Adorable penguin demonstrating movement." />
        </div>

        <h2 className="instruction__title">
          To throw your snowballs, simply click for controlled bursts
          or hold down the left click button for a steady stream.
        </h2>
        <div className="flex__box">
          <img className="instruction__image" src={ATTACK} alt="Adorable polar bear demonstrating attack commands" />
        </div>

        <h2 className="instruction__title">
          Each enemy you defeat will increase your level, demonstrating your
          experience in snowball fights! Climb to the top and become a veteran
          of the snowball revolution!
        </h2>
        <div className="flex__box">
          <img className="instruction__image" src={LEVEL} alt="Adorable seal demonstrating where level is tracked" />
        </div>
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
