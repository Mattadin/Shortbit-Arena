import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        displayName
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $fullName: String!
    $displayName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      fullName: $fullName
      displayName: $displayName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
        email
      }
    }
  }
`;
