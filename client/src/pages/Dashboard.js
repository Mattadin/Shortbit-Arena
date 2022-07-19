import React from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_USER } from '../utils/queries';

import Auth from '../utils/auth';

const Dashboard = () => {
  const { email: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { email: userParam },
  });

  console.log(data);
  console.log(userParam);

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
        <p>
          <Link className="enter__card" to="/game">
            Enter Game!
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Dashboard;
