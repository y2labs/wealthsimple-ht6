const intervalPromise = require('interval-promise');
const petsHandler = require('./pets');

const props = { exited: false };

module.exports.start = () => {
  intervalPromise(async (_, stop) => {
    if (props.exited) {
      stop();

      return;
    }

    await petsHandler();
  }, 10000);
};

module.exports.stop = () => {
  props.exited = true;
};
