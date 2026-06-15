// ── CA Portal — data types & mock data ────────────────────────────
// Replace with DB-backed queries once Prisma/Drizzle models exist.
// Keyed by the same order/service vocabulary as lib/allServices.ts

export type CaseStatus = 'new' | 'in_progress' | 'docs_requested' | 'ready_to_file' | 'completed'
export type Priority   = 'high' | 'normal'

export interface CaseDoc {
  id:       string
  name:     string
  size:     string
  required: boolean
  uploaded: boolean
}

export interface TimelineEvent {
  time:  string
  event: string
  actor: 'system' | 'ca' | 'customer'
}

export interface CACase {
  id:           string
  orderId:      string
  service:      string
  category:     string
  emoji:        string
  customerName: string
  customerCity: string
  customerPhone:string
  status:       CaseStatus
  priority:     Priority
  price:        number
  caShare:      number          // ₹ — CA's payout for this case
  assignedAt:   string
  dueBy:        string
  slaLabel:     string
  docs:         CaseDoc[]
  notes:        string
  customerNote?: string
  timeline:     TimelineEvent[]
  ackNo?:       string
}

export interface CAProfile {
  name:            string
  icaiNumber:      string
  email:           string
  phone:           string
  city:            string
  rating:          number
  totalReviews:    number
  totalCases:      number
  completedCases:  number
  memberSince:     string
  verified:        boolean
  available:       boolean
  specializations: string[]
  bankAccount:     string
  bankIfsc:        string
  upiId:           string
}

export interface PayoutRecord {
  id:       string
  period:   string
  amount:   number
  cases:    number
  status:   'paid' | 'processing' | 'upcoming'
  date:     string
}

// ── CA Profile ──────────────────────────────────────────────────────
export const CA_PROFILE: CAProfile = {
  name:           'CA Priya Mehta',
  icaiNumber:     'ICAI-MEM-487213',
  email:          'priya.mehta@jansamaadhan.in',
  phone:          '+91 98200 11223',
  city:           'Ahmedabad, Gujarat',
  rating:         4.9,
  totalReviews:   312,
  totalCases:     486,
  completedCases: 471,
  memberSince:    'Feb 2025',
  verified:       true,
  available:      true,
  specializations: ['Income Tax', 'GST', 'TDS', 'Capital Gains'],
  bankAccount:    '••••  ••••  4821',
  bankIfsc:       'HDFC0001234',
  upiId:          'priya.mehta@upi',
}

