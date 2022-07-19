import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    fullNname: '',
    displayName: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="container">
      <div className="">
        <div className="container">
          <h4 className="">Sign Up</h4>
          <div className="">
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/login">back to login.</Link>
              </p>
            ) : (
              <form className="form__style" onSubmit={handleFormSubmit}>
                <input
                  className="input__style"
                  placeholder="Your full name"
                  name="fullName"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                <input
                  className="input__style"
                  placeholder="Your display name"
                  name="displayName"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                <input
                  className="input__style"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <input
                  className="input__style"
                  placeholder="Your password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <button
                  className="form__submit"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && <div className="">{error.message}</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
