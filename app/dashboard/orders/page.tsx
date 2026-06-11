'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText, ChevronRight, Download, MessageSquare,
  CheckCircle, Clock, AlertCircle, Search, Filter,
  ArrowUpRight, RotateCcw, X
} from 'lucide-react'

type OrderStatus = 'in_progress' | 'completed' | 'action_needed' | 'pending'

interface Order {
  id:        string
  service:   string
  category:  string
  status:    OrderStatus
  price:     string
  caName?:   string
  caRating?: number
  updatedAt: string
  createdAt: string
  dueBy?:    string
  ackNo?:    string
  docs?:     string[]
  timeline?: { time: string; event: string; done: boolean }[]
}

const ALL_ORDERS: Order[] = [
  {
    id: 'ORD-2025-0041', service: 'ITR-2 Filing', category: 'Income Tax',
    status: 'action_needed', price: '₹299', caName: 'CA Priya Mehta', caRating: 4.9,
    updatedAt: '2 hours ago', createdAt: '18 Jul 2025', dueBy: 'Today, 6 PM',
    docs: ['Form_16.pdf'],
    timeline: [
      { time: '10:00 AM', event: 'Order placed', done: true },
      { time: '10:30 AM', event: 'CA Priya Mehta assigned', done: true },
      { time: '11:15 AM', event: 'Documents reviewed', done: true },
      { time: '—', event: 'Awaiting missing Form 26AS from you', done: false },
      { time: '—', event: 'Filing on IT portal', done: false },
      { time: '—', event: 'ITR-V sent to your email', done: false },
    ],
  },
  {
    id: 'ORD-2025-0040', service: 'GST Registration', category: 'GST',
    status: 'in_progress', price: '₹499', caName: 'CA Ravi Shah', caRating: 4.8,
    updatedAt: '5 hours ago', createdAt: '18 Jul 2025', dueBy: 'Tomorrow, 12 PM',
    docs: ['Aadhaar.pdf', 'PAN.pdf', 'Address_Proof.pdf'],
    timeline: [
      { time: '9:00 AM',  event: 'Order placed', done: true },
      { time: '9:20 AM',  event: 'CA Ravi Shah assigned', done: true },
      { time: '10:00 AM', event: 'Documents verified', done: true },
      { time: '11:30 AM', event: 'Application submitted on GSTN', done: true },
      { time: '—',        event: 'ARN received from GSTN', done: false },
      { time: '—',        event: 'GSTIN issued & delivered', done: false },
    ],
  },
  {
    id: 'ORD-2025-0038', service: 'PAN–Aadhaar Linking', category: 'Identity',
    status: 'completed', price: '₹49',
    updatedAt: '3 days ago', createdAt: '15 Jul 2025',
    ackNo: 'ACK-2025-PAN-88432',
    docs: ['PAN_Link_Confirmation.pdf'],
    timeline: [
      { time: '2:00 PM', event: 'Order placed', done: true },
      { time: '2:05 PM', event: 'Auto-processed on IT portal', done: true },
      { time: '2:10 PM', event: 'Linking confirmed', done: true },
      { time: '2:12 PM', event: 'Acknowledgement delivered', done: true },
    ],
  },
  {
    id: 'ORD-2025-0035', service: 'ITR-1 Filing', category: 'Income Tax',
    status: 'completed', price: '₹99', caName: 'CA Priya Mehta', caRating: 4.9,
    updatedAt: '2 weeks ago', createdAt: '5 Jul 2025',
    ackNo: 'ITR-V-2025-007731',
    docs: ['ITR-V_AY2025-26.pdf', 'Computation_Sheet.pdf'],
  },
  {
    id: 'ORD-2025-0030', service: 'Rent Agreement', category: 'Legal',
    status: 'completed', price: '₹299',
    updatedAt: '1 month ago', createdAt: '12 Mar 2025',
    ackNo: 'DOC-RA-20250312',
    docs: ['Rent_Agreement_Signed.pdf'],
  },
  {
    id: 'ORD-2025-0025', service: 'MSME / Udyam Registration', category: 'Business',
    status: 'completed', price: '₹299',
    updatedAt: '2 months ago', createdAt: '10 Feb 2025',
    ackNo: 'UDYAM-GJ-12-0089732',
    docs: ['Udyam_Certificate.pdf'],
  },
  {
    id: 'ORD-2025-0022', service: 'Aadhaar Address Update', category: 'Identity',
    status: 'completed', price: '₹99',
    updatedAt: '3 months ago', createdAt: '15 Jan 2025',
    docs: ['Aadhaar_Update_Receipt.pdf'],
  },
]

const STATUS_CFG: Record<OrderStatus, { label: string; textColor: string; dotColor: string; bg: string; borderColor: string }> = {
  action_needed: { label: 'Action needed', textColor: 'text-red-600',   dotColor: 'bg-red-500',   bg: 'bg-red-50',   borderColor: 'border-red-200' },
  in_progress:   { label: 'In progress',   textColor: 'text-blue-600',  dotColor: 'bg-blue-500',  bg: 'bg-blue-50',  borderColor: 'border-blue-200' },
  completed:     { label: 'Completed',     textColor: 'text-green-600', dotColor: 'bg-green-500', bg: 'bg-green-50', borderColor: 'border-green-200' },
  pending:       { label: 'Pending',       textColor: 'text-amber-600', dotColor: 'bg-amber-500', bg: 'bg-amber-50', borderColor: 'border-amber-200' },
}

