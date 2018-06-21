import './ItemCard.css';

import React, { Fragment } from 'react';
import moment from 'moment';
import accounting from 'accounting';
import { Link } from 'react-router-dom';

const truncate = text => {
  if (text.length >= 100) {
    return `${text.substr(0, 100)}...`;
  }

  return text;
};

const ItemCard = ({
  name,
  description,
  purchasedOn,
  expiresAt,
  price,
  image,
  href
}) => {
  const Parent = href ? Link : 'div';

  const props = {
    className: 'item-card--container'
  };

  if (Parent === Link) {
    props.to = href;
  }

  return React.createElement(
    Parent,
    props,
    <Fragment>
      {image && (
        <div
          className="item-card--preview-image"
          style={{ backgroundImage: image && `url(${image})` }}
        />
      )}

      <div className="item-card--content">
        <p className="h4-sans item-card--header">{name}</p>
        <p className="item-card--description">{truncate(description)}</p>

        <div className="item-card--footer">
          {expiresAt &&
            price && (
              <div className="item-card--footer-price">
                <p className="number-title">
                  For sale ${accounting.formatNumber(price / 100, '2')}
                </p>
              </div>
            )}

          <p className="number-title item-card--date">
            {purchasedOn && `Purchased ${moment().to(purchasedOn)}`}
            {expiresAt && `Expires ${moment().to(expiresAt)}`}
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default ItemCard;
