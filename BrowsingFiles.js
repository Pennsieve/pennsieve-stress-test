import { check, sleep } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { login } from './login.js';
import { readFile, preview } from './upload.js';
import { HOST, API_KEY, API_SECRET, ORGANIZATION_NODE_ID, K6_PROJECT_ID, DEFAULT_STAGES } from './settings.js'

export const DATASET_ID = 1353
export const DATASET_NODE_ID = "N:dataset:d6b02e67-0951-49a8-ad74-b29b9ac1cd2d"

export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: `Browsing 500 files`
    }
  },
  stages: DEFAULT_STAGES
}


export function GetFiles(host, sessionToken, organizationNodeId, datasetNodeId) {

  const urlTopLevel = `${host}/datasets/${datasetNodeId}?includeAncestors=true&api_key=${sessionToken}`

  const resp = http.get(urlTopLevel, {
    tags: { name: `${host}/datasets/${datasetNodeId}?includeAncestors=true&api_key=<sessionToken>` }})

  check(resp, { 'Top Level response status was 200': r => r.status == 200 })

  if (resp.status == 200){
    const urlSecondLevel = `${host}/datasets/${datasetNodeId}/packages?pageSize=500&includeSourceFiles=true&api_key=${sessionToken}`

    const resp = http.get(urlSecondLevel, {
        tags: { name: `${host}/datasets/${datasetNodeId}/packages?pageSize=500&includeSourceFiles=true&api_key=<sessionToken>` }})

    check(resp, { 'Second Level response status was 200': r => r.status == 200 })
    }
}

let sessionToken = null

export default function() {

 if (__ITER == 0) {
    sessionToken = login(HOST, API_KEY, API_SECRET)
  }

  GetFiles(HOST, sessionToken, ORGANIZATION_NODE_ID, DATASET_NODE_ID)

  sleep(1.5);
}