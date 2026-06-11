'use client'

import { useState, useRef } from 'react'
import {
  Upload, X, CheckCircle, FileText,
  ChevronRight, ChevronLeft, MessageCircle, AlertCircle
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

function DocSlot({
  doc,
  file,
  onUpload,
  onRemove,
}: {
  doc:      DocRequired
  file?:    File
  onUpload: (file: File) => void
  onRemove: () => void
}) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [drag,    setDrag]  = useState(false)
  const [error,   setError] = useState('')

  function validate(f: File) {
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_MB}MB.`); return false
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

  return (
    <div className={`rounded-2xl border-2 transition-all duration-150
      ${file
        ? 'border-brand-green bg-green-50'
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
              {doc.required ? (
                <span className="text-[10px] text-red-500 font-medium">Required</span>
              ) : (
                <span className="text-[10px] text-gray-400">Optional</span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{doc.hint}</p>
            {doc.example && <p className="text-[11px] text-brand-teal mt-0.5">e.g. {doc.example}</p>}
          </div>
          {file && (
            <button
              onClick={onRemove}
              className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors flex-shrink-0"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Upload zone / file preview */}
        {file ? (
          <div className="flex items-center gap-2.5 bg-white rounded-xl border border-green-200 px-3 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <FileText size={14} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-700 truncate">{file.name}</div>
              <div className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(0)} KB</div>
            </div>
            <CheckCircle size={16} className="text-brand-green flex-shrink-0" />
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

        {error && (
          <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
            <AlertCircle size={11} /> {error}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}

export default function Step2Docs({ service, order, onUpdate, onNext, onBack }: Props) {
  const [name,  setName]  = useState(order.name)
  const [email, setEmail] = useState(order.email)
  const [notes, setNotes] = useState(order.notes)

  const required = service.docsNeeded.filter(d => d.required)
  const optional = service.docsNeeded.filter(d => !d.required)

  const allRequiredUploaded = required.every(d => Boolean(order.uploadedDocs[d.id]))

  function handleUpload(docId: string, file: File) {
    onUpdate({ uploadedDocs: { ...order.uploadedDocs, [docId]: file } })
  }
  function handleRemove(docId: string) {
    const next = { ...order.uploadedDocs }
    delete next[docId]
    onUpdate({ uploadedDocs: next })
  }

  function handleContinue() {
    onUpdate({ name, email, notes })
    onNext()
  }

  const uploadedCount = Object.keys(order.uploadedDocs).length
  const totalRequired = required.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Docs + contact form */}
      <div className="lg:col-span-2 space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-display font-bold text-lg text-gray-900 mb-1">Upload Documents</h2>
          <p className="text-sm text-gray-500">
            Upload clear photos or scans. JPG, PNG, PDF accepted. Max {MAX_MB}MB per file.
          </p>
          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">{uploadedCount} of {totalRequired} required docs uploaded</span>
              <span className={`text-xs font-semibold ${allRequiredUploaded ? 'text-brand-green' : 'text-amber-600'}`}>
                {allRequiredUploaded ? '✓ All done' : `${totalRequired - uploadedCount} remaining`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full transition-all duration-500"
                style={{ width: `${Math.min((uploadedCount / totalRequired) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Required docs */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Required Documents
          </h3>
          <div className="space-y-3">
            {required.map(doc => (
              <DocSlot
                key={doc.id}
                doc={doc}
                file={order.uploadedDocs[doc.id]}
                onUpload={f => handleUpload(doc.id, f)}
                onRemove={() => handleRemove(doc.id)}
              />
            ))}
          </div>
        </div>

        {/* Optional docs */}
        {optional.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              Optional Documents
            </h3>
            <div className="space-y-3">
              {optional.map(doc => (
                <DocSlot
                  key={doc.id}
                  doc={doc}
                  file={order.uploadedDocs[doc.id]}
                  onUpload={f => handleUpload(doc.id, f)}
                  onRemove={() => handleRemove(doc.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp alternative */}
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">💬</span>
            <div>
              <p className="text-xs font-semibold text-green-800">Prefer WhatsApp?</p>
              <p className="text-xs text-green-700 mt-0.5">
                Send your documents to our WhatsApp number and we will link them to this order.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/918000000000"
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
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400">(optional)</span></label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ramesh@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes for CA <span className="text-gray-400">(optional)</span></label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special instructions, deadline, or questions for the CA…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-teal transition-colors bg-white resize-none"
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
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

          {/* Checklist */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
            {service.docsNeeded.map(doc => (
              <div key={doc.id} className="flex items-center gap-2 text-xs">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                  ${order.uploadedDocs[doc.id] ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {order.uploadedDocs[doc.id] ? '✓' : doc.required ? '·' : '○'}
                </span>
                <span className={order.uploadedDocs[doc.id] ? 'text-gray-700' : 'text-gray-400'}>
                  {doc.label}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleContinue}
              disabled={!allRequiredUploaded || !name.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all
                ${allRequiredUploaded && name.trim()
                  ? 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-md shadow-brand-teal/20 hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              Review Order
              <ChevronRight size={15} />
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
