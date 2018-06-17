import gql from 'graphql-tag';

export const petInfoFragment = gql`
  fragment petInfoFragment on Pet {
    id
    name
    content
    hunger
    energy
    size
    color
  }
`;

export const createPetMutation = gql`
  mutation createPet($name: String!, $color: String!) {
    createPet(name: $name, color: $color) {
      error
      success
      pet {
        ...petInfoFragment
      }
    }
  }

  ${petInfoFragment}
`;
