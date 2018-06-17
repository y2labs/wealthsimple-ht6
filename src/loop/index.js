import intervalPromise from 'interval-promise';
import petsHandler from '~/loop/pets';
import petGrowthHandler from '~/loop/pet-growth';
import passiveItemsHandler from '~/loop/passive-items';
import itemsHandler from '~/loop/items';

const HANDLERS = [
  itemsHandler,
  petsHandler,
  petGrowthHandler,
  passiveItemsHandler
];

const props = { exited: false };

const start = () => {
  HANDLERS.forEach(({ handler, interval }) => {
    intervalPromise(
      async (_, stopFn) => {
        if (props.exited) {
          stopFn();

          return;
        }

        await handler();
      },
      interval,
      {
        stopOnError: false
      }
    );
  });
};

const stop = () => {
  props.exited = true;
};

export { start, stop };
