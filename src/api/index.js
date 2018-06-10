import got from 'got';
import { Router } from 'express';
import { stringify } from 'querystring';
import { signJwt } from '~/utils/auth';
import { getPeople } from '~/utils/wealthsimple';
import { createUser } from '~/user/prisma';

const router = Router();

router.get('/login', (req, res) => {
  const qs = stringify({
    client_id: process.env.WS_CLIENT_ID,
    redirect_uri: process.env.WS_CALLBACK_URI,
    response_type: 'code',
    scope: 'read write'
  });

  res.redirect(`${process.env.WS_AUTH_ENDPOINT}?${qs}`);
});

const getPerson = async ({ accessToken }) => {
  const [person] = await getPeople({ accessToken });

  const phoneNumberObj = person.phone_numbers
    .sort((a, b) => {
      if (a.primary && !b.primary) {
        return 1;
      }

      if (a.type === 'mobile' && b.type !== 'mobile') {
        return 1;
      }

      return 0;
    })
    .shift();

  return {
    phoneNumber: phoneNumberObj && phoneNumberObj.number,
    name: person.preferred_first_name,
    email: person.email,
    personId: person.id
  };
};

router.get('/callback', async (req, res, next) => {
  const { code } = req.query;

  try {
    const { body } = await got(process.env.WS_TOKEN_ENDPOINT, {
      json: true,
      body: {
        code,
        client_id: process.env.WS_CLIENT_ID,
        client_secret: process.env.WS_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.WS_CALLBACK_URI
      }
    });

    const person = await getPerson({ accessToken: body.access_token });

    const user = await createUser({
      accessTokenExpiresAt: new Date(
        body.created_at * 1000 + body.expires_in * 1000
      ),

      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      userId: body.resource_owner_id,
      ...person
    });

    res
      .json({
        token: signJwt({ userId: user.id })
      })
      .status(200);
  } catch (err) {
    next(err);
  }
});

export default router;
