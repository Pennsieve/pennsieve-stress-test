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
        name: "ZipIt Tests: Download 10M of small files"
      }
    },
}

export function download(host, sessionToken, organizationNodeId, datasetId) {

let body = {
    data: '{"nodeIds":["N:package:f1ce13ab-0486-43a1-9ea6-7f47f070db63","N:package:7735b55e-4031-4b5b-86c7-a72781c3781c","N:package:9a0aaf63-6147-4d73-9a52-0b5f1a62ecfe","N:package:0ea93ae7-245e-46d6-a0a8-223dc627ee50","N:package:c76ae5aa-ef93-4db8-8f7a-a67a75e6222e","N:package:a2bf7d00-37bb-402e-90f3-7b9fc434c44e","N:package:cbdf81e2-8db4-4c05-9e84-321ca8bc275e","N:package:ac9a40be-e62b-4707-a71b-d5f48a904c43","N:package:12336bb8-52d4-4ef6-9c9b-1283fc0cb815","N:package:d9446fd1-54c0-4a8d-8a8e-fb53156fff07"],"archiveName":"blackfynn-data"}'
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