import { paginateRecords } from './paginateRecords.js'
import { K6_PROJECT_ID, DEFAULT_STAGES, SEARCH_10_000_RECORDS_DATASET_ID } from './settings.js'

export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: "Paginate Records (10,000 Records)"
 }
  },
  stages : DEFAULT_STAGES
}

export default function() {
  paginateRecords(SEARCH_10_000_RECORDS_DATASET_ID)
}
