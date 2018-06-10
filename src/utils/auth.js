import jwt from 'jsonwebtoken';

export const extractFromCtx = ctx => {
  const header = ctx.request.get('Authorization');

  if (header) {
    const token = header.replace('Bearer ', '');
    const { userId } = jwt.decode(token, process.env.SECRET);

    return userId;
  }

  return null;
};

export const signJwt = ({ userId }) =>
  jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: '7d'
  });
