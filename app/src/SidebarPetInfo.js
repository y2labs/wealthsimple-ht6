import React from 'react';
import { get } from 'lodash';
import { Query, Mutation } from 'react-apollo';
import { getCurrentUserPetQuery } from 'graphql/users';
import { createPetMutation } from 'graphql/pets';
import { MAX_ATTRIBUTE_VALUE } from './constants';

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
                <p className="h4-sans-normal">{pet.size}</p>

                <div className="sidebar-pet-info--attr-section">
                  <div className="sidebar-pet-info-stat-container">
                    <p className="sidebar-pet-info--attr-title">Hunger</p>
                    <div className="sidebar-pet-info--progress-bar-root">
                      <div
                        className="inner"
                        style={{
                          width: `${(pet.hunger / MAX_ATTRIBUTE_VALUE) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="sidebar-pet-info-stat-container">
                    <p className="sidebar-pet-info--attr-title">Happiness</p>
                    <div className="sidebar-pet-info--progress-bar-root">
                      <div
                        className="inner"
                        style={{
                          width: `${(pet.content / MAX_ATTRIBUTE_VALUE) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="sidebar-pet-info-stat-container">
                    <p className="sidebar-pet-info--attr-title">Energy</p>
                    <div className="sidebar-pet-info--progress-bar-root">
                      <div
                        className="inner"
                        style={{
                          width: `${(pet.energy / MAX_ATTRIBUTE_VALUE) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      );
    }}
  </Query>
);

export default SidebarPetInfo;
