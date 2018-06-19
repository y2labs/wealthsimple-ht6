import './MarketPlacePopup.css';

import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import accounting from 'accounting';
import {
  getPurchaseableItemByIdQuery,
  purchaseItemMutation,
  getCurrentUserPurchasedItemsQuery,
  getCurrentUserPurchaseableItemsQuery
} from 'graphql/items';

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

class MarketPlacePopup extends Component {
  modalRef = createRef();

  static defaultProps = {
    onClose() {},
    onPurchase() {}
  };

  static propTypes = {
    onClose: PropTypes.func,
    onPurchase: PropTypes.func
  };

  render() {
    const { purchaseable, isLoading, item } = this.props;

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

                <ul>
                  {item.effects.map((effect, index) => (
                    <Effect key={`${index}`} {...effect} />
                  ))}
                </ul>
              </Fragment>
            )}

            {purchaseable && (
              <button
                onClick={this.props.onPurchase}
                className="button primary-action marketplace-modal--purchase-button size-md"
              >
                {isLoading ? (
                  <svg className="ws-icon-three-dot-spinner color-white" />
                ) : (
                  `Purchase for $${accounting.formatNumber(
                    this.props.price / 100
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

const purchaseItemMutationUpdate = ({ id }) => (
  cache,
  { data: { purchaseItem } }
) => {
  const { purchasedItems } = cache.readQuery({
    query: getCurrentUserPurchasedItemsQuery
  });

  const { purchaseableItems } = cache.readQuery({
    query: getCurrentUserPurchaseableItemsQuery
  });

  cache.writeQuery({
    query: getCurrentUserPurchasedItemsQuery,
    data: { purchasedItems: purchasedItems.concat(purchaseItem.purchasedItem) }
  });

  cache.writeQuery({
    query: getCurrentUserPurchaseableItemsQuery,
    data: {
      purchaseableItems: purchaseableItems.filter(
        ({ id: previouslyPurchaseableItemId }) =>
          previouslyPurchaseableItemId !== id
      )
    }
  });
};

const WithQueryMarketPlacePopup = ({
  history,
  match: {
    params: { id }
  }
}) => (
  <Mutation
    mutation={purchaseItemMutation}
    update={purchaseItemMutationUpdate({ id })}
  >
    {(purchaseItem, { loading: purchasing }) => (
      <Query skip={!id} query={getPurchaseableItemByIdQuery} variables={{ id }}>
        {({ loading, data }) => {
          const props = {
            onPurchase: async () => {
              await purchaseItem({
                variables: {
                  id: data.purchaseableItem.id
                }
              });

              history.goBack();
            },

            onClose: () => {
              if (history.length === 1) {
                history.replace('/dashboard');

                return;
              }

              history.goBack();
            },
            isLoading: purchasing || loading,
            purchaseable: true
          };

          if (!loading) {
            props.item = data.purchaseableItem.item;
            props.price = data.purchaseableItem.price;
            props.expiresAt = data.purchaseableItem.expiresAt;
          }

          return <MarketPlacePopup {...props} />;
        }}
      </Query>
    )}
  </Mutation>
);

export default withRouter(WithQueryMarketPlacePopup);
