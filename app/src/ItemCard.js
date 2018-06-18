import './ItemCard.css';

import React from 'react';
import moment from 'moment';

const getPrice = price => (parseInt(price, 10) / 100).toPrecision(2);

const ItemCard = ({ name, description, purchasedOn, expiresAt, price }) => {
  return (
    <div className="item-card--container">
      <p className="h4-sans">{name}</p>
      <p className="item-card--description">{description}</p>

      <div className="item-card--footer">
        {expiresAt &&
          price && (
            <div className="item-card--footer-price">
              <p className="number-title">For sale ${getPrice(price)}</p>
            </div>
          )}

        <p className="number-title item-card--date">
          {purchasedOn && `Purchased ${moment().to(purchasedOn)}`}
          {expiresAt && `Expires ${moment().to(expiresAt)}`}
        </p>
      </div>
    </div>
  );
};

export default ItemCard;
