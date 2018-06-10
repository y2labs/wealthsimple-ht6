import { signJwt } from '~/utils/auth';

export default {
  User: {
    token: (parent, args, context, info) =>
      signJwt({
        userId: parent.id
      })
  }
};
