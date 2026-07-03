'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react'

interface Doc {
  id:          string
  docKey:      string
  label:       string
  status:      string
  fileName:    string | null
  fileSizeKb:  number | null
  mimeType:    string | null
  uploadedAt:  string | null
  orderId:     string
  orderNumber: string
  serviceName: string
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  UPLOADED: <CheckCircle size={14} className="text-green-500" />,
  PENDING:  <Clock size={14} className="text-amber-500" />,
  REJECTED: <AlertCircle size={14} className="text-red-500" />,
}

const STATUS_LABEL: Record<string, string> = {
  UPLOADED: 'Uploaded',
  PENDING:  'Pending',
  REJECTED: 'Rejected',
}

export default function DocumentsPage() {
  const [docs,    setDocs]    = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/documents/list')
      .then(r => r.json())
      .then(data => { setDocs(data.documents ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleDownload(docId: string, fileName: string | null) {
    setDownloading(docId)
    try {
      const res = await fetch('/api/documents/download-url', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId }),
      })
      const data = await res.json()
      if (data.downloadUrl) {
        const a = document.createElement('a')
        a.href = data.downloadUrl
        a.download = fileName ?? 'document'
        a.target = '_blank'
        a.click()
      }
    } catch {}
    setDownloading(null)
  }

  const uploaded = docs.filter(d => d.status === 'UPLOADED')
  const pending  = docs.filter(d => d.status === 'PENDING')
  const rejected = docs.filter(d => d.status === 'REJECTED')

  return (
    <div className="space-y-6">

      <div>
        <h2 className="font-display font-bold text-xl text-brand-ink">Document Vault</h2>
        <p className="text-sm text-gray-500 mt-0.5">All documents uploaded across your orders — AES-256 encrypted.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-32" />
            </div>
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="text-4xl mb-4">📁</div>
          <p className="font-semibold text-gray-700 mb-1">No documents yet</p>
          <p className="text-sm text-gray-400">Documents you upload for your orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Uploaded',  value: uploaded.length,  color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
              { label: 'Pending',   value: pending.length,   color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
              { label: 'Rejected',  value: rejected.length,  color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-100'   },
            ].map(s => (
              <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-4 text-center`}>
                <div className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Document list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {docs.map((doc, i) => (
              <div key={doc.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < docs.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${doc.status === 'UPLOADED' ? 'bg-green-50' : doc.status === 'REJECTED' ? 'bg-red-50' : 'bg-amber-50'}`}>
                  <FileText size={18} className={doc.status === 'UPLOADED' ? 'text-green-500' : doc.status === 'REJECTED' ? 'text-red-500' : 'text-amber-500'} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-800 truncate">{doc.label}</span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                      {STATUS_ICON[doc.status]} {STATUS_LABEL[doc.status]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {doc.serviceName} · {doc.orderNumber}
                    {doc.fileName && ` · ${doc.fileName}`}
                    {doc.fileSizeKb && ` · ${Math.round(doc.fileSizeKb)}KB`}
                    {doc.uploadedAt && ` · ${new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                  </div>
                  {doc.status === 'REJECTED' && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-red-600">Rejected — please re-upload</span>
                      <button className="text-[11px] font-semibold text-brand-teal hover:underline flex items-center gap-1">
                        <Upload size={11} /> Upload again
                      </button>
                    </div>
                  )}
                </div>

                {doc.status === 'UPLOADED' && (
                  <button
                    onClick={() => handleDownload(doc.id, doc.fileName)}
                    disabled={downloading === doc.id}
                    className="p-2 rounded-xl text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all disabled:opacity-50"
                    title="Download"
                  >
                    {downloading === doc.id
                      ? <span className="text-[10px]">…</span>
                      : <Download size={15} />
                    }
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
