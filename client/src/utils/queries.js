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

// query: 'query user($email: String!) {\n  user(email: $email) {\n    _id\n    displayName\n    email\n    __typename\n  }\n}';
// variables: {
//   email: 'lernantino@techfriends.dev';
// }

// query: "query user($email: String!) {\n  user(email: $email) {\n    _id\n    displayName\n    email\n    __typename\n  }\n}"

export const QUERY_ME = gql`
  query me {
    me {
      _id
      displayName
      email
    }
  }
`;
