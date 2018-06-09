const jwt = require('jsonwebtoken');

const decodeJwt = token => {
  const { userId } = jwt.decode(token, process.env.SECRET);

  return userId;
};

module.exports.extractFromCtx = ctx => {
  const header = ctx.request.get('Authorization');

  if (header) {
    const token = header.replace('Bearer ', '');

    return decodeJwt(token);
  }

  return null;
};

module.exports.signJwt = ({ userId }) =>
  jwt.sign({ userId }, process.env.SECRET);
