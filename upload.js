import { check, sleep } from 'k6';
import crypto from 'k6/crypto';
import http from 'k6/http';
import { login } from './login.js';
import { HOST, API_KEY, API_SECRET, ORGANIZATION_NODE_ID, DATASET_ID } from './settings.js'


// This is half the actual chunk size because k6 sends data twice (according
// to reported metrics after a test run)
export const DEFAULT_CHUNK_SIZE = 10 * 1024 * 1024


export const DEFAULT_TIMEOUT_MS = 60 * 1000 * 5


function s3File(uploadId, fileName, size, multipartUploadId, chunkedUpload, filePath) {
  const f = {
    uploadId,
    fileName,
    size
  }
  if (multipartUploadId) {
    f.multipartUploadId = multipartUploadId
  }
  if (chunkedUpload) {
    f.chunkedUpload = chunkedUpload
  }
  if (filePath) {
    f.filePath = filePath
  }
  return f
}


function previewPackageRequest(fileName, fileSize) {
  return {
    files: [s3File(1, fileName, fileSize)]
  }
}


export function preview(host, sessionToken, organizationNodeId, datasetId, file) {
  const url = `${host}/upload/preview/organizations/${organizationNodeId}?append=false&dataset_id=${datasetId}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionToken}`
  }
  const resp = http.post(url, JSON.stringify(previewPackageRequest(file.name, file.size)), {
    headers
  })
  check(resp, { 'preview status was 201': r => r.status == 201 })
  return JSON.parse(resp.body)
}


export function complete(host, organizationNodeId, datasetNodeId, importId, sessionToken) {
  const url =  `${host}/upload/complete/organizations/${organizationNodeId}/id/${importId}?datasetId=${datasetNodeId}`
  const headers = {
    'Authorization': `Bearer ${sessionToken}`
  }
  const resp = http.post(url, '', {
    headers,
    tags: { name: `${host}/upload/complete/organizations/${organizationNodeId}/id/<import-id>` }
  })

  console.log(resp.body)
  check(resp, { 'complete status was 200': r => r.status == 200 })

  return JSON.parse(resp.body)
}


export function readFile(name) {
  const data = open(`./data/${name}`)
  return {
    data,
    size: data.length,
    name
  }
}

export function fineUploaderAndComplete(host, sessionToken, organizationNodeId, datasetId, datasetNodeId, file, chunkSize) {
  const p = preview(host, sessionToken, organizationNodeId, datasetId, file)

  const pkg = p.packages[0]
  const f = pkg.files[0]

  const useChunkSize = chunkSize || DEFAULT_CHUNK_SIZE
  if (chunkSize <= 0) {
    fail('chunk size must be > 0')
  }

  const chunkNumber = 0
  const chunkData = file.data.substring(chunkNumber * useChunkSize, (chunkNumber + 1) * useChunkSize)
  if (chunkData.length == 0) {
    fail('chunk data cannot be empty')
  }

  var reqBody = {
    qqpartindex: 0,
    qqpartbyteoffset: 0,
    qqchunksize: file.size,
    qqtotalparts: 1,
    qqtotalfilesize: file.size,
    qqfilename: f.fileName,
    qquuid: pkg.importId,
    qqfile: http.file(chunkData, f.fileName)
  };

  const url = `${host}/upload/fineuploaderchunk/organizations/${organizationNodeId}/id/${pkg.importId}?multipartId=${f.multipartUploadId}`
  const headers = {'Authorization': `Bearer ${sessionToken}`}

  const resp = http.post(url, reqBody, {
    headers,
    timeout: DEFAULT_TIMEOUT_MS,
    tags: { name: `${host}/fineuploaderchunk/organizations/${organizationNodeId}/id/<import-id>?filename=${f.fileName}` }
  })
  check(resp, { 'upload chunk status was 201': r => r.status == 201 })

  const status_ = JSON.parse(resp.body)
  check(status_, { 'upload chunk was successful': s => s.success })

  complete(host, organizationNodeId, datasetNodeId, pkg.importId, sessionToken)
}


// Note: `chunkNumber` is 0-based
export function streamChunk(host, sessionToken, organizationNodeId, datasetId, file, chunkNumber, chunkSize) {
  const p = preview(host, sessionToken, organizationNodeId, datasetId, file)
  const pkg = p.packages[0]
  const f = pkg.files[0]

  const useChunkSize = chunkSize || DEFAULT_CHUNK_SIZE
  if (chunkSize <= 0) {
    fail('chunk size must be > 0')
  }

  const chunkData = file.data.substring(chunkNumber * useChunkSize, (chunkNumber + 1) * useChunkSize)
  if (chunkData.length == 0) {
    fail('chunk data cannot be empty')
  }

  const hash = crypto.sha256(chunkData, 'hex')

  const url = `${host}/upload/chunk/organizations/${organizationNodeId}/id/${pkg.importId}?filename=${f.fileName}&multipartId=${f.multipartUploadId}&chunkNumber=${chunkNumber}&chunkChecksum=${hash}`
  const headers = {'Authorization': `Bearer ${sessionToken}`}

  const resp = http.post(url, chunkData, {
    headers,
    timeout: DEFAULT_TIMEOUT_MS,
    tags: { name: `${host}/upload/chunk/organizations/${organizationNodeId}/id/<import-id>?filename=${f.fileName}` }
  })
  check(resp, { 'stream chunk status was 201': r => r.status == 201 })

  const status_ = JSON.parse(resp.body)
  check(status_, { 'upload chunk was successful': s => s.success })
}