// ── Case Queue ──────────────────────────────────────────────────────
export const CA_CASES: CACase[] = [
  {
    id: 'CASE-9001', orderId: 'ORD-2026-001', service: 'ITR-2 Filing', category: 'Income Tax', emoji: '📄',
    customerName: 'Ramesh Kumar', customerCity: 'Surat, Gujarat', customerPhone: '+91 98765 43210',
    status: 'in_progress', priority: 'high', price: 299, caShare: 180,
    assignedAt: '12 Jun 2026, 10:30 AM', dueBy: 'Today, 6:00 PM', slaLabel: '48 hrs',
    docs: [
      { id: 'd1', name: 'Form_16_FY2025-26.pdf',  size: '312 KB', required: true,  uploaded: true },
      { id: 'd2', name: 'Broker_PL_Zerodha.pdf',  size: '180 KB', required: true,  uploaded: true },
      { id: 'd3', name: 'Aadhaar_Card.pdf',        size: '96 KB',  required: true,  uploaded: true },
      { id: 'd4', name: 'Bank_Statement.pdf',      size: '420 KB', required: true,  uploaded: false },
    ],
    notes: 'Customer has capital gains from Zerodha (equity + 2 mutual fund redemptions). Check indexation for debt funds bought before Apr 2023.',
    customerNote: 'I also sold some gold ETF units in Feb — let me know if that needs separate reporting.',
    timeline: [
      { time: '12 Jun, 10:30 AM', event: 'Case assigned to you', actor: 'system' },
      { time: '12 Jun, 11:15 AM', event: 'Documents reviewed — bank statement missing', actor: 'ca' },
      { time: '12 Jun, 11:20 AM', event: 'Requested bank statement from customer', actor: 'ca' },
      { time: '13 Jun, 9:05 AM',  event: 'Customer replied — uploading shortly', actor: 'customer' },
    ],
  },
  {
    id: 'CASE-9002', orderId: 'ORD-2026-002', service: 'GST Registration', category: 'GST', emoji: '🏢',
    customerName: 'Sunita Patel', customerCity: 'Vadodara, Gujarat', customerPhone: '+91 98250 11098',
    status: 'docs_requested', priority: 'high', price: 499, caShare: 280,
    assignedAt: '13 Jun 2026, 9:10 AM', dueBy: 'Tomorrow, 12:00 PM', slaLabel: '6 hrs',
    docs: [
      { id: 'd1', name: 'PAN_Card.pdf',            size: '88 KB',  required: true,  uploaded: true },
      { id: 'd2', name: 'Aadhaar_Card.pdf',        size: '104 KB', required: true,  uploaded: true },
      { id: 'd3', name: 'Passport_Photo.jpg',      size: '210 KB', required: true,  uploaded: true },
      { id: 'd4', name: 'Address_Proof.pdf',       size: '—',      required: true,  uploaded: false },
      { id: 'd5', name: 'Cancelled_Cheque.pdf',    size: '—',      required: true,  uploaded: false },
    ],
    notes: 'New proprietorship — textile trading. Awaiting electricity bill and cancelled cheque before ARN can be filed.',
    timeline: [
      { time: '13 Jun, 9:10 AM', event: 'Case assigned to you', actor: 'system' },
      { time: '13 Jun, 9:45 AM', event: 'Requested electricity bill & cancelled cheque', actor: 'ca' },
    ],
  },
  {
    id: 'CASE-9003', orderId: 'ORD-2026-003', service: 'PAN–Aadhaar Linking', category: 'Identity', emoji: '🔗',
    customerName: 'Mohan Verma', customerCity: 'Pune, Maharashtra', customerPhone: '+91 99230 44556',
    status: 'new', priority: 'normal', price: 49, caShare: 25,
    assignedAt: '14 Jun 2026, 8:05 AM', dueBy: 'Today, 9:05 AM', slaLabel: '1 hr',
    docs: [
      { id: 'd1', name: 'PAN_Number — ABCPV1234D',  size: '—', required: true, uploaded: true },
      { id: 'd2', name: 'Aadhaar_Number — provided', size: '—', required: true, uploaded: true },
    ],
    notes: 'Auto-eligible for instant linking — name & DOB match across PAN and Aadhaar. No CA action needed beyond final confirmation.',
    timeline: [
      { time: '14 Jun, 8:05 AM', event: 'Case assigned to you', actor: 'system' },
    ],
  },
  {
    id: 'CASE-9004', orderId: 'ORD-2026-004', service: 'GSTR-3B Filing', category: 'GST', emoji: '📋',
    customerName: 'Suresh Auto Parts', customerCity: 'Rajkot, Gujarat', customerPhone: '+91 90990 12233',
    status: 'ready_to_file', priority: 'normal', price: 299, caShare: 170,
    assignedAt: '11 Jun 2026, 4:20 PM', dueBy: '20 Jun 2026', slaLabel: 'Same day',
    docs: [
      { id: 'd1', name: 'Sales_Register_May2026.xlsx', size: '88 KB',  required: true, uploaded: true },
      { id: 'd2', name: 'Purchase_Register_May2026.xlsx', size: '76 KB', required: true, uploaded: true },
      { id: 'd3', name: 'GSTR-2B_May2026.pdf',       size: '142 KB', required: true, uploaded: true },
    ],
    notes: 'ITC reconciled against GSTR-2B — ₹1,240 mismatch flagged, within tolerance. Ready to file once you confirm liability figure.',
    timeline: [
      { time: '11 Jun, 4:20 PM', event: 'Case assigned to you', actor: 'system' },
      { time: '12 Jun, 10:00 AM', event: 'All documents verified', actor: 'ca' },
      { time: '12 Jun, 10:40 AM', event: 'ITC reconciliation completed', actor: 'ca' },
    ],
  },
  {
    id: 'CASE-9005', orderId: 'ORD-2026-005', service: 'Rent Agreement', category: 'Legal', emoji: '📋',
    customerName: 'Anita Joshi', customerCity: 'Nagpur, Maharashtra', customerPhone: '+91 96543 22110',
    status: 'in_progress', priority: 'normal', price: 299, caShare: 150,
    assignedAt: '14 Jun 2026, 7:30 AM', dueBy: 'Today, 9:30 AM', slaLabel: '2 hrs',
    docs: [
      { id: 'd1', name: 'Owner_Aadhaar.pdf',  size: '102 KB', required: true, uploaded: true },
      { id: 'd2', name: 'Tenant_Aadhaar.pdf', size: '98 KB',  required: true, uploaded: true },
    ],
    notes: 'Standard 11-month agreement — Nagpur, ₹14,000/month, ₹28,000 deposit. Draft from template, confirm clauses for maintenance split.',
    timeline: [
      { time: '14 Jun, 7:30 AM', event: 'Case assigned to you', actor: 'system' },
      { time: '14 Jun, 7:40 AM', event: 'Drafting agreement', actor: 'ca' },
    ],
  },
  {
    id: 'CASE-9006', orderId: 'ORD-2026-006', service: 'ITR-1 Filing', category: 'Income Tax', emoji: '📄',
    customerName: 'Geeta Ben Shah', customerCity: 'Ahmedabad, Gujarat', customerPhone: '+91 97231 98765',
    status: 'completed', priority: 'normal', price: 99, caShare: 60,
    assignedAt: '8 Jun 2026, 11:00 AM', dueBy: '10 Jun 2026', slaLabel: '24 hrs',
    ackNo: 'ITR-V-2026-114502',
    docs: [
      { id: 'd1', name: 'Form_16.pdf',     size: '288 KB', required: true, uploaded: true },
      { id: 'd2', name: 'Aadhaar_Card.pdf', size: '90 KB',  required: true, uploaded: true },
      { id: 'd3', name: 'PAN_Card.pdf',    size: '84 KB',  required: true, uploaded: true },
    ],
    notes: 'Filed without issues. Refund of ₹4,120 expected.',
    timeline: [
      { time: '8 Jun, 11:00 AM', event: 'Case assigned to you', actor: 'system' },
      { time: '8 Jun, 2:30 PM',  event: 'ITR filed on IT portal', actor: 'ca' },
      { time: '8 Jun, 2:35 PM',  event: 'Acknowledgement (ITR-V) sent to customer', actor: 'ca' },
      { time: '8 Jun, 2:35 PM',  event: 'Marked completed', actor: 'ca' },
    ],
  },
  {
    id: 'CASE-9007', orderId: 'ORD-2026-007', service: 'MSME / Udyam Reg.', category: 'Business', emoji: '🏭',
    customerName: 'Deepak Sharma', customerCity: 'Indore, Madhya Pradesh', customerPhone: '+91 94250 55667',
    status: 'completed', priority: 'normal', price: 299, caShare: 160,
    assignedAt: '5 Jun 2026, 3:00 PM', dueBy: '5 Jun 2026', slaLabel: '2 hrs',
    ackNo: 'UDYAM-MP-09-0042871',
    docs: [
      { id: 'd1', name: 'Aadhaar_Card.pdf', size: '92 KB', required: true, uploaded: true },
      { id: 'd2', name: 'PAN_Card.pdf',     size: '80 KB', required: true, uploaded: true },
    ],
    notes: 'Udyam certificate issued same-day.',
    timeline: [
      { time: '5 Jun, 3:00 PM', event: 'Case assigned to you', actor: 'system' },
      { time: '5 Jun, 4:10 PM', event: 'Udyam certificate issued', actor: 'ca' },
      { time: '5 Jun, 4:12 PM', event: 'Marked completed', actor: 'ca' },
    ],
  },
  {
    id: 'CASE-9008', orderId: 'ORD-2026-008', service: 'Tax Notice Reply', category: 'Income Tax', emoji: '⚠️',
    customerName: 'Vijay Mehta', customerCity: 'Jaipur, Rajasthan', customerPhone: '+91 93140 77889',
    status: 'docs_requested', priority: 'high', price: 599, caShare: 360,
    assignedAt: '13 Jun 2026, 2:00 PM', dueBy: '18 Jun 2026', slaLabel: '5 days',
    docs: [
      { id: 'd1', name: 'Notice_143(1).pdf',  size: '210 KB', required: true, uploaded: true },
      { id: 'd2', name: 'ITR_Filed_Copy.pdf', size: '180 KB', required: true, uploaded: true },
      { id: 'd3', name: 'Form_26AS.pdf',      size: '—',      required: true, uploaded: false },
    ],
    notes: '143(1) intimation — demand of ₹8,400 raised due to TDS mismatch. Need Form 26AS to verify TDS credit before drafting response.',
    customerNote: 'This is the first time I am getting such a notice, please guide me on what to do.',
    timeline: [
      { time: '13 Jun, 2:00 PM', event: 'Case assigned to you', actor: 'system' },
      { time: '13 Jun, 2:45 PM', event: 'Notice reviewed — TDS mismatch identified', actor: 'ca' },
      { time: '13 Jun, 2:50 PM', event: 'Requested Form 26AS from customer', actor: 'ca' },
    ],
  },
]

