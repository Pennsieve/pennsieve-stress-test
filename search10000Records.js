import { searchRecords } from './searchRecords.js'
import { K6_PROJECT_ID, SEARCH_STAGES, SEARCH_10_000_RECORDS_DATASET_ID } from './settings.js'

export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: "Search Records (10,000 Records)"
    }
  },
  stages : SEARCH_STAGES
}

export default function() {
  searchRecords(SEARCH_10_000_RECORDS_DATASET_ID)
}
