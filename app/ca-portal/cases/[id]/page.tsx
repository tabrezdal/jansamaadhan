'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, CheckCircle, FileText, Download,
  MessageCircle, Clock, AlertCircle, Send,
  ChevronDown, Loader2,
} from 'lucide-react'

interface Doc {
  id: string; docKey: string; label: string; status: string
  fileName: string | null; fileSizeKb: number | null; r2ObjectKey: string | null
}

interface Event {
  id: string; actor: string; message: string; createdAt: string
}

interface CaseDetail {
  id: string; orderNumber: string; status: string
  customerNotes: string | null; caNotes: string | null; ackNumber: string | null
  createdAt: string; dueBy: string | null; completedAt: string | null
  serviceSnapshot: { name: string; price: number; slaLabel: string; planName: string }
  customer: { name: string | null; phone: string; state: string | null; email: string | null }
  documents: Doc[]
  events: Event[]
}

const STATUS_OPTIONS = [
  { value: 'IN_PROGRESS',    label: 'In Progress'    },
  { value: 'DOCS_REQUESTED', label: 'Docs Requested' },
  { value: 'READY_TO_FILE',  label: 'Ready to File'  },
  { value: 'COMPLETED',      label: 'Completed'      },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  NEW:             { label: 'New',            color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500'   },
  IN_PROGRESS:     { label: 'In Progress',    color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200',dot: 'bg-indigo-500' },
  DOCS_REQUESTED:  { label: 'Docs Requested', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500'  },
  READY_TO_FILE:   { label: 'Ready to File',  color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',dot: 'bg-purple-500' },
  COMPLETED:       { label: 'Completed',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  dot: 'bg-green-500'  },
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const [c,           setC]           = useState<CaseDetail | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [note,        setNote]        = useState('')
  const [ackNumber,   setAckNumber]   = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [error,       setError]       = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/ca/cases/${id}`)
    if (!res.ok) { setLoading(false); return }
    const data = await res.json()
    setC(data.case)
    setAckNumber(data.case?.ackNumber ?? '')
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  async function callAction(action: string, payload: Record<string, unknown> = {}) {
    setSaving(true); setError('')
    const res = await fetch('/api/ca/case', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id, action, payload }),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Action failed.')
    } else {
      await load()
    }
    setSaving(false)
  }

  async function handleAccept()   { await callAction('accept_case') }
  async function handleComplete() {
    await callAction('mark_complete', {
      ackNumber: ackNumber || undefined,
      message: `Service completed. ${ackNumber ? `Acknowledgement: ${ackNumber}` : ''}`.trim(),
    })
  }
  async function handleStatus(status: string) { await callAction('update_status', { status }) }
  async function handleRequestDocs() {
    if (!note.trim()) return
    await callAction('request_docs', { message: note.trim() })
    setNote('')
  }
  async function handleAddNote() {
    if (!note.trim()) return
    await callAction('add_note', { note: note.trim() })
    setNote('')
  }

  async function handleDownload(doc: Doc) {
    setDownloading(doc.id)
    try {
      const res = await fetch('/api/documents/download-url', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id }),
      })
      const data = await res.json()
      if (data.downloadUrl) {
        const a = document.createElement('a')
        a.href = data.downloadUrl; a.target = '_blank'
        a.download = doc.fileName ?? 'document'; a.click()
      }
    } catch {}
    setDownloading(null)
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-48" />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
      </div>
    </div>
  )

  if (!c) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Case not found.</p>
      <button onClick={() => router.back()} className="text-brand-teal text-sm mt-3 hover:underline">← Go back</button>
    </div>
  )

  const st         = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.NEW
  const isNew      = c.status === 'NEW'
  const isComplete = c.status === 'COMPLETED'
  const customer   = c.customer.name ?? `+91 ${c.customer.phone}`

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex-1">
          <h2 className="font-display font-bold text-lg text-brand-ink">{c.serviceSnapshot.name}</h2>
          <p className="text-xs text-gray-400">{c.orderNumber} · {customer}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${st.bg} ${st.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} /> {st.label}
        </span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: main actions */}
        <div className="lg:col-span-2 space-y-4">

          {/* Accept case */}
          {isNew && (
            <div className="bg-brand-surface border border-brand-teal/20 rounded-2xl p-5 text-center">
              <p className="font-semibold text-brand-teal mb-1">New case available</p>
              <p className="text-sm text-gray-500 mb-4">Accept to start working — customer is notified automatically.</p>
              <button onClick={handleAccept} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-brand-teal text-white font-semibold text-sm rounded-xl hover:bg-brand-teal2 transition-all mx-auto disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Accept Case
              </button>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-sm text-gray-800 mb-3">Documents ({c.documents.length})</h3>
            {c.documents.length === 0 ? (
              <p className="text-sm text-gray-400">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {c.documents.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${doc.status === 'UPLOADED' ? 'bg-green-100' : 'bg-amber-100'}`}>
                      <FileText size={14} className={doc.status === 'UPLOADED' ? 'text-green-600' : 'text-amber-600'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-700">{doc.label}</div>
                      <div className="text-[10px] text-gray-400">
                        {doc.status === 'UPLOADED' ? doc.fileName ?? 'Uploaded' : 'Pending upload'}
                        {doc.fileSizeKb && ` · ${Math.round(doc.fileSizeKb)}KB`}
                      </div>
                    </div>
                    {doc.status === 'UPLOADED' && doc.r2ObjectKey && (
                      <button onClick={() => handleDownload(doc)} disabled={downloading === doc.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-teal hover:bg-white transition-all disabled:opacity-50">
                        {downloading === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status update + actions */}
          {!isNew && !isComplete && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h3 className="font-semibold text-sm text-gray-800">Update Case</h3>

              {/* Status selector */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Change status</label>
                <div className="relative">
                  <select
                    defaultValue={c.status}
                    onChange={e => handleStatus(e.target.value)}
                    disabled={saving}
                    className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors"
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Note / message */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Add note or message to customer</label>
                <textarea
                  rows={2} value={note} onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Please upload Form 16 Part B…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm resize-none bg-white transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={handleRequestDocs} disabled={!note.trim() || saving}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-all disabled:opacity-50">
                  <AlertCircle size={13} /> Request Docs
                </button>
                <button onClick={handleAddNote} disabled={!note.trim() || saving}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:border-brand-teal hover:text-brand-teal transition-all disabled:opacity-50">
                  <Send size={13} /> Add Note
                </button>
              </div>
            </div>
          )}

          {/* Mark complete */}
          {!isNew && !isComplete && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-semibold text-sm text-gray-800">Mark as Complete</h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Acknowledgement number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text" value={ackNumber} onChange={e => setAckNumber(e.target.value)}
                  placeholder="e.g. ITR-V number, Udyam certificate no."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors"
                />
              </div>
              <button onClick={handleComplete} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-green text-white font-semibold text-sm hover:bg-green-700 transition-all disabled:opacity-60 shadow-sm">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                Mark as Complete
              </button>
            </div>
          )}

          {/* Completed state */}
          {isComplete && (
            <div className="bg-green-50 rounded-2xl border border-green-200 p-5 text-center">
              <CheckCircle size={28} className="text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-800">Case Completed</p>
              {c.completedAt && (
                <p className="text-xs text-green-600 mt-1">
                  Completed on {new Date(c.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              {c.ackNumber && <p className="text-xs text-green-700 mt-1 font-medium">Ack: {c.ackNumber}</p>}
            </div>
          )}
        </div>

        {/* Right: info + timeline */}
        <div className="space-y-4">

          {/* Case info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-sm text-gray-800">Case Info</h3>
            {[
              { label: 'Service',    value: c.serviceSnapshot.planName },
              { label: 'Customer',   value: customer },
              { label: 'State',      value: c.customer.state ?? '—' },
              { label: 'Amount',     value: `₹${c.serviceSnapshot.price}` },
              { label: 'Your share', value: `₹${Math.round(c.serviceSnapshot.price * 0.7)}` },
              { label: 'SLA',        value: c.serviceSnapshot.slaLabel },
              { label: 'Due',        value: c.dueBy ? new Date(c.dueBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—' },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-xs">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-700 text-right">{row.value}</span>
              </div>
            ))}
            {c.customer.phone && (
              <a href={`https://wa.me/91${c.customer.phone}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 w-full justify-center py-2.5 rounded-xl bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors mt-2">
                <MessageCircle size={13} /> WhatsApp Customer
              </a>
            )}
          </div>

          {/* Customer notes */}
          {c.customerNotes && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
              <p className="text-xs font-semibold text-amber-800 mb-1">Customer note</p>
              <p className="text-xs text-amber-700">{c.customerNotes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-sm text-gray-800 mb-3">Timeline</h3>
            <div className="space-y-3">
              {c.events.map((ev, i) => (
                <div key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold
                      ${ev.actor === 'CA' ? 'bg-brand-teal text-white' : ev.actor === 'CUSTOMER' ? 'bg-brand-amber text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {ev.actor === 'CA' ? 'CA' : ev.actor === 'CUSTOMER' ? 'C' : 'S'}
                    </div>
                    {i < c.events.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-xs text-gray-700 leading-relaxed">{ev.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(ev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
