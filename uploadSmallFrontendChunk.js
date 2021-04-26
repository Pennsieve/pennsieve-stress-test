import { check, sleep } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { login } from './login.js';
import { readFile, preview, fineUploaderAndComplete } from './upload.js';
import { K6_PROJECT_ID, HOST, API_KEY, API_SECRET, ORGANIZATION_NODE_ID, DATASET_ID, DATASET_NODE_ID } from './settings.js'


export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: "Upload - small file frontend chunk"
    }
  }
  // stages: [
  //   { duration: '1m', target: 20 }
  // ],
}


const testFile = readFile('large.zip')


let sessionToken = null


export default function() {

 if (__ITER == 0) {
    sessionToken = login(HOST, API_KEY, API_SECRET)
  }

  fineUploaderAndComplete(HOST, sessionToken, ORGANIZATION_NODE_ID, DATASET_ID, DATASET_NODE_ID, testFile)
}
