import { check, sleep } from 'k6';
import http from 'k6/http';
import { login } from './login.js';
import { HOST, API_KEY, API_SECRET, K6_PROJECT_ID, DEFAULT_STAGES, ORGANIZATION_ID, DATASET_ID } from './settings.js';



let N_DATASETS = 25

export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: `List Datasets (page size: ${N_DATASETS})`
    }
  },
  stages: DEFAULT_STAGES
}

let sessionToken = null

function dictToURI(dict) {
    var str = [];
    for(var p in dict){
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dict[p]));
    }
    return str.join("&");
}

export default function() {

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
    api_key:API_KEY,
    limit: N_DATASETS,
    offset: 0,
    orderBy: "Name",
    orderDirection: "Asc",
    onlyMyDatasets:false,
    includeBannerUrl:true,
  }

  let response = http.get(
    `${HOST}/datasets/paginated?` + dictToURI(data),
    params
  )

  check(response, { 'status was 200': r => r.status == 200 })

  sleep(0.1)
}