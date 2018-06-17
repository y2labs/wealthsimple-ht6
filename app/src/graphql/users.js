import gql from 'graphql-tag';
import { petInfoFragment } from './pets';

export const getCurrentUserQuery = gql`
  query getCurrentUser {
    viewer {
      me {
        name
        email
        phoneNumber
        id
        token
        lifetimeDollarsManagedEarned
      }
    }
  }
`;

export const getCurrentUserPetQuery = gql`
  query getCurrentUserPet {
    viewer {
      me {
        id
        pet {
          ...petInfoFragment
        }
      }
    }
  }

  ${petInfoFragment}
`;