// ── Earnings ────────────────────────────────────────────────────────
export const PAYOUTS: PayoutRecord[] = [
  { id: 'PAY-2026-05', period: 'May 2026', amount: 18420, cases: 41, status: 'paid',       date: '5 Jun 2026' },
  { id: 'PAY-2026-04', period: 'Apr 2026', amount: 21150, cases: 47, status: 'paid',       date: '5 May 2026' },
  { id: 'PAY-2026-03', period: 'Mar 2026', amount: 19880, cases: 44, status: 'paid',       date: '5 Apr 2026' },
  { id: 'PAY-2026-06', period: 'Jun 2026', amount: 8260,  cases: 18, status: 'processing', date: 'Payable 5 Jul 2026' },
  { id: 'PAY-2026-07', period: 'Jul 2026', amount: 0,     cases: 0,  status: 'upcoming',   date: 'Payable 5 Aug 2026' },
]

// ── Helpers ─────────────────────────────────────────────────────────
export function getCaseById(id: string): CACase | undefined {
  return CA_CASES.find(c => c.id === id || c.orderId === id)
}

export function getCasesByStatus(status: CaseStatus | 'all'): CACase[] {
  if (status === 'all') return CA_CASES
  return CA_CASES.filter(c => c.status === status)
}

export const STATUS_META: Record<CaseStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  new:            { label: 'New',              color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  in_progress:    { label: 'In Progress',      color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-500' },
  docs_requested: { label: 'Docs Requested',   color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-500' },
  ready_to_file:  { label: 'Ready to File',    color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
  completed:      { label: 'Completed',        color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
}