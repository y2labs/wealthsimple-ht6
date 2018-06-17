import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const getCurrentUserWithTokenQuery = gql`
  query getCurrentUserWithToken {
    viewer {
      me {
        name
        email
        phoneNumber
        id
        token
      }
    }
  }
`;

export const getCurrentUserQuery = gql`
  query getCurrentUser {
    viewer {
      me {
        name
        email
        phoneNumber
        id
        token
      }
    }
  }
`;
