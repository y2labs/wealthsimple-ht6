import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import accounting from 'accounting';

const Effect = ({ type, value, name, description }) => (
  <li>
    <div className="marketplace-modal--effect">
      <p className="marketplace-modal--effect-name">{name}</p>
      <p className="marketplace-modal--effect-description number-title">
        {description}
      </p>
    </div>
  </li>
);

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
          <button className="marketplace-modal--dismiss-button">
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
                    <Effect key={`${index}`} {...effect} />
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
