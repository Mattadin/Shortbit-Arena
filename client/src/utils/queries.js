import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($email: String!) {
    user(email: $email) {
      _id
      displayName
      email
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      displayName
      email
    }
  }
`;
