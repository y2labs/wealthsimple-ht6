const PRICE_TO_DOLLAR_CONVERSION = 100;

export const fromPriceToAmount = price => {
  return (price / PRICE_TO_DOLLAR_CONVERSION).toPrecision(2);
};

export const fromAmountToPrice = amount => {
  return (
    (typeof amount === 'string' ? parseFloat(amount) : amount) *
    PRICE_TO_DOLLAR_CONVERSION
  );
};
