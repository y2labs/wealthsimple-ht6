const PASSIVE_EARN_MANAGED_DOLLARS = 'PASSIVE_EARN_MANAGED_DOLLARS';

export const getIsEarning = ({ type, value, pet }) => {
  if (!pet) {
    return false;
  }

  if (type === PASSIVE_EARN_MANAGED_DOLLARS) {
    const { stat, amount } = value;

    return pet[stat] > amount;
  }
};
