import http from 'k6/http';
import { check, fail } from 'k6';

export function login(host, apiKey, apiSecret) {

  let loginResponse = http.post(
    `${host}/account/api/session`,
    JSON.stringify({
      "tokenId": apiKey,
      "secret": apiSecret
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      }
    });

  if (!check(loginResponse, {
    'status was 201': r => r.status == 201
  })) {
    fail("Could not log in");
  }

  return JSON.parse(loginResponse.body).session_token;
}
