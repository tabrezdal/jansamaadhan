'use client'

import { useState, useRef } from 'react'
import {
  Upload, X, CheckCircle, FileText,
  ChevronRight, ChevronLeft, MessageCircle, AlertCircle, Loader2
} from 'lucide-react'
import type { Service, DocRequired } from '@/lib/services'
import type { OrderState } from './OrderFlow'

interface Props {
  service:  Service
  order:    OrderState
  onUpdate: (patch: Partial<OrderState>) => void
  onNext:   () => void
  onBack:   () => void
}

const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.webp'
const MAX_MB   = 10

// Each slot tracks: the File object (for preview), upload state, and the
// Supabase object key once the upload completes. The object key is what
// gets passed to the orders/create API so it can link docs to the order.
interface SlotState {
  file:      File
  status:    'uploading' | 'done' | 'error'
  objectKey: string   // Supabase key, e.g. "temp/{uuid}/{docId}-{uuid}.pdf"
  error?:    string
}

async function uploadToSupabase(
  doc: DocRequired,
  file: File,
): Promise<{ objectKey: string }> {
  // 1. Get presigned upload URL from our API
  const ext = file.name.split('.').pop() ?? 'bin'
  const res = await fetch('/api/documents/upload-url', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId:    'temp',          // temp — will be linked to real order after payment
      docKey:     doc.id,
      label:      doc.label,
      required:   doc.required,
      fileName:   file.name,
      fileSizeKb: Math.round(file.size / 1024),
      mimeType:   file.type || 'application/octet-stream',
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? 'Failed to get upload URL.')
  }

  const { uploadUrl, objectKey } = await res.json()

  // 2. PUT file directly to Supabase (browser → Supabase, bypasses Vercel)
  const putRes = await fetch(uploadUrl, {
    method:  'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body:    file,
  })

  if (!putRes.ok) {
    throw new Error('Upload to storage failed. Please try again.')
  }

  return { objectKey }
}

function DocSlot({
  doc,
  slot,
  onUpload,
  onRemove,
}: {
  doc:      DocRequired
  slot?:    SlotState
  onUpload: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag,   setDrag]  = useState(false)
  const [error,  setError] = useState('')

  function validate(f: File): boolean {
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_MB}MB.`); return false
    }
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (!['pdf','jpg','jpeg','png','webp'].includes(ext)) {
      setError('Only PDF, JPG, PNG, WebP allowed.'); return false
    }
    setError(''); return true
  }

  function handleFile(f: File) {
    if (validate(f)) onUpload(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const isUploading = slot?.status === 'uploading'
  const isDone      = slot?.status === 'done'
  const isError     = slot?.status === 'error'

  return (
    <div className={`rounded-2xl border-2 transition-all duration-150
      ${isDone
        ? 'border-brand-green bg-green-50'
        : isError
          ? 'border-red-300 bg-red-50'
          : drag
            ? 'border-brand-teal bg-brand-surface border-dashed'
            : 'border-gray-200 bg-white hover:border-brand-teal/40 border-dashed'
      }`}
    >
      <div className="p-4">
        {/* Label row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700">{doc.label}</span>
              {doc.required
                ? <span className="text-[10px] text-red-500 font-medium">Required</span>
                : <span className="text-[10px] text-gray-400">Optional</span>
              }
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{doc.hint}</p>
            {doc.example && <p className="text-[11px] text-brand-teal mt-0.5">e.g. {doc.example}</p>}
          </div>
          {slot && !isUploading && (
            <button
              onClick={onRemove}
              className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors flex-shrink-0"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* File preview / upload zone */}
        {slot ? (
          <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5
            ${isDone ? 'bg-white border-green-200' : isError ? 'bg-white border-red-200' : 'bg-white border-gray-200'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${isDone ? 'bg-green-100' : isError ? 'bg-red-100' : 'bg-gray-100'}`}>
              {isUploading
                ? <Loader2 size={14} className="text-brand-teal animate-spin" />
                : <FileText size={14} className={isDone ? 'text-green-600' : 'text-red-500'} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-700 truncate">{slot.file.name}</div>
              <div className="text-[10px] text-gray-400">
                {isUploading ? 'Uploading to secure storage…'
                  : isDone    ? `${Math.round(slot.file.size / 1024)} KB · Uploaded ✓`
                  : slot.error ?? 'Upload failed'}
              </div>
            </div>
            {isDone && <CheckCircle size={16} className="text-brand-green flex-shrink-0" />}
            {isError && <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 hover:bg-brand-surface transition-colors">
              <Upload size={14} className="text-brand-teal" />
              <span className="text-xs font-medium text-brand-teal">Click to upload or drag here</span>
            </div>
          </div>
        )}

        {(error || (isError && slot?.error)) && (
          <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
            <AlertCircle size={11} /> {error || slot?.error}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />
    </div>
  )
}

