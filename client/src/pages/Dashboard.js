import React from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Dashboard = () => {
  const { email: userParam } = useParams();

  const { data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { email: userParam },
  });

  const user = data?.me || data?.user || {};
  if (Auth.loggedIn() && Auth.getProfile().data.email === userParam) {
    console.log(user);
    return <Navigate to="/dashboard" />;
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
    <div>
      <p>DASHBOARD BAY BAY!!</p>
      <p>
        Success! You may now head <Link to="/game">to the game</Link>
      </p>
      ;
    </div>
  );
};

export default Dashboard;
