'use client'

import { useState } from 'react'
import {
  FileText, Download, Trash2, Search,
  Upload, Lock, FolderOpen, Eye,
  CheckCircle, Clock
} from 'lucide-react'

interface Doc {
  id:       string
  name:     string
  size:     string
  date:     string
  category: string
  orderId?: string
  icon:     'pdf' | 'img'
}

const DOCS: Doc[] = [
  { id: 'd1',  name: 'ITR-V_AY2025-26.pdf',         size: '142 KB', date: '14 Jul 2025', category: 'Income Tax',  orderId: 'ORD-2025-0035', icon: 'pdf' },
  { id: 'd2',  name: 'Computation_Sheet.pdf',        size: '88 KB',  date: '14 Jul 2025', category: 'Income Tax',  orderId: 'ORD-2025-0035', icon: 'pdf' },
  { id: 'd3',  name: 'Form_16_FY2024-25.pdf',        size: '312 KB', date: '5 Jul 2025',  category: 'Income Tax',  icon: 'pdf' },
  { id: 'd4',  name: 'PAN_Card_Ramesh.pdf',           size: '96 KB',  date: '10 Jun 2025', category: 'Identity',    icon: 'pdf' },
  { id: 'd5',  name: 'Aadhaar_Copy.pdf',              size: '104 KB', date: '10 Jun 2025', category: 'Identity',    icon: 'pdf' },
  { id: 'd6',  name: 'PAN_Aadhaar_Link_Confirm.pdf', size: '58 KB',  date: '15 Jul 2025', category: 'Identity',    orderId: 'ORD-2025-0038', icon: 'pdf' },
  { id: 'd7',  name: 'Rent_Agreement_June2025.pdf',   size: '210 KB', date: '1 Jun 2025',  category: 'Legal',       orderId: 'ORD-2025-0030', icon: 'pdf' },
  { id: 'd8',  name: 'Udyam_Certificate.pdf',         size: '180 KB', date: '10 Feb 2025', category: 'Business',    orderId: 'ORD-2025-0025', icon: 'pdf' },
  { id: 'd9',  name: 'Bank_Statement_Jun2025.pdf',    size: '420 KB', date: '30 Jun 2025', category: 'Financial',   icon: 'pdf' },
  { id: 'd10', name: 'Aadhaar_Update_Receipt.pdf',    size: '68 KB',  date: '15 Jan 2025', category: 'Identity',    orderId: 'ORD-2025-0022', icon: 'pdf' },
  { id: 'd11', name: 'Salary_Slip_Jun2025.pdf',       size: '95 KB',  date: '1 Jul 2025',  category: 'Financial',   icon: 'pdf' },
]

const CATEGORIES = ['All', 'Income Tax', 'Identity', 'GST', 'Legal', 'Business', 'Financial']

const CAT_COLORS: Record<string, string> = {
  'Income Tax': 'bg-blue-50 text-blue-600',
  'Identity':   'bg-purple-50 text-purple-600',
  'GST':        'bg-green-50 text-green-600',
  'Legal':      'bg-orange-50 text-orange-600',
  'Business':   'bg-teal-50 text-teal-600',
  'Financial':  'bg-amber-50 text-amber-600',
}

export default function DocumentsPage() {
  const [activeCat, setActiveCat] = useState('All')
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState<Set<string>>(new Set())

  const filtered = DOCS.filter(d => {
    const matchCat    = activeCat === 'All' || d.category === activeCat
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <Lock size={13} className="text-brand-green" />
            AES-256 encrypted · {DOCS.length} files · Stored for lifetime
          </p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal text-white text-sm font-semibold rounded-xl hover:bg-brand-teal2 transition-all shadow-sm cursor-pointer">
          <Upload size={16} />
          Upload Document
          <input type="file" className="hidden" multiple accept=".pdf,.jpg,.png" />
        </label>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total files',     value: DOCS.length,                                                icon: FolderOpen,  color: 'text-brand-teal',  bg: 'bg-brand-surface' },
          { label: 'From services',   value: DOCS.filter(d => d.orderId).length,                         icon: CheckCircle, color: 'text-green-600',   bg: 'bg-green-50' },
          { label: 'Manually added',  value: DOCS.filter(d => !d.orderId).length,                        icon: Upload,      color: 'text-purple-600',  bg: 'bg-purple-50' },
          { label: 'Storage used',    value: '2.1 MB',                                                   icon: Lock,        color: 'text-amber-600',   bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <div className={`font-bold text-xl ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                ${activeCat === cat
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-gray-500 hover:text-brand-teal hover:bg-brand-surface'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-brand-teal transition-all"
          />
        </div>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-brand-teal text-white px-5 py-3 rounded-xl">
          <span className="text-sm font-semibold">{selected.size} selected</span>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 text-sm font-medium hover:text-brand-amber transition-colors">
            <Download size={15} />Download
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium hover:text-red-300 transition-colors">
            <Trash2 size={15} />Delete
          </button>
          <button onClick={() => setSelected(new Set())} className="text-white/60 hover:text-white text-xs">
            Cancel
          </button>
        </div>
      )}

      {/* File grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-1" />
          <div className="col-span-5">File name</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Size</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {filtered.map(doc => {
            const isSelected = selected.has(doc.id)
            return (
              <div
                key={doc.id}
                className={`grid grid-cols-12 gap-4 items-center px-5 py-3.5 transition-colors group
                  ${isSelected ? 'bg-brand-surface' : 'hover:bg-gray-50/60'}`}
              >
                {/* Checkbox */}
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(doc.id)}
                    className="w-4 h-4 rounded accent-brand-teal cursor-pointer"
                  />
                </div>

                {/* Name */}
                <div className="col-span-11 sm:col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                    {doc.orderId && (
                      <p className="text-[10px] text-gray-400 font-mono">{doc.orderId}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="hidden sm:block col-span-2">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${CAT_COLORS[doc.category] ?? 'bg-gray-100 text-gray-500'}`}>
                    {doc.category}
                  </span>
                </div>

                {/* Date */}
                <div className="hidden sm:block col-span-2">
                  <span className="text-xs text-gray-400">{doc.date}</span>
                </div>

                {/* Size */}
                <div className="hidden sm:block col-span-1">
                  <span className="text-xs text-gray-400">{doc.size}</span>
                </div>

                {/* Actions */}
                <div className="hidden sm:flex col-span-1 items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all">
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-brand-teal hover:bg-brand-surface transition-all">
                    <Download size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <FolderOpen size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No documents found</p>
            <p className="text-gray-400 text-xs mt-1">Try a different category or search term.</p>
          </div>
        )}
      </div>

      {/* Upload hint */}
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center hover:border-brand-teal/40 transition-colors">
        <Upload size={24} className="text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-500">Drag & drop files here</p>
        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 10 MB per file</p>
        <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-brand-surface border border-brand-teal/20 text-brand-teal text-xs font-semibold rounded-xl cursor-pointer hover:bg-brand-teal hover:text-white transition-all">
          <Upload size={13} />
          Browse files
          <input type="file" className="hidden" multiple accept=".pdf,.jpg,.png" />
        </label>
      </div>
    </div>
  )
}
