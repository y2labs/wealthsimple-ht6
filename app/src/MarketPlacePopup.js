import './MarketPlacePopup.css';

import React, { createContext, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { omitBy, isNil } from 'lodash';
import {
  getPurchaseableItemByIdQuery,
  purchaseItemMutation,
  getCurrentUserPurchasedItemsQuery,
  getCurrentUserPurchaseableItemsQuery
} from 'graphql/items';
import ItemPopup from 'ItemPopup';

const { Provider, Consumer } = createContext({
  accountId: '',
  bankAccountId: '',
  onUpdateAccountId: () => {},
  onUpdateBankAccountId: () => {}
});

class MarketPlacePopup extends Component {
  state = {
    accountId: '',
    bankAccountId: ''
  };

  render() {
    const {
      history,
      match: {
        params: { id }
      }
    } = this.props;

    const contextState = {
      accountId: this.state.accountId,
      bankAccountId: this.state.bankAccountId,
      onUpdateAccountId: this.handleUpdateAccountId,
      onUpdateBankAccountId: this.handleUpdateBankAccountId
    };

    return (
      <Provider value={contextState}>
        <Mutation
          mutation={purchaseItemMutation}
          update={purchaseItemMutationUpdate({ id })}
        >
          {(purchaseItem, { loading: purchasing }) => (
            <Query
              skip={!id}
              query={getPurchaseableItemByIdQuery}
              variables={{ id }}
            >
              {({ loading, data }) => {
                const handleClose = () => {
                  if (history.length === 1) {
                    history.replace('/dashboard');

                    return;
                  }

                  history.goBack();
                };

                const props = {
                  onPurchase: async () => {
                    await purchaseItem({
                      variables: omitBy(
                        {
                          id: data.purchaseableItem.id,
                          accountId: this.state.accountId,
                          bankAccountId: this.state.bankAccountId
                        },
                        isNil
                      )
                    });

                    handleClose();
                  },

                  isLoading: purchasing || loading,
                  onClose: handleClose,
                  purchaseable: true
                };

                if (!loading) {
                  props.item = data.purchaseableItem.item;
                  props.price = data.purchaseableItem.price;
                  props.expiresAt = data.purchaseableItem.expiresAt;
                }

                return <ItemPopup {...props} />;
              }}
            </Query>
          )}
        </Mutation>
      </Provider>
    );
  }

  handleUpdateBankAccountId = id => {
    this.setState({ bankAccountId: id });
  };

  handleUpdateAccountId = id => {
    this.setState({ accountId: id });
  };

  handlePurchase = () => {
    this.props.onPurchase({
      accountId: this.state.accountId,
      bankAccountId: this.state.bankAccountId
    });
  };
}

const purchaseItemMutationUpdate = ({ id }) => (
  cache,
  { data: { purchaseItem } }
) => {
  // If we had an error or did not succeed, we can't update the state.
  if (purchaseItem.error || !purchaseItem.success) {
    return;
  }

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

export default withRouter(MarketPlacePopup);
export { Consumer as AccountPickerConsumer };
