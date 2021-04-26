export const HOST = "https://api.blackfynn.net"
export const API_KEY = "0d064b88-f0f8-4bff-9847-6fcedf88c156"
export const API_SECRET = "cbb925d7-1fcb-414f-a7bb-bd833f31abbe"

// "Blackfynn Test"
export const ORGANIZATION_ID = 19
export const ORGANIZATION_NODE_ID = "N:organization:050fae39-4412-43ef-a514-703ed8e299d5"

// "RDMP Stress Test"
export const DATASET_ID = 1342
export const DATASET_NODE_ID = "N:dataset:9871bf33-7e78-4258-8daa-d7ea5ae39d33"

// "RDMP Stress Test (Create Records)"
export const CREATE_RECORDS_DATASET_ID = 1356
export const CREATE_RECORDS_DATASET_NODE_ID = "N:dataset:be1c63c3-8b4a-438a-89cd-408b0ce17e75"

// "RDMP Stress Test (Search 10000 Records)"
export const SEARCH_10_000_RECORDS_DATASET_ID = 1357

// "RDMP Stress Test (Search 100000 Records)"
export const SEARCH_100_000_RECORDS_DATASET_ID = 1358

// "RDMP Stress Test (Search 1000000 Records)"
export const SEARCH_1_000_000_RECORDS_DATASET_ID = 1359

// K6 "RDMP Stress Test"
export const K6_PROJECT_ID = 3507314

export const DEFAULT_STAGES = [
  { duration: '30s', target: 10 },
  { duration: '30s', target: 20 },
  { duration: '30s', target: 30 },
  { duration: '30s', target: 40 },
  { duration: '30s', target: 50 },
  { duration: '5m', target: 0 },
]

export const SEARCH_STAGES = [
  { duration: '3m', target: 25 },
  { duration: '2m', target: 0 },
]
