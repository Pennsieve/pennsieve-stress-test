import { searchRecords } from './searchRecords.js'
import { K6_PROJECT_ID, SEARCH_STAGES, SEARCH_1_000_000_RECORDS_DATASET_ID } from './settings.js'

export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: "Search Records (1,000,000 Records)"
    }
  },
  stages : [
    { duration: '3m', target: 10 },
    { duration: '2m', target: 0 },
  ]
}

export default function() {
  searchRecords(SEARCH_1_000_000_RECORDS_DATASET_ID)
}
