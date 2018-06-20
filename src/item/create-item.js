import moment from 'moment';
import faker from 'faker';
import { last, round, random } from 'lodash';
import { pickOption } from '~/item/utils';
import { getItemEffects } from '~/item/item-effects';

const CONSTANTS = {
  maxLastInteractionMultipler: 3,

  rarityRareItem: 1,
  rarityCommonItem: 80,

  rarityPassiveItem: 5,
  raritySingleUseItem: 80
};

export const getCreatedItemPrice = ({ rarity, temporality, item }) => {
  const isRare = rarity === 'rare';
  const isPassive = temporality === 'passive';

  const price = {
    value: random(100, 150)
  };

  if (isRare) {
    price.value += random(200, 350);
  }

  if (isPassive) {
    price.value += random(300, 500);
  }

  return price.value;
};

export const getCreatedItemExpiresAt = ({ rarity, temporality, item }) => {
  const isRare = rarity === 'rare';
  const isPassive = temporality === 'passive';
  const effectsLength = item.effects.length;

  const expiresAt = {
    date: moment().add(moment.duration(1, 'd'))
  };

  if (isRare) {
    expiresAt.date = expiresAt.date.subtract(
      moment.duration(random(4, 10), 'h')
    );
  }

  if (isPassive) {
    expiresAt.date = expiresAt.date.subtract(
      moment.duration(random(4, 10), 'h')
    );
  }

  expiresAt.date = expiresAt.date.subtract(moment.duration(effectsLength, 'h'));

  return expiresAt.date.toDate();
};

export const createItem = ({
  interactions,
  overrideRarity,
  overrideTemporality
} = {}) => {
  const lastInteraction = last(interactions);

  const multipliers = {
    lastInteraction: lastInteraction
      ? round(
          Math.min(
            CONSTANTS.maxLastInteractionMultipler,
            (moment().diff(moment(lastInteraction.createdAt), 'h') / 24) *
              CONSTANTS.maxLastInteractionMultipler
          )
        ) * 10
      : 1
  };

  const rarity =
    overrideRarity ||
    pickOption({
      options: {
        rare: multipliers.lastInteraction * CONSTANTS.rarityCommonItem,
        common: CONSTANTS.rarityCommonItem
      }
    });

  const temporality =
    overrideTemporality ||
    pickOption({
      options: {
        passive: multipliers.lastInteraction * CONSTANTS.rarityPassiveItem,
        singleUse: CONSTANTS.raritySingleUseItem
      }
    });

  const itemEffects = getItemEffects({ temporality, rarity });

  if (itemEffects.length === 0) {
    return null;
  }

  const item = {
    name: faker.commerce.productName(),
    description: faker.company.bs(),
    singleUse: temporality === 'singleUse',
    effects: itemEffects
  };

  return {
    expiresAt: getCreatedItemExpiresAt({ rarity, temporality, item }),
    price: getCreatedItemPrice({ rarity, temporality, item }),
    item,
    rarity,
    temporality
  };
};
