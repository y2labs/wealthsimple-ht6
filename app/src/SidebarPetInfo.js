import React from 'react';
import { get } from 'lodash';
import accounting from 'accounting';
import { Query, Mutation } from 'react-apollo';
import { getCurrentUserPetQuery } from 'graphql/users';
import { createPetMutation } from 'graphql/pets';
import SidebarPetInfoAttribute from 'SidebarPetInfoAttribute';

const SetupPet = () => {
  const handleSubmit = mutation => e => {
    e.preventDefault();

    const { name, color } = e.target.elements;

    mutation({
      variables: {
        name: name.value,
        color: color.value
      }
    });
  };

  return (
    <Mutation mutation={createPetMutation}>
      {(createPet, { data }) => {
        return (
          <div className="setup-pet--container">
            <p className="setup-pet--title">Create your pet!</p>

            <form onSubmit={handleSubmit(createPet)}>
              <input
                className="form-input-text size-sm"
                placeholder="Pet name"
                type="text"
                name="name"
              />

              <input
                className="form-input-text size-sm"
                placeholder="Color (#000)"
                type="text"
                name="color"
              />

              <button className="button primary-action">Create!</button>
            </form>
          </div>
        );
      }}
    </Mutation>
  );
};

const SidebarPetInfo = () => (
  <Query query={getCurrentUserPetQuery} pollInterval={15000}>
    {({ data, loading }) => {
      const pet = get(data, 'viewer.me.pet');

      return (
        <div>
          {loading && <p>Loading</p>}

          {!pet && !loading && <SetupPet />}

          {pet &&
            !loading && (
              <div>
                <p className="sidebar-pet-info--attr-title">Name</p>
                <p className="h4-sans-normal">{pet.name}</p>

                <p className="sidebar-pet-info--attr-title">Color</p>
                <div className="sidebar-pet-info--color-attr-container">
                  <p className="h4-sans-normal">{pet.color}</p>
                  <div
                    className="sidebar-pet-info--color-preview"
                    style={{ backgroundColor: pet.color }}
                  />
                </div>

                <p className="sidebar-pet-info--attr-title">Size</p>
                <p className="h4-sans-normal">
                  {accounting.formatNumber(pet.size, 2)}
                </p>

                <div className="sidebar-pet-info--attr-section">
                  <SidebarPetInfoAttribute
                    label="Hunger"
                    attribute={pet.hunger}
                  />

                  <SidebarPetInfoAttribute
                    label="Happiness"
                    attribute={pet.content}
                  />

                  <SidebarPetInfoAttribute
                    label="Energy"
                    attribute={pet.energy}
                  />
                </div>
              </div>
            )}
        </div>
      );
    }}
  </Query>
);

export default SidebarPetInfo;
