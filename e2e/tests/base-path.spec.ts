import { Agent } from 'https';

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

import clients from '../config/clients-configuration.json';
import type { Client } from '../types';

describe('Base path', () => {
  let client: Client;

  beforeAll(() => {
    dotenv.config();
    client = clients.find(c => c.ClientId === 'client-credentials-flow-client-id');
    expect(client).toBeDefined();
  });

  test('Discovery Endpoint', async () => {
    const response = await fetch(process.env.OIDC_DISCOVERY_ENDPOINT_WITH_BASE_PATH, {
      agent: new Agent({ rejectUnauthorized: false }),
    });
    const result = await response.json();
    expect(result.token_endpoint).toEqual(process.env.OIDC_TOKEN_URL_WITH_BASE_PATH);
  });

  test('Token Endpoint', async () => {
    const parameters = new URLSearchParams({
      client_id: client.ClientId,
      client_secret: client.ClientSecrets?.[0] ?? '',
      grant_type: 'client_credentials',
      scope: client.AllowedScopes.join(' '),
    });

    const response = await fetch(process.env.OIDC_TOKEN_URL_WITH_BASE_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: parameters.toString(),
      agent: new Agent({ rejectUnauthorized: false }),
    });
    expect(response).toBeDefined();
  });
});
