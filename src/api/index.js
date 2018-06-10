const { Router } = require('express');
const { Prisma } = require('prisma-binding');
const { stringify } = require('querystring');
const got = require('got');
const { createUser } = require('../user/prisma');

const apiRouter = Router();

apiRouter.get('/login', (req, res) => {
  const qs = stringify({
    client_id: process.env.WS_CLIENT_ID,
    redirect_uri: process.env.WS_CALLBACK_URI,
    response_type: 'code',
    scope: 'read write'
  });

  res.redirect(`${process.env.WS_AUTH_ENDPOINT}?${qs}`);
});

apiRouter.get('/callback', async (req, res, next) => {
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

    const user = await createUser({
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      userId: body.resource_owner_id,
      expiresAt: body.created_at + body.expires_in
    });

    res.json(user).status(200);
  } catch (err) {
    next(err);
  }
});

module.exports = apiRouter;