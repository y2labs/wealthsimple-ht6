import { get } from 'lodash';

export const getOneDayGrowth = ({ prevDay, currentDay }) => {
  const liquidationValues = {
    prevDay: parseFloat(get(prevDay, 'net_liquidation_value.amount', 0)),
    currentDay: parseFloat(get(currentDay, 'net_liquidation_value.amount', 0))
  };

  return liquidationValues.currentDay / liquidationValues.prevDay - 1;
};
