import { check, sleep } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { login } from './login.js';
import { HOST, API_KEY, API_SECRET, K6_PROJECT_ID, ORGANIZATION_ID } from './settings.js'

let sessionToken = null

let modelName = "patient"

/**
 * Base test case for searching records.
 */
export function searchRecords(datasetId) {

  if (__ITER == 0) {
    sessionToken = login(HOST, API_KEY, API_SECRET)
  }

  let params = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
  }

  let data = {
    model: modelName,
    datasets: [datasetId],
    filters: [
      {
        model: modelName,
        property: "name",
        operator: "STARTS WITH",
        value: "alice"
      }
    ]
  }

  let response = http.post(
    `${HOST}/models/v2/organizations/${ORGANIZATION_ID}/search/records`,
    JSON.stringify(data),
    params
  )
  check(response, { 'status was 200': r => r.status == 200 })

  sleep(0.1)
}
