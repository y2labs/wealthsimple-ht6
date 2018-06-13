import intervalPromise from 'interval-promise';
import petsHandler from '~/loop/pets';

const HANDLERS = [petsHandler];

const props = { exited: false };

const start = () => {
  HANDLERS.forEach(({ handler, interval }) => {
    intervalPromise(async (_, stopFn) => {
      if (props.exited) {
        stopFn();

        return;
      }

      await handler();
    }, interval);
  });
};

const stop = () => {
  props.exited = true;
};

export { start, stop };
