import { check, sleep } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { login } from './login.js';
import { readFile, preview } from './upload.js';
import { HOST, API_KEY, API_SECRET, ORGANIZATION_NODE_ID, K6_PROJECT_ID } from './settings.js'

export const DATASET_ID = 1353
export const DATASET_NODE_ID = "N:dataset:d6b02e67-0951-49a8-ad74-b29b9ac1cd2d"


export let options = {
  stages: [
    { duration: '3m', target: 20 },
    { duration: '3m', target: 40 },
    { duration: '3m', target: 60 },
    { duration: '5m', target: 5 },
    { duration: '1m', target: 0 }
  ],
  ext: {
      loadimpact: {
        projectID: K6_PROJECT_ID,
        name: "ZipIt Tests: Download 1M of small file"
      }
    }
}

export function download(host, sessionToken, organizationNodeId, datasetId) {

let body = {
    data: '{"nodeIds":["N:package:f1ce13ab-0486-43a1-9ea6-7f47f070db63"]}'
}
  const url = `${host}/zipit/?api_key=${sessionToken}`

  const resp = http.post(url, body, {
    tags: { name: `${host}/zipit/?api_key=<sessionToken>` }})

  check(resp, { 'response status was 200': r => r.status == 200 })
}


let sessionToken = null

export default function() {

 if (__ITER == 0) {
    sessionToken = login(HOST, API_KEY, API_SECRET)
  }

  download(HOST, sessionToken, ORGANIZATION_NODE_ID, DATASET_ID)

  sleep(0.5);
}