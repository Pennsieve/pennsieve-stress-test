import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from './login.js';

import { address, finance, name, hacker, commerce, date, internet, phone, random, git } from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';

import { HOST, API_KEY, API_SECRET, CREATE_RECORDS_DATASET_ID } from './settings.js'

export let options = {
  ext: {
    loadimpact: {
      projectID: 3507314,
      name: "Create Records (batch: 10)"
    }
  },
}

let sessionToken = null;
let modelName = null;

export function createRecords(n) {

  // Login once per VU and store token in VU-global context.
  // Not sure this is the best approach, but is recommended here:
  // https://github.com/loadimpact/k6/issues/784

  if (__ITER == 0) {
    sessionToken = login(HOST, API_KEY, API_SECRET);
  }

  if (__ITER == 0) {
    modelName = `${commerce.color()}_${hacker.noun()}_${random.number({ min: 10000, max: 100000 })}`.toLowerCase().replace(/[^a-z0-9]/g, '_')
    console.log(modelName)

    let modelData = {
      name: modelName,
      displayName: modelName,
      description: ""
    }

    let createModelResponse = http.post(
      `${HOST}/models/datasets/${CREATE_RECORDS_DATASET_ID}/concepts`,
      JSON.stringify(modelData),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
      }
    )
    check(createModelResponse, { 'status was 201': r => r.status == 201 })

    let propertyData = [
      {
        "name":"name",
        "displayName":"Name",
        "dataType":"String",
        "conceptTitle":true,
        "description":"",
        "default": true,
        "locked": false
      },
      {
        "name":"dob",
        "displayName":"DoB",
        "dataType":"Date",
        "conceptTitle":false,
        "description":"",
        "default": true,
        "locked": false
      },
      {
        "name":"email",
        "displayName":"Email",
        "dataType": {
          "type": "String",
          "format": "email"
        },
        "conceptTitle":false,
        "description":"",
        "default": true,
        "locked": false
      },
      {
        "name":"phone",
        "displayName":"Phone",
        "dataType":"String",
        "conceptTitle":false,
        "description":"",
        "default": true,
        "locked": false
      }
    ]

    let createPropertiesResponse = http.put(
      `${HOST}/models/datasets/${CREATE_RECORDS_DATASET_ID}/concepts/${modelName}/properties`,
      JSON.stringify(propertyData),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        tags: {
          name: `${HOST}/models/datasets/${CREATE_RECORDS_DATASET_ID}/concepts/:model/properties`
        }
      }
    )
    check(createPropertiesResponse, { 'status was 200': r => r.status == 200 });
  }

  // Build requests for N records
  var data = [];
  for (const i of Array(n)) {
    data.push({"values":[
      {"name": "name", "value": name.findName()},
      {"name": "dob", "value": date.past()},
      {"name": "email", "value": internet.email()},
      {"name": "phone", "value": phone.phoneNumber()}
    ]});
  }

  // Create records
  let createResponse = http.post(
    `${HOST}/models/datasets/${CREATE_RECORDS_DATASET_ID}/concepts/${modelName}/instances/batch`,
    JSON.stringify(data),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      tags: {
        name: `${HOST}/models/datasets/${CREATE_RECORDS_DATASET_ID}/concepts/:model/instances/batch`
      }
    }
  );
  check(createResponse, { 'status was 200': r => r.status == 200 });

  sleep(0.1);
}


// For testing
export default function() {
  createRecords(10)
}
