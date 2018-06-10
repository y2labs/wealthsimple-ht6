const LEVEL_META = {
  HEALTHY: {
    predicate: attr => attr <= 1000 && attr > 750,
    format: attr => `Not ${attr} at all`
  },
  SOMEWHAT: {
    predicate: attr => attr <= 750 && attr > 500,
    format: attr => `Somewhat ${attr}`
  },
  VERY: {
    predicate: attr => attr <= 500 && attr > 250,
    format: attr => `Very ${attr}`
  },
  EXTREMELY: {
    predicate: attr => attr <= 250,
    format: attr => `Extremely ${attr}`
  }
};

const ATTRIBUTES = {
  content: {
    attr: 'content',
    status: 'upset'
  },

  energy: {
    attr: 'energy',
    status: 'tired'
  },

  hunger: {
    attr: 'hunger',
    status: 'hungry'
  }
};

export const getStatus = petObj => {
  const statuses = Object.values(ATTRIBUTES).map(({ attr, status }) => {
    const currentValue = petObj[attr];

    const level = Object.values(LEVEL_META).find(({ predicate }) =>
      predicate(currentValue)
    );

    return level.format(status);
  });
};
