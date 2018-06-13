import moment from 'moment';
import { random } from 'lodash';

const CONSTANTS = {
  maxNoUserInteraction: moment.duration('2', 'd').asMilliseconds(),
  maxAttributeValue: 1000
};

export const getNextPetAttributes = pet => {
  const lastInteractionMultiplier =
    moment().diff(moment(pet.lastInteractionAt)) /
      CONSTANTS.maxNoUserInteraction +
    1;

  const nextHunger = random(pet.hunger - 10, pet.hunger);

  const nextContent = random(
    pet.content -
      10 *
        Math.min(CONSTANTS.maxAttributeValue / nextHunger, 2) *
        lastInteractionMultiplier,
    pet.content
  );

  const nextEnergy = random(
    pet.energy -
      10 *
        Math.min(CONSTANTS.maxAttributeValue / nextContent, 2) *
        lastInteractionMultiplier,
    pet.energy
  );

  const nextAttributes = {
    eventLoopedAt: moment().toDate(),
    content: nextContent,
    hunger: nextHunger,
    energy: nextEnergy
  };

  return nextAttributes;
};
