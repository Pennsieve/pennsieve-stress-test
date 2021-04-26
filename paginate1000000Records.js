import { paginateRecords } from './paginateRecords.js'
import { K6_PROJECT_ID, DEFAULT_STAGES, SEARCH_1_000_000_RECORDS_DATASET_ID } from './settings.js'

export let options = {
  ext: {
    loadimpact: {
      projectID: K6_PROJECT_ID,
      name: "Paginate Records (1,000,000 Records)"
 }
  },
  stages : DEFAULT_STAGES
}

export default function() {
  paginateRecords(SEARCH_1_000_000_RECORDS_DATASET_ID)
}
