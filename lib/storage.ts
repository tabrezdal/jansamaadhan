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

export async function getUploadUrl(objectKey: string, contentType: string): Promise<string> {
  const { url, key, bucket } = getConfig()

  const res = await fetch(
    `${url}/storage/v1/object/upload/sign/${bucket}/${objectKey}`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        upsert:      false,
        contentType: contentType,
      }),
    },
  )

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`Supabase upload sign error: ${text}`)
  }

  // Log full response in dev so we can see the exact shape
  if (process.env.NODE_ENV === 'development') {
    console.log('[storage] upload sign response:', text)
  }

  const data = JSON.parse(text) as Record<string, unknown>

  // Handle both possible response shapes from Supabase
  // Shape 1: { signedURL: string, token: string, path: string }
  // Shape 2: { signedUrl: string, path: string }  (note lowercase 'l')
  const rawUrl = (data.signedURL ?? data.signedUrl ?? data.url) as string | undefined

  if (!rawUrl) {
    throw new Error(`Supabase upload sign: unexpected response shape — ${text}`)
  }

  return rawUrl.startsWith('http') ? rawUrl : `${url}/storage/v1${rawUrl}`
}

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

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`Supabase download sign error: ${text}`)
  }

  const data = JSON.parse(text) as Record<string, unknown>
  const rawUrl = (data.signedURL ?? data.signedUrl ?? data.url) as string | undefined

  if (!rawUrl) {
    throw new Error(`Supabase download sign: unexpected response shape — ${text}`)
  }

  return rawUrl.startsWith('http') ? rawUrl : `${url}/storage/v1${rawUrl}`
}

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