export default function Step2Docs({ service, order, onUpdate, onNext, onBack }: Props) {
  const [name,  setName]  = useState(order.name)
  const [email, setEmail] = useState(order.email)
  const [notes, setNotes] = useState(order.notes)

  // slots: docId → SlotState (tracks per-file upload progress)
  const [slots, setSlots] = useState<Record<string, SlotState>>({})

  const required = service.docsNeeded.filter(d => d.required)
  const optional = service.docsNeeded.filter(d => !d.required)

  const allRequiredDone = required.every(d => slots[d.id]?.status === 'done')
  const anyUploading    = Object.values(slots).some(s => s.status === 'uploading')
  const uploadedCount   = Object.values(slots).filter(s => s.status === 'done').length

  async function handleUpload(doc: DocRequired, file: File) {
    // Immediately show uploading state
    setSlots(prev => ({
      ...prev,
      [doc.id]: { file, status: 'uploading', objectKey: '' },
    }))

    try {
      const { objectKey } = await uploadToSupabase(doc, file)
      setSlots(prev => ({
        ...prev,
        [doc.id]: { file, status: 'done', objectKey },
      }))
      // Propagate the uploaded doc key into OrderState so Step4Pay can use it
      onUpdate({
        uploadedDocs: {
          ...order.uploadedDocs,
          [doc.id]: file,
        },
        uploadedDocKeys: {
          ...(order.uploadedDocKeys ?? {}),
          [doc.id]: objectKey,
        },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed.'
      setSlots(prev => ({
        ...prev,
        [doc.id]: { file, status: 'error', objectKey: '', error: msg },
      }))
    }
  }

  function handleRemove(docId: string) {
    setSlots(prev => {
      const next = { ...prev }
      delete next[docId]
      return next
    })
    const nextDocs = { ...order.uploadedDocs }
    const nextKeys = { ...(order.uploadedDocKeys ?? {}) }
    delete nextDocs[docId]
    delete nextKeys[docId]
    onUpdate({ uploadedDocs: nextDocs, uploadedDocKeys: nextKeys })
  }

  function handleContinue() {
    onUpdate({ name, email, notes })
    onNext()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Main panel */}
      <div className="lg:col-span-2 space-y-5">

        {/* Header + progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-lg text-gray-900 mb-1">Upload Documents</h2>
          <p className="text-sm text-gray-500">
            Clear photos or scans. JPG, PNG, PDF — max {MAX_MB}MB each. Files go directly to encrypted storage.
          </p>
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">{uploadedCount} of {required.length} required docs uploaded</span>
              <span className={`text-xs font-semibold ${allRequiredDone ? 'text-brand-green' : 'text-amber-600'}`}>
                {allRequiredDone ? '✓ All done' : `${required.length - uploadedCount} remaining`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full transition-all duration-500"
                style={{ width: `${Math.min((uploadedCount / Math.max(required.length, 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Required docs */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Required Documents</h3>
          <div className="space-y-3">
            {required.map(doc => (
              <DocSlot
                key={doc.id}
                doc={doc}
                slot={slots[doc.id]}
                onUpload={f => handleUpload(doc, f)}
                onRemove={() => handleRemove(doc.id)}
              />
            ))}
          </div>
        </div>

        {/* Optional docs */}
        {optional.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Optional Documents</h3>
            <div className="space-y-3">
              {optional.map(doc => (
                <DocSlot
                  key={doc.id}
                  doc={doc}
                  slot={slots[doc.id]}
                  onUpload={f => handleUpload(doc, f)}
                  onRemove={() => handleRemove(doc.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp fallback */}
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">💬</span>
            <div>
              <p className="text-xs font-semibold text-green-800">Prefer WhatsApp?</p>
              <p className="text-xs text-green-700 mt-0.5">Send your documents to our WhatsApp and we'll link them to your order.</p>
            </div>
          </div>
          <a
            href="https://wa.me/919664850011"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={13} /> Send docs
          </a>
        </div>

        {/* Contact details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-semibold text-sm text-gray-800">Your Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name <span className="text-red-400">*</span></label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ramesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400">(optional)</span></label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ramesh@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes for CA <span className="text-gray-400">(optional)</span></label>
            <textarea
              rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Any special instructions or deadline…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white resize-none"
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 space-y-4">
          <h3 className="font-semibold text-sm text-gray-800">Order Summary</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-800 text-right">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Plan</span>
              <span className="font-medium text-gray-800">{order.selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2.5">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="font-display font-bold text-xl text-brand-teal">₹{order.selectedPlan?.price}</span>
            </div>
          </div>

          {/* Doc checklist */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
            {service.docsNeeded.map(doc => {
              const s = slots[doc.id]
              return (
                <div key={doc.id} className="flex items-center gap-2 text-xs">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold
                    ${s?.status === 'done'      ? 'bg-brand-green text-white'
                      : s?.status === 'uploading' ? 'bg-brand-teal/20 text-brand-teal'
                      : s?.status === 'error'     ? 'bg-red-100 text-red-500'
                      : 'bg-gray-200 text-gray-400'}`}>
                    {s?.status === 'done' ? '✓' : s?.status === 'uploading' ? '…' : s?.status === 'error' ? '!' : doc.required ? '·' : '○'}
                  </span>
                  <span className={s?.status === 'done' ? 'text-gray-700' : 'text-gray-400'}>{doc.label}</span>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={handleContinue}
              disabled={!allRequiredDone || !name.trim() || anyUploading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all
                ${allRequiredDone && name.trim() && !anyUploading
                  ? 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-md shadow-brand-teal/20 hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {anyUploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <>Review Order <ChevronRight size={15} /></>}
            </button>
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-gray-500 hover:text-brand-teal hover:bg-brand-surface transition-all border border-gray-200"
            >
              <ChevronLeft size={15} /> Back to Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
