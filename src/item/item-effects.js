import { random, round } from 'lodash';
import { pickOption } from '~/item/utils';

const ITEM_EFFECTS = {
  NOOP: {
    temporality: null,
    type: 'NOOP',
    factory: ({ rarity } = {}) => {
      return {
        name: 'Does nothing',
        description: 'Nothing',
        type: 'NOOP',
        value: JSON.stringify({})
      };
    }
  },

  HUNGER_INCREASE: {
    temporality: 'singleUse',
    type: 'HUNGER_INCREASE',
    factory: ({ rarity }) => {
      const [max, min] = rarity === 'rare' ? [200, 100] : [75, 40];
      const value = round(random(min, max));

      return {
        name: 'Eat snack',
        description: 'Eat the snack.',
        type: 'HUNGER_INCREASE',
        value: JSON.stringify({ value })
      };
    }
  },

  CONTENT_INCREASE: {
    temporality: 'singleUse',
    type: 'CONTENT_INCREASE',
    factory: ({ rarity }) => {
      const [max, min] = rarity === 'rare' ? [150, 100] : [75, 40];
      const value = round(random(min, max));

      return {
        name: 'Play with toy',
        description: 'Play with the toy and increase happiness!',
        type: 'CONTENT_INCREASE',
        value: JSON.stringify({ value })
      };
    }
  },

  ENERGY_INCREASE: {
    temporality: 'singleUse',
    type: 'ENERGY_INCREASE',
    factory: ({ rarity }) => {
      const [max, min] = rarity === 'rare' ? [220, 100] : [75, 40];
      const value = round(random(min, max));

      return {
        name: 'Energy boost',
        description: 'Boost energy by bringing happiness and energy!',
        type: 'ENERGY_INCREASE',
        value: JSON.stringify({ value })
      };
    }
  },

  PASSIVE_EARN_MANAGED_DOLLARS: {
    temporality: 'passive',
    type: 'PASSIVE_EARN_MANAGED_DOLLARS',
    factory: ({ rarity }) => {
      const isRare = rarity === 'rare';

      const value = {
        value: round(random(isRare ? 20 : 10, isRare ? 50 : 10)),
        stat: pickOption({
          options: {
            hunger: random(10, 20),
            content: random(10, 20),
            energy: random(10, 20)
          }
        }),
        amount: random(isRare ? 700 : 400, isRare ? 850 : 500)
      };

      return {
        name: 'Special properties',
        description: `Earning passive dollars managed while your pet's ${
          value.stat
        } is above ${value.amount}`,
        type: 'PASSIVE_EARN_MANAGED_DOLLARS',
        value: JSON.stringify(value)
      };
    }
  }
};

export const getItemEffects = ({ temporality, rarity }) => {
  const validEffects = Object.values(ITEM_EFFECTS).filter(
    ({ temporality: itemEffectTemporality }) =>
      temporality === itemEffectTemporality
  );

  const appliedEffects = validEffects.reduce((effects, validEffect) => {
    const applied = pickOption({
      options: {
        yes: 20,
        no: 80
      }
    });

    return applied === 'yes'
      ? effects.concat(validEffect.factory({ rarity }))
      : effects;
  }, []);

  if (appliedEffects.length === 0) {
    return [ITEM_EFFECTS.NOOP.factory()];
  }

  return appliedEffects;
};
