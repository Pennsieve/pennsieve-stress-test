import { createRecords } from './createRecords.js'
import { K6_PROJECT_ID, DEFAULT_STAGES } from './settings.js'

let N_RECORDS = 10

export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: `Create Records (batch size: ${N_RECORDS})`
    }
  },
  stages: DEFAULT_STAGES
}

export default function() {
  createRecords(N_RECORDS)
}
