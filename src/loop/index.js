import intervalPromise from 'interval-promise';
import petsHandler from '~/loop/pets';

const props = { exited: false };

const start = () => {
  intervalPromise(async (_, stop) => {
    if (props.exited) {
      stop();

      return;
    }

    await petsHandler();
  }, 10000);
};

const stop = () => {
  props.exited = true;
};

export { start, stop };
