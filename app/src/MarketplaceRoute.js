import React from 'react';
import AuthenticatedRoute from 'AuthenticatedRoute';
import { Query } from 'react-apollo';
import { getPurchaseableItemByIdQuery } from 'graphql/items';
import Header from 'Header';

const MarketPlacePage = ({ isLoading, purchaseableItem }) => (
  <div>
    <Header />
  </div>
);

const MarketPlaceRoute = ({ match }) => {
  const { id } = match.params;

  return (
    <AuthenticatedRoute>
      <Query query={getPurchaseableItemByIdQuery} variables={{ id }} skip={!id}>
        {({ loading, data }) => {
          return (
            <MarketPlacePage
              isLoading={loading}
              purchaseableItem={data.purchaseableItem}
            />
          );
        }}
      </Query>
    </AuthenticatedRoute>
  );
};

export default MarketPlaceRoute;
