import fetch from 'node-fetch';
import moment from 'moment';
import {
  updateUserTokens as updateUserTokensAsync,
  getUserTokens
} from '~/user/prisma';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://api.sandbox.wealthsimple.com/v1'
    : 'https://api.production.wealthsimple.com/v1';

const request = async ({ path, method = 'GET', body, headers = {} }) => {
  const params = {
    method,
    headers
  };

  if (method !== 'GET' && body) {
    params.json = true;
    params.body = body;
  }

  const url = path.includes('://') ? path : `${baseUrl}${path}`;

  const res = await fetch(url, params);

  return {
    body: await res.json(),
    headers: res.headers
  };
};

export const withTokens = async ({ userId }, fn) => {
  let tokens = await getUserTokens({ userId });

  if (!tokens) {
    throw new Error(
      'Cannot request with authorization, no tokens found or user'
    );
  }

  const isExpired = moment(tokens.accessTokenExpiresAt).isBefore(moment.now());

  if (isExpired) {
    tokens = await postRefreshToken({ refreshToken: tokens.refreshToken });

    updateUserTokensAsync({
      ...tokens,
      userId
    });
  }

  const result = await fn(tokens);

  return result;
};

export const getPeople = async ({ accessToken }) => {
  const { body } = await request({
    path: '/people',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return body.results;
};

export const getBankAccounts = async ({ accessToken }) => {
  const { body } = await request({
    path: '/bank_accounts',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return body.results;
};

export const getBankAccount = async ({ accessToken, id }) => {
  const { body } = await request({
    path: `/bank_accounts/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return body;
};

export const postRefreshToken = async ({ refreshToken }) => {
  const { body } = await request({
    path: process.env.WS_TOKEN_ENDPOINT,
    method: 'POST',
    body: {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      client_secret: process.env.WS_CLIENT_SECRET,
      client_id: process.env.WS_CLIENT_ID
    }
  });

  return {
    accessTokenExpiresAt: new Date(
      body.created_at * 1000 + body.expires_in * 1000
    ),

    accessToken: body.access_token,
    refreshToken: body.refresh_token
  };
};