const FILTER_TABS = [
  { id: 'all',           label: 'All orders' },
  { id: 'action_needed', label: 'Action needed' },
  { id: 'in_progress',   label: 'In progress' },
  { id: 'completed',     label: 'Completed' },
]

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_CFG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border ${c.bg} ${c.textColor} ${c.borderColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dotColor} ${status === 'in_progress' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  )
}

export default function OrdersPage() {
  const [filter,      setFilter]      = useState<string>('all')
  const [search,      setSearch]      = useState('')
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  const filtered = ALL_ORDERS.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.service.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.category.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Track all your service requests and their status.</p>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status filter tabs */}
        <div className="flex gap-1.5 bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                ${filter === tab.id
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-gray-500 hover:text-brand-teal hover:bg-brand-surface'
                }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {tab.id === 'all'
                  ? ALL_ORDERS.length
                  : ALL_ORDERS.filter(o => o.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-brand-teal focus:shadow-sm focus:shadow-brand-teal/10 transition-all"
          />
        </div>
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No orders found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(order => (
              <div
                key={order.id}
                onClick={() => setActiveOrder(order)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${order.status === 'completed' ? 'bg-green-50' : 'bg-brand-surface'}`}>
                  {order.status === 'completed'
                    ? <CheckCircle size={18} className="text-green-500" />
                    : order.status === 'action_needed'
                      ? <AlertCircle size={18} className="text-red-500" />
                      : <Clock size={18} className="text-brand-teal" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800">{order.service}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 font-mono">{order.id}</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400">{order.createdAt}</span>
                    {order.caName && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">{order.caName}</span>
                      </>
                    )}
                  </div>
                  {order.ackNo && (
                    <p className="text-[11px] text-green-600 font-mono mt-0.5">{order.ackNo}</p>
                  )}
                  {order.status === 'action_needed' && order.dueBy && (
                    <p className="text-[11px] text-red-500 font-semibold mt-0.5">Due: {order.dueBy}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-700">{order.price}</span>
                  <span className="text-[11px] text-gray-400">{order.updatedAt}</span>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-teal transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Order detail drawer ── */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveOrder(null)} />

          {/* Drawer */}
          <div className="relative z-10 w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{activeOrder.service}</h3>
                <p className="text-xs text-gray-400 font-mono">{activeOrder.id}</p>
              </div>
              <button onClick={() => setActiveOrder(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 px-5 py-5 space-y-6">
              {/* Status + meta */}
              <div className="flex items-center justify-between">
                <StatusBadge status={activeOrder.status} />
                <span className="text-sm font-bold text-gray-700">{activeOrder.price}</span>
              </div>

              {/* Action needed banner */}
              {activeOrder.status === 'action_needed' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 mb-1">Action required from you</p>
                  <p className="text-xs text-red-500">Your CA is waiting for Form 26AS. Please upload it to continue.</p>
                  <button className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors">
                    Upload Document
                  </button>
                </div>
              )}

              {/* CA details */}
              {activeOrder.caName && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Assigned CA</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center text-white font-bold text-sm">
                      {activeOrder.caName.split(' ').pop()?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{activeOrder.caName}</p>
                      <p className="text-xs text-gray-400">⭐ {activeOrder.caRating} · ICAI Verified</p>
                    </div>
                    <button className="ml-auto p-2 rounded-lg bg-white border border-gray-200 text-brand-teal hover:bg-brand-surface transition-colors">
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Progress timeline */}
              {activeOrder.timeline && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Progress</p>
                  <div className="space-y-0">
                    {activeOrder.timeline.map((step, i) => {
                      const isLast = i === activeOrder.timeline!.length - 1
                      return (
                        <div key={i} className="flex gap-3 relative">
                          <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10
                              ${step.done ? 'bg-brand-green' : 'bg-gray-200'}`}>
                              {step.done
                                ? <CheckCircle size={13} className="text-white" />
                                : <div className="w-2 h-2 rounded-full bg-gray-400" />
                              }
                            </div>
                            {!isLast && <div className={`w-px flex-1 my-1 ${step.done ? 'bg-brand-green/30' : 'bg-gray-200'}`} />}
                          </div>
                          <div className="pb-4 pt-0.5">
                            <p className={`text-sm font-medium ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.event}</p>
                            {step.time !== '—' && <p className="text-[11px] text-gray-400">{step.time}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Documents */}
              {activeOrder.docs && activeOrder.docs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Documents</p>
                  <div className="space-y-2">
                    {activeOrder.docs.map(doc => (
                      <div key={doc} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-brand-surface transition-colors group">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-red-400" />
                        </div>
                        <span className="flex-1 text-sm text-gray-700 truncate">{doc}</span>
                        <button className="text-gray-300 group-hover:text-brand-teal transition-colors">
                          <Download size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ack number */}
              {activeOrder.ackNo && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-700 mb-1">Acknowledgement number</p>
                  <p className="text-sm font-mono font-bold text-green-800">{activeOrder.ackNo}</p>
                </div>
              )}
            </div>

            {/* Drawer footer actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
              {activeOrder.status === 'completed' ? (
                <>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal2 transition-colors">
                    <Download size={15} />
                    Download all
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-brand-teal hover:text-brand-teal transition-colors">
                    <RotateCcw size={15} />
                    Refile
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal2 transition-colors">
                    <MessageSquare size={15} />
                    Message CA
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-brand-teal hover:text-brand-teal transition-colors">
                    <ArrowUpRight size={15} />
                    Track
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
