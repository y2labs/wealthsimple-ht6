import prisma from '~/prisma';
import { ITEM_EFFECT_TYPES } from '~/item/constants';
import { MAX_ATTRIBUTE_VALUE } from '~/pet/constants';

const ITEM_EFFECT_TYPE_HANDLERS = {
  [ITEM_EFFECT_TYPES.HUNGER_INCREASE]: (effect, pet) => {
    const { value } = effect.value;

    return {
      ...pet,
      hunger: Math.min(MAX_ATTRIBUTE_VALUE, pet.hunger + value)
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

    console.log(nextPet);
  }
};
