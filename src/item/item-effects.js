import moment from 'moment';
import { random, round } from 'lodash';
import { pickOption } from '~/item/utils';

const ITEM_EFFECTS = {
  NOOP: {
    temporality: null,
    type: 'NOOP',
    factory: () => {
      return {
        name: 'Does nothing',
        description: 'Nothing',
        type: 'NOOP',
        value: {}
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
        value,
        description: 'Eat the snack.',
        type: 'HUNGER_INCREASE',
        name: 'Eat snack'
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
        description: 'Play with the toy and increase happiness!',
        value,
        type: 'CONTENT_INCREASE',
        name: 'Play with toy'
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
        description: 'Boost energy by bringing happiness and energy!',
        value: { value },
        type: 'ENERGY_INCREASE',
        name: 'Energy boost'
      };
    }
  },

  PASSIVE_EARN_MANAGED_DOLLARS: {
    temporality: 'passive',
    type: 'PASSIVE_EARN_MANAGED_DOLLARS',
    factory: ({ rarity }) => {
      const isRare = rarity === 'rare';
      const interval = random(isRare ? 14 : 8, isRare ? 22 : 14);

      const value = {
        value: round(random(isRare ? 20 : 10, isRare ? 50 : 10)),
        interval: moment.duration(interval, 'h').as('ms'),
        amount: random(isRare ? 700 : 400, isRare ? 850 : 500),
        stat: pickOption({
          options: {
            content: random(10, 20),
            hunger: random(10, 20),
            energy: random(10, 20)
          }
        })
      };

      return {
        name: 'Special properties',
        description: `Earning passive dollars managed while your pet's ${
          value.stat
        } is above ${value.amount} every ${interval} hours`,
        type: 'PASSIVE_EARN_MANAGED_DOLLARS',
        value
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
        yes: 40,
        no: 100
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
