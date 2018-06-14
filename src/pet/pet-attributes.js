import moment from 'moment';
import { random, round } from 'lodash';
import { MAX_ATTRIBUTE_VALUE } from '~/pet/constants';

const CONSTANTS = {
  maxNoUserInteraction: moment.duration('2', 'd').asMilliseconds(),
  maxAttributeValue: MAX_ATTRIBUTE_VALUE
};

export const getNextPetAttributes = pet => {
  const [lastInteraction] = pet.interactions;

  const multipliers = {
    lastInteraction: lastInteraction
      ? moment().diff(lastInteraction.createdAt) /
          CONSTANTS.maxNoUserInteraction +
        1
      : 1,
    hunger: 1,
    energy: 1
  };

  const nextHunger = round(
    random(
      pet.hunger - 10 * Math.min(CONSTANTS.maxAttributeValue / pet.hunger, 2),
      pet.hunger
    )
  );

  multipliers.hunger = Math.min(CONSTANTS.maxAttributeValue / nextHunger, 2);

  const nextEnergy = round(
    random(pet.content - 10 * multipliers.hunger, pet.content)
  );

  multipliers.energy = Math.min(CONSTANTS.maxAttributeValue / nextEnergy, 2);

  const nextContent = round(
    random(pet.content - 10 * multipliers.energy, pet.content)
  );

  const nextAttributes = {
    eventLoopedAt: moment().toDate(),
    content: nextContent,
    hunger: nextHunger,
    energy: nextEnergy
  };

  return nextAttributes;
};
