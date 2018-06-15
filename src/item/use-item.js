import prisma from '~/prisma';
import { pick } from 'lodash';
import { ITEM_EFFECT_TYPES } from '~/item/constants';
import { MAX_ATTRIBUTE_VALUE } from '~/pet/constants';

const ITEM_EFFECT_TYPE_HANDLERS = {
  [ITEM_EFFECT_TYPES.HUNGER_INCREASE]: (effect, pet) => {
    const { value } = effect.value;

    return {
      ...pet,
      hunger: Math.min(MAX_ATTRIBUTE_VALUE, pet.hunger + value)
    };
  },

  [ITEM_EFFECT_TYPES.CONTENT_INCREASE]: (effect, pet) => {
    const { value } = effect.value;

    return {
      ...pet,
      content: Math.min(MAX_ATTRIBUTE_VALUE, pet.content + value)
    };
  },

  [ITEM_EFFECT_TYPES.ENERGY_INCREASE]: (effect, pet) => {
    const { value } = effect.value;

    return {
      ...pet,
      energy: Math.min(MAX_ATTRIBUTE_VALUE, pet.energy + value)
    };
  }
};

export const useItem = async ({ singleUse, effects }, { userId, petId }) => {
  if (singleUse) {
    const pet = await prisma.query.pet({
      where: {
        id: petId
      }
    });

    const nextPet = effects.reduce((nextPet, effect) => {
      const handler = ITEM_EFFECT_TYPE_HANDLERS[effect.type];

      return handler ? handler(effect, nextPet) : nextPet;
    }, pet);

    const updatedNextPet = await prisma.mutation.updatePet({
      where: { id: petId },
      data: {
        ...pick(nextPet, ['hunger', 'content', 'energy']),
        interactions: {
          create: [
            {
              type: 'NOOP'
            }
          ]
        }
      }
    });

    return updatedNextPet;
  }
};
