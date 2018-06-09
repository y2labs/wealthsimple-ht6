const { Router } = require('express');
const { Prisma } = require('prisma-binding');
const { stringify } = require('querystring');
const got = require('got');
const { createUser } = require('../users/prisma');

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

apiRouter.get('/callback', async (req, res) => {
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

    const user = createUser({
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      userId: body.resource_owner_id,
      expiresAt: body.created_at + body.expires_in
    });

    res.json(user).status(200);
  } catch (err) {
    console.log(err);

    res.sendStatus(500);
  }
});

module.exports = apiRouter;
