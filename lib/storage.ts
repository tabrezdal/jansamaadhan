import { randomUUID } from 'crypto'

function getConfig() {
  const url    = process.env.SUPABASE_URL
  const key    = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.SUPABASE_STORAGE_BUCKET
  if (!url || !key || !bucket) {
    throw new Error('Supabase Storage not configured.')
  }
  return { url, key, bucket }
}

export function buildDocumentKey(orderId: string, docKey: string, fileExt: string): string {
  const cleanExt = fileExt.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin'
  return `orders/${orderId}/${docKey}-${randomUUID()}.${cleanExt}`
}

// Generate a presigned upload URL using Supabase's createSignedUploadUrl endpoint
export async function getUploadUrl(objectKey: string, _contentType: string): Promise<string> {
  const { url, key, bucket } = getConfig()

  const res = await fetch(
    `${url}/storage/v1/object/upload/sign/${bucket}/${objectKey}`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase upload sign error: ${err}`)
  }

  const data = await res.json() as { signedURL: string; token: string; path: string }

  // Supabase returns a relative signedURL — prefix with storage base
  const signedUrl = data.signedURL.startsWith('http')
    ? data.signedURL
    : `${url}/storage/v1${data.signedURL}`

  return signedUrl
}

// Generate a presigned download URL for an existing object
export async function getDownloadUrl(objectKey: string): Promise<string> {
  const { url, key, bucket } = getConfig()

  const res = await fetch(
    `${url}/storage/v1/object/sign/${bucket}/${objectKey}`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: 300 }),
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase download sign error: ${err}`)
  }

  const data = await res.json() as { signedURL: string }

  return data.signedURL.startsWith('http')
    ? data.signedURL
    : `${url}/storage/v1${data.signedURL}`
}

// Delete a stored object
export async function deleteDocument(objectKey: string): Promise<void> {
  const { url, key, bucket } = getConfig()

  const res = await fetch(
    `${url}/storage/v1/object/${bucket}/${objectKey}`,
    {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${key}` },
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase delete error: ${err}`)
  }
}