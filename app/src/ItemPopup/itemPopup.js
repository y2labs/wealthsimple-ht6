import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import accounting from 'accounting';
import { Query } from 'react-apollo';
import { getCurrentUserPetQuery } from 'graphql/users';
import { getIsEarning } from './utils';

const Effect = ({ type, value, name, description, warnOnConstraints }) => {
  return (
    <Query query={getCurrentUserPetQuery} fetchPolicy="cache-only">
      {({ data }) => (
        <li>
          <div className="marketplace-modal--effect">
            <p className="marketplace-modal--effect-name">{name}</p>
            <p className="marketplace-modal--effect-description number-title">
              {description}
            </p>

            {warnOnConstraints &&
              !getIsEarning({ type, value, pet: data.viewer.me.pet }) && (
                <div className="marketplace-modal--effect-not-earning-warning-container">
                  <p className="text-yellow">
                    Warning! You aren't earning rewards on this effect.
                  </p>

                  <p className="number-title">
                    Increase your pets energy, happiness or hunger levels to
                    start earning.
                  </p>
                </div>
              )}
          </div>
        </li>
      )}
    </Query>
  );
};

export default class ItemPopup extends Component {
  modalRef = createRef();

  static defaultProps = {
    onUse() {},
    onClose() {},
    onPurchase() {}
  };

  static propTypes = {
    onUse: PropTypes.func,
    onClose: PropTypes.func,
    onPurchase: PropTypes.func
  };

  render() {
    const { purchaseable, isLoading, item, useable, disabled } = this.props;

    return (
      <div onClick={this.handleClick} className="marketplace-modal--overlay">
        <div ref={this.modalRef} className="marketplace-modal--root">
          <button
            onClick={this.props.onClose}
            className="marketplace-modal--dismiss-button"
          >
            <span>✕</span>
          </button>

          <div>
            {item && (
              <Fragment>
                <p className="number-value size-md uppercase-sans-bold base-margin-bottom">
                  {item.name}
                </p>
                <p className="number-title">{item.description}</p>

                <p className="p2 base-margin-top base-margin-bottom">
                  Item effects
                </p>

                <ul className="marketplace-modal--list">
                  {item.effects.map((effect, index) => (
                    <Effect
                      key={`${index}`}
                      {...effect}
                      warnOnConstraints={useable && !item.singleUse}
                    />
                  ))}
                </ul>
              </Fragment>
            )}

            {useable &&
              !disabled && (
                <button
                  onClick={this.props.onUse}
                  className="button primary-action marketplace-modal--purchase-button size-md"
                >
                  {isLoading ? (
                    <svg className="ws-icon-three-dot-spinner color-white" />
                  ) : (
                    `Use ${item.name}`
                  )}
                </button>
              )}

            {purchaseable &&
              !disabled && (
                <button
                  onClick={this.props.onPurchase}
                  className="button primary-action marketplace-modal--purchase-button size-md"
                >
                  {isLoading ? (
                    <svg className="ws-icon-three-dot-spinner color-white" />
                  ) : (
                    `Purchase for $${accounting.formatNumber(
                      this.props.price / 100,
                      '2'
                    )}`
                  )}
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }

  handleClick = e => {
    e.preventDefault();

    if (!this.modalRef.current.contains(e.target)) {
      this.props.onClose();
    }
  };
}
