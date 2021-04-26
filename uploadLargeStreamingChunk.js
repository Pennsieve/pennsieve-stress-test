import { check, sleep } from 'k6';
import { login } from './login.js';
import { HOST, API_KEY, API_SECRET, K6_PROJECT_ID, ORGANIZATION_NODE_ID, DATASET_ID } from './settings.js'
import { readFile, streamChunk } from './upload.js'


export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: "Upload - large file streaming chunk"
    }
  },
  stages: [
    { duration: '30s', target: 3 },
    { duration: '30s', target: 6 },
    { duration: '1m', target: 10 },
    { duration: '1m', target: 15 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 5 }
  ]
}


const testFile = readFile('large.zip')


let sessionToken = null


export default function() {

  // Login once per VU and store token in VU-global context.
  // Not sure this is the best approach, but is recommended here:
  // https://github.com/loadimpact/k6/issues/784

  if (__ITER == 0) {
    sessionToken = login(HOST, API_KEY, API_SECRET)
  }

  streamChunk(HOST, sessionToken, ORGANIZATION_NODE_ID, DATASET_ID, testFile, 0)
}
