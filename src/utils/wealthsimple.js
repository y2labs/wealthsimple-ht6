import fetch from 'node-fetch';
import moment from 'moment';
import { omitBy, isNil } from 'lodash';
import {
  updateUserTokens as updateUserTokensAsync,
  getUserTokens
} from '~/user/prisma';
import { stringify } from 'querystring';

const request = async ({ path, method = 'GET', body, headers = {} }) => {
  const params = {
    method,
    headers
  };

  if (method !== 'GET' && body) {
    params.body = typeof body === 'string' ? body : JSON.stringify(body);
    params.headers['Content-Type'] = 'application/json';
  }

  const url = path.includes('://') ? path : `${process.env.WS_API_URL}${path}`;

  const res = await fetch(url, params);
  const text = await res.text();

  return {
    body: text ? JSON.parse(text) : {},
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

export const getPerson = async ({ accessToken, personId }) => {
  const { body } = await request({
    path: `/people/${personId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return body;
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

export const getAccounts = async ({ accessToken, personId }) => {
  // const qs = stringify({
  //   client_ids: personId
  // });

  const { body } = await request({
    path: `/accounts`,
    method: 'GET',
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

export const getAccount = async ({ accessToken, id }) => {
  const { body } = await request({
    path: `/accounts/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return body;
};

export const createDespoit = async ({
  accessToken,
  personId,
  bankAccountId,
  accountId,
  depositAmount
}) => {
  const { body } = await request({
    body: {
      bank_account_id: bankAccountId,
      client_id: personId,
      account_id: accountId,
      value: {
        amount: depositAmount,
        currency: 'CAD'
      }
    },
    path: '/deposits',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return body;
};

export const getDailyValues = async ({
  accountId,
  startDate,
  endDate,
  accessToken
}) => {
  const qs = stringify(
    omitBy(
      {
        account_id: accountId,
        summary_date_start: startDate,
        summary_date_end: endDate
      },
      isNil
    )
  );

  const { body } = await request({
    path: `/daily_values?${qs}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return body.results;
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
