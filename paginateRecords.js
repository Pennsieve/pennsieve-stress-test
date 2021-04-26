import { check, sleep, fail } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { login } from './login.js';
import { HOST, API_KEY, API_SECRET, K6_PROJECT_ID, ORGANIZATION_ID, SEARCH_10_000_RECORDS_DATASET_ID } from './settings.js'

let sessionToken = null

let modelName = "patient"

let offset = 0

let limit = 100

let totalCount = null

/**
 * Base test case for paginating records.
 */
export function paginateRecords(datasetId) {

  if (__ITER == 0) {
    sessionToken = login(HOST, API_KEY, API_SECRET)


    let modelResponse = http.get(
      `${HOST}/models/datasets/${datasetId}/concepts/${modelName}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      }
    )
    check(modelResponse, { 'status was 200': r => r.status == 200 })

    totalCount = JSON.parse(modelResponse.body).count

    if (!check(totalCount, {
      "count not found": totalCount => totalCount
    })) {
      fail("could not get totalCount")
    }
  }

  let response = http.get(
    `${HOST}/models/datasets/${datasetId}/concepts/${modelName}/instances?limit=${limit}&offset=${offset}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      tags: {
        name: `${HOST}/models/datasets/${datasetId}/concepts/${modelName}/instances?limit=:limit&offset=:offset`,
      }
    }
  )
  check(response, { 'status was 200': r => r.status == 200 })

  offset += limit

  // Done paginating. Loop back to beginning of records
  if (offset >= totalCount) {
    offset = 0
  }

  console.log(offset)

  sleep(0.5)
}

// For testing
export default function() {
  paginateRecords(SEARCH_10_000_RECORDS_DATASET_ID)
}
