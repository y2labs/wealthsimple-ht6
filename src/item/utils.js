import { get, last, sample, round, min } from 'lodash';

export const pickOption = ({ options }) => {
  const pool = Object.keys(options).reduce((arr, key) => {
    return arr.concat(Array(options[key]).fill(key));
  }, []);

  return sample(pool);
};
