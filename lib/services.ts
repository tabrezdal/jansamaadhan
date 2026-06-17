
export type ServiceCategory =
  | 'income-tax' | 'gst' | 'identity' | 'govt'
  | 'business' | 'accounting' | 'legal' | 'loans' | 'insurance'

export interface ServicePlan {
  id:    string
  name:  string
  price: number
  desc:  string
  includes: string[]
}

export interface DocRequired {
  id:       string
  label:    string
  hint:     string
  required: boolean
  example?: string
}

export interface Service {
  slug:        string
  name:        string
  nameHindi:   string
  category:    ServiceCategory
  emoji:       string
  tagline:     string
  agentPrice:  string
  sla:         string
  caRequired:  boolean
  plans:       ServicePlan[]
  docsNeeded:  DocRequired[]
  faqs:        { q: string; a: string }[]
  popular?:    boolean
  phase:       1 | 2 | 3
}

export const SERVICES: Record<string, Service> = {

  'itr-1': {
    slug: 'itr-1', name: 'ITR-1 Filing', nameHindi: 'ITR-1 दाखिल करें',
    category: 'income-tax', emoji: '📄', sla: '24 hours',
    tagline: 'For salaried employees with a single Form-16. The most common ITR in India.',
    agentPrice: '₹500–₹1,500', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'basic',    name: 'Basic',    price: 99,  desc: 'Salary + 1 house property + bank interest', includes: ['ITR-1 filing', 'Acknowledgement (ITR-V)', 'Email support'] },
      { id: 'assisted', name: 'Assisted', price: 199, desc: 'All Basic + CA reviews your return before filing', includes: ['Everything in Basic', 'CA review call', 'Tax saving tips', 'Priority support'] },
    ],
    docsNeeded: [
      { id: 'form16',   label: 'Form 16',          hint: 'From your employer — Part A and Part B', required: true,  example: 'PDF from HR / payroll portal' },
      { id: 'aadhaar',  label: 'Aadhaar Card',      hint: 'Front side, clearly visible',            required: true,  example: 'JPG, PNG or PDF' },
      { id: 'pan',      label: 'PAN Card',           hint: 'Your PAN number is sufficient',          required: true,  example: 'JPG, PNG or PDF' },
      { id: 'bank',     label: 'Bank Statement',     hint: 'April–March of relevant financial year', required: false, example: 'PDF from your bank app' },
    ],
    faqs: [
      { q: 'Who should file ITR-1?', a: 'Salaried individuals with income up to ₹50L, one house property, and no capital gains.' },
      { q: 'What is the deadline?',  a: '31 July of each year for non-audit cases. Late filing attracts ₹1,000–₹5,000 penalty.' },
      { q: 'Will I get a refund?',   a: 'If TDS deducted exceeds your tax liability, the excess is refunded to your bank account in 3–6 weeks.' },
    ],
  },

  'itr-2': {
    slug: 'itr-2', name: 'ITR-2 Filing', nameHindi: 'ITR-2 दाखिल करें',
    category: 'income-tax', emoji: '📄', sla: '48 hours',
    tagline: 'For individuals with capital gains, multiple properties, or foreign income.',
    agentPrice: '₹999–₹2,000', caRequired: true, popular: true, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 299, desc: 'Capital gains, FD interest, 2 properties', includes: ['ITR-2 filing', 'Capital gains computation', 'Acknowledgement', 'Email support'] },
      { id: 'premium',  name: 'Premium',  price: 499, desc: 'Complex — foreign income, ESOP, multiple brokers', includes: ['Everything in Standard', 'Dedicated CA', 'Tax optimisation review', 'Priority turnaround'] },
    ],
    docsNeeded: [
      { id: 'form16',   label: 'Form 16',             hint: 'From employer',                      required: true  },
      { id: 'brokerpl', label: 'Broker P&L Statement', hint: 'From Zerodha / Groww / ICICI etc.', required: true,  example: 'Download from your broker portal' },
      { id: 'aadhaar',  label: 'Aadhaar Card',         hint: 'Front side',                         required: true  },
      { id: 'pan',      label: 'PAN Card',              hint: 'Clear scan',                         required: true  },
      { id: 'bank',     label: 'Bank Statements',       hint: 'All accounts, full year',            required: true  },
      { id: 'prop',     label: 'Property details',      hint: 'Rental income / loan interest',      required: false },
    ],
    faqs: [
      { q: 'I have stocks — do I need ITR-2?', a: 'Yes, if you sold shares or mutual funds during the year you need ITR-2 to report capital gains.' },
      { q: 'What if I have a home loan?',      a: 'Home loan interest and principal deductions can reduce your tax. Include your loan statement.' },
    ],
  },

  'pan-aadhaar-link': {
    slug: 'pan-aadhaar-link', name: 'PAN–Aadhaar Linking', nameHindi: 'PAN-Aadhaar लिंक',
    category: 'identity', emoji: '🔗', sla: '1 hour',
    tagline: 'Link your PAN card with Aadhaar to avoid tax deduction at higher rates.',
    agentPrice: '₹150–₹400', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 49, desc: 'Guided linking + error resolution if mismatch', includes: ['Step-by-step guidance', 'Mismatch resolution', 'Confirmation screenshot', 'WhatsApp support'] },
    ],
    docsNeeded: [
      { id: 'pan',     label: 'PAN Number',       hint: '10-digit PAN (e.g. ABCDE1234F)',     required: true },
      { id: 'aadhaar', label: 'Aadhaar Number',   hint: '12-digit Aadhaar number',             required: true },
      { id: 'dob',     label: 'Date of Birth',    hint: 'As on PAN and Aadhaar — must match', required: true },
    ],
    faqs: [
      { q: 'Is PAN-Aadhaar linking mandatory?', a: 'Yes. Unlinked PANs become inoperative, attracting 20% TDS on all deductions.' },
      { q: 'What if name or DOB doesn\'t match?', a: 'We handle mismatch corrections too — just select the Assisted plan and our team will guide you.' },
    ],
  },

  'gst-registration': {
    slug: 'gst-registration', name: 'GST Registration', nameHindi: 'GST पंजीकरण',
    category: 'gst', emoji: '🏢', sla: '6 hours',
    tagline: 'Get your GSTIN. Required if your annual turnover exceeds ₹20L (₹10L in special states).',
    agentPrice: '₹1,500–₹3,000', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 499, desc: 'New GST registration for individuals and businesses', includes: ['GSTIN application', 'ARN tracking', 'Certificate download', 'Email support'] },
      { id: 'express',  name: 'Express',  price: 699, desc: 'Same-day processing + CA guidance on GST compliance', includes: ['Everything in Standard', 'Same-day filing', 'GST compliance guide', 'Priority support'] },
    ],
    docsNeeded: [
      { id: 'pan',       label: 'PAN Card',               hint: 'Business owner / proprietor PAN',     required: true  },
      { id: 'aadhaar',   label: 'Aadhaar Card',            hint: 'Proprietor / director Aadhaar',       required: true  },
      { id: 'photo',     label: 'Passport size photo',     hint: 'White background, clear face',        required: true  },
      { id: 'address',   label: 'Business address proof',  hint: 'Electricity bill / rent agreement',   required: true,  example: 'Utility bill < 3 months old' },
      { id: 'bank',      label: 'Cancelled cheque',        hint: 'Bank account in business name',       required: true  },
      { id: 'nocowner',  label: 'NOC from property owner', hint: 'If premises is rented',               required: false },
    ],
    faqs: [
      { q: 'How long does GST registration take?', a: 'GSTIN is issued within 3–7 working days of application. ARN is issued immediately.' },
      { q: 'Is GST registration free from the govt?', a: 'Yes, the govt charges nothing. Our fee covers the application, form-filling, and expert guidance.' },
    ],
  },

  'rent-agreement': {
    slug: 'rent-agreement', name: 'Rent Agreement', nameHindi: 'किराया समझौता',
    category: 'legal', emoji: '📋', sla: '2 hours',
    tagline: 'Get a legally valid 11-month rent agreement drafted and ready to sign.',
    agentPrice: '₹500–₹1,500', caRequired: false, phase: 1,
    plans: [
      { id: 'basic',    name: 'Basic',    price: 299, desc: '11-month agreement, standard clauses', includes: ['Professionally drafted agreement', 'PDF download', 'WhatsApp delivery', 'E-stamp guidance'] },
      { id: 'notarised', name: 'Notarised', price: 599, desc: 'Drafted + notarisation assistance (physical)', includes: ['Everything in Basic', 'Notary guidance', 'Stamp duty calculation', 'Physical copy coordination'] },
    ],
    docsNeeded: [
      { id: 'owner',    label: 'Owner name & Aadhaar',  hint: 'Full name and Aadhaar number of property owner', required: true },
      { id: 'tenant',   label: 'Tenant name & Aadhaar', hint: 'Full name and Aadhaar number of tenant',         required: true },
      { id: 'property', label: 'Property address',       hint: 'Complete address with PIN code',                 required: true },
      { id: 'rent',     label: 'Monthly rent amount',    hint: 'Agreed monthly rent in ₹',                       required: true },
      { id: 'deposit',  label: 'Security deposit',       hint: 'Security deposit amount',                        required: true },
    ],
    faqs: [
      { q: 'Is 11-month agreement legally valid?', a: 'Yes. 11-month agreements avoid mandatory registration, saving stamp duty. They are widely accepted by banks, employers, and courts.' },
      { q: 'How long does delivery take?', a: 'Your draft is ready within 2 hours. Review it, request edits, and download the final PDF.' },
    ],
  },

  'msme': {
    slug: 'msme', name: 'MSME / Udyam Registration', nameHindi: 'उद्यम पंजीकरण',
    category: 'business', emoji: '🏭', sla: '2 hours',
    tagline: 'Get your Udyam certificate and unlock govt benefits, bank loans, and subsidies.',
    agentPrice: '₹500–₹1,500', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 299, desc: 'Udyam registration for any business size', includes: ['Udyam certificate', 'Registration number', 'Benefits guide', 'Email support'] },
    ],
    docsNeeded: [
      { id: 'aadhaar', label: 'Aadhaar Card',    hint: 'Owner / proprietor Aadhaar',         required: true },
      { id: 'pan',     label: 'PAN Card',         hint: 'Business owner PAN',                 required: true },
      { id: 'biz',     label: 'Business details', hint: 'Business name, activity, NIC code',  required: true },
    ],
    faqs: [
      { q: 'Is Udyam registration free from the govt?', a: 'Yes — the government charges nothing. Our fee is for the guided application and instant certificate.' },
      { q: 'What benefits do I get?', a: 'Priority sector lending, collateral-free loans, govt tender benefits, subsidy on patents, and protection against delayed payments.' },
    ],
  },

  'passport': {
    slug: 'passport', name: 'Passport Assistance', nameHindi: 'पासपोर्ट सहायता',
    category: 'govt', emoji: '🛂', sla: '24 hours',
    tagline: 'Apply for a new passport or renewal with expert document guidance and slot booking help.',
    agentPrice: '₹700–₹2,000', caRequired: false, phase: 1,
    plans: [
      { id: 'guidance', name: 'Guidance',    price: 349, desc: 'Step-by-step help for fresh or renewal application', includes: ['Document checklist', 'Form filling help', 'Slot booking guidance', 'WhatsApp support'] },
      { id: 'tatkal',   name: 'Tatkal Help', price: 549, desc: 'Tatkal application guidance + priority slot tips', includes: ['Everything in Guidance', 'Tatkal eligibility check', 'Documents for Tatkal', 'Escalation support'] },
    ],
    docsNeeded: [
      { id: 'aadhaar', label: 'Aadhaar Card',       hint: 'Front and back',           required: true },
      { id: 'pan',     label: 'PAN Card',             hint: 'For address proof',        required: true },
      { id: 'photo',   label: 'Passport size photo', hint: 'White background, 2"x2"',  required: true },
      { id: 'birth',   label: 'Birth certificate',   hint: 'Or school leaving cert.',  required: true },
      { id: 'address', label: 'Address proof',       hint: 'Utility bill / Aadhaar',   required: false },
    ],
    faqs: [
      { q: 'What is the difference between fresh and renewal?', a: 'Fresh passport is for first-time applicants. Renewal is for replacing an expired or expiring passport.' },
      { q: 'How do you help — you are not the passport office?', a: 'We prepare your documents, fill the online form, and guide you through the Passport Seva appointment. We save you 2–3 visits to agents.' },
    ],
  },

  'cibil': {
    slug: 'cibil', name: 'CIBIL Score Review', nameHindi: 'क्रेडिट स्कोर जांच',
    category: 'loans', emoji: '📊', sla: 'Same day',
    tagline: 'Get your CIBIL report, understand your score, and fix any errors dragging it down.',
    agentPrice: '₹400–₹1,000', caRequired: false, phase: 1,
    plans: [
      { id: 'review',   name: 'Review',   price: 199, desc: 'Fetch report + plain-language explanation', includes: ['CIBIL report fetch', 'Score explained in Hindi/English', 'Error identification', 'Email report'] },
      { id: 'full',     name: 'Full Fix',  price: 499, desc: 'Review + dispute errors on your behalf', includes: ['Everything in Review', 'Dispute errors with bureaus', 'Progress tracking', '30-day follow-up'] },
    ],
    docsNeeded: [
      { id: 'pan',    label: 'PAN Number',       hint: '10-digit PAN linked to your credit profile', required: true },
      { id: 'dob',    label: 'Date of birth',    hint: 'As on PAN card',                             required: true },
      { id: 'mobile', label: 'Mobile number',    hint: 'For OTP verification with CIBIL',            required: true },
    ],
    faqs: [
      { q: 'Does checking CIBIL score reduce it?', a: 'No. Checking your own score is a "soft inquiry" and has zero impact on your credit score.' },
      { q: 'How long does error resolution take?', a: 'Bureaus typically resolve disputes within 30 days. We track and follow up on your behalf.' },
    ],
  },
  // ── INCOME TAX (additional) ──────────────────────────────────
  'advance-tax': {
    slug: 'advance-tax', name: 'Advance Tax Calculation', nameHindi: 'अग्रिम कर गणना',
    category: 'income-tax', emoji: '🧮', sla: 'Same day',
    tagline: 'Quarterly advance tax estimate with challan generation — avoid 234B/234C interest penalties.',
    agentPrice: '₹300–₹800', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 199, desc: 'One quarter estimate + Challan 280 generation', includes: ['Income estimate for the quarter', 'Tax liability calculation', 'Challan 280 generated', 'Email support'] },
    ],
    docsNeeded: [
      { id: 'income',  label: 'Income details / Form 16', hint: 'Salary slips or estimated business income for the year', required: true },
      { id: 'pan',     label: 'PAN Card',                  hint: 'For challan generation',                                  required: true },
      { id: 'prev',    label: 'Previous quarter challan',  hint: 'If any advance tax already paid this year',               required: false },
    ],
    faqs: [
      { q: 'Who needs to pay advance tax?', a: 'Anyone with tax liability above ₹10,000 in a financial year — salaried with other income, freelancers, and businesses.' },
      { q: 'What happens if I miss a quarter?', a: 'Interest under Section 234B/234C is charged on the shortfall. We calculate the exact amount so you can pay promptly.' },
    ],
  },

  'form26as': {
    slug: 'form26as', name: 'Form 26AS / AIS Review', nameHindi: '26AS / AIS जांच',
    category: 'income-tax', emoji: '🔍', sla: 'Same day',
    tagline: 'Reconcile your TDS credits and AIS data before filing to avoid mismatches and notices.',
    agentPrice: '₹200–₹500', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 99, desc: 'Fetch and explain Form 26AS + AIS in plain language', includes: ['Form 26AS fetch', 'AIS summary explained', 'Mismatch flags highlighted', 'PDF report'] },
    ],
    docsNeeded: [
      { id: 'pan',    label: 'PAN Number',    hint: '10-digit PAN linked to income tax e-filing', required: true },
      { id: 'mobile', label: 'Mobile number', hint: 'Registered with the IT e-filing portal for OTP', required: true },
    ],
    faqs: [
      { q: 'What is the difference between 26AS and AIS?', a: '26AS shows TDS/TCS credits. AIS (Annual Information Statement) is broader — includes interest, dividends, mutual fund transactions, and more.' },
      { q: 'Why does this matter before filing?', a: 'Mismatches between your return and AIS/26AS are the most common reason for getting a tax notice. We flag these before you file.' },
    ],
  },

  'refund-track': {
    slug: 'refund-track', name: 'Refund Status & Follow-up', nameHindi: 'रिफंड ट्रैकिंग',
    category: 'income-tax', emoji: '💸', sla: 'Same day',
    tagline: 'Track a stuck income tax refund and get expert follow-up with the IT Department.',
    agentPrice: '₹300–₹700', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'check',    name: 'Status Check',  price: 149, desc: 'Check refund status and explain any failure reason', includes: ['Refund status check', 'Failure reason explained', 'Next-step guidance', 'Email report'] },
      { id: 'followup', name: 'Active Follow-up', price: 349, desc: 'We escalate and follow up with the IT Department for you', includes: ['Everything in Status Check', 'Grievance filed on e-Nivaran', 'Weekly follow-up', 'Bank account validation help'] },
    ],
    docsNeeded: [
      { id: 'pan',  label: 'PAN Number',      hint: 'PAN used to file the return',          required: true },
      { id: 'ay',   label: 'Assessment Year', hint: 'e.g. AY 2025-26',                       required: true },
      { id: 'bank', label: 'Bank account details', hint: 'Account number and IFSC for refund validation', required: false },
    ],
    faqs: [
      { q: 'Why is my refund delayed?', a: 'Common reasons: bank account not pre-validated, name mismatch between PAN and bank, or the return is under processing/scrutiny.' },
      { q: 'How long does a refund usually take?', a: 'Typically 4–6 weeks after e-verification, but can take longer if your return is picked for review.' },
    ],
  },

  // ── GST (additional) ─────────────────────────────────────────
  'gst-cancel': {
    slug: 'gst-cancel', name: 'GST Cancellation', nameHindi: 'GST रद्द करवाएं',
    category: 'gst', emoji: '❌', sla: 'Same day',
    tagline: 'Cancel your GSTIN when closing a business or falling below the registration threshold.',
    agentPrice: '₹800–₹1,500', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 399, desc: 'GSTIN cancellation application with final return guidance', includes: ['Cancellation application (REG-16)', 'Final return (GSTR-10) guidance', 'ARN tracking', 'Email support'] },
    ],
    docsNeeded: [
      { id: 'gstin',  label: 'GSTIN',                 hint: 'The GST number to be cancelled',            required: true },
      { id: 'reason', label: 'Reason for cancellation', hint: 'Business closed, turnover below threshold, etc.', required: true },
      { id: 'stock',  label: 'Closing stock value',   hint: 'If applicable, for final return calculation', required: false },
    ],
    faqs: [
      { q: 'Do I still need to file returns after applying?', a: 'Yes — you must file all pending returns up to the cancellation date, plus a final return (GSTR-10) within 3 months.' },
      { q: 'Can cancellation be reversed?', a: 'Yes, within 30 days of the cancellation order, you can apply for revocation if done in error.' },
    ],
  },

  'eway-bill': {
    slug: 'eway-bill', name: 'E-Way Bill Assistance', nameHindi: 'E-Way Bill सहायता',
    category: 'gst', emoji: '🚚', sla: 'Same day',
    tagline: 'Generate, modify, or troubleshoot e-way bills for goods transport above ₹50,000.',
    agentPrice: '₹200–₹500', caRequired: false, phase: 1,
    plans: [
      { id: 'single',  name: 'Single Bill',  price: 99,  desc: 'One e-way bill generated for a single consignment', includes: ['E-way bill generation', 'Vehicle number update', 'Validity extension guidance', 'WhatsApp delivery'] },
      { id: 'monthly',  name: 'Monthly Pack', price: 799, desc: 'Up to 15 e-way bills per month for regular transporters', includes: ['Up to 15 e-way bills/month', 'Bulk generation support', 'Error troubleshooting', 'Priority support'] },
    ],
    docsNeeded: [
      { id: 'invoice', label: 'Tax invoice / delivery challan', hint: 'Invoice value, HSN code, and quantity', required: true },
      { id: 'gstin',   label: 'GSTIN',                          hint: 'Consignor and consignee GSTIN',         required: true },
      { id: 'vehicle', label: 'Vehicle number',                 hint: 'Transport vehicle registration number', required: true },
    ],
    faqs: [
      { q: 'When is an e-way bill mandatory?', a: 'For movement of goods worth more than ₹50,000 in a single invoice, across or within most states.' },
      { q: 'What if the vehicle breaks down mid-transit?', a: 'You can update the vehicle number on the existing e-way bill — we guide you through this in real time.' },
    ],
  },

  // ── IDENTITY (additional) ────────────────────────────────────
  'pan-new': {
    slug: 'pan-new', name: 'New PAN Application', nameHindi: 'नया PAN आवेदन',
    category: 'identity', emoji: '🪪', sla: 'Same day',
    tagline: 'Apply for a fresh PAN card via Form 49A — for first-time applicants.',
    agentPrice: '₹300–₹800', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 149, desc: 'Form 49A filing with document verification', includes: ['Form 49A submission', 'Document verification', 'Application tracking', 'ePAN + physical card'] },
    ],
    docsNeeded: [
      { id: 'identity', label: 'Identity proof',  hint: 'Aadhaar, voter ID, or passport', required: true },
      { id: 'address',  label: 'Address proof',   hint: 'Aadhaar, utility bill, or bank statement', required: true },
      { id: 'dob',       label: 'Date of birth proof', hint: 'Birth certificate, Aadhaar, or 10th marksheet', required: true },
      { id: 'photo',     label: 'Passport size photo', hint: 'White background, recent photo', required: true },
    ],
    faqs: [
      { q: 'How long does a new PAN take?', a: 'ePAN is usually issued within 48 hours; the physical card arrives by post in 10–15 days.' },
      { q: 'Can minors apply for PAN?', a: 'Yes, with a parent/guardian\'s details and signature on the application.' },
    ],
  },

  'pan-correct': {
    slug: 'pan-correct', name: 'PAN Correction / Update', nameHindi: 'PAN सुधार',
    category: 'identity', emoji: '✏️', sla: 'Same day',
    tagline: 'Correct your name, date of birth, address, or photo on an existing PAN card.',
    agentPrice: '₹300–₹800', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 149, desc: 'Single-field correction (name, DOB, or address)', includes: ['Correction form filing', 'Supporting document verification', 'Application tracking', 'Updated ePAN'] },
    ],
    docsNeeded: [
      { id: 'pan',     label: 'Existing PAN card', hint: 'Copy of current PAN card',                       required: true },
      { id: 'proof',   label: 'Proof of correction', hint: 'e.g. Aadhaar showing correct name/DOB/address', required: true },
      { id: 'photo',   label: 'Passport size photo', hint: 'Only needed if updating photo',                 required: false },
    ],
    faqs: [
      { q: 'How many fields can I correct at once?', a: 'You can request multiple corrections (name + DOB + address) in a single application — no extra charge per field.' },
      { q: 'Will my PAN number change?', a: 'No, your PAN number stays the same. Only the printed details on the card are updated.' },
    ],
  },

  'pan-reprint': {
    slug: 'pan-reprint', name: 'PAN Reprint / ePAN', nameHindi: 'PAN दोबारा / ePAN',
    category: 'identity', emoji: '🖨️', sla: 'Same day',
    tagline: 'Lost your PAN card? Get a reprint or download an instant ePAN.',
    agentPrice: '₹200–₹500', caRequired: false, phase: 1,
    plans: [
      { id: 'epan',   name: 'ePAN Only', price: 49, desc: 'Instant digital ePAN download — no physical card', includes: ['ePAN PDF download', 'Delivered within hours', 'Valid for all official use'] },
      { id: 'reprint', name: 'Reprint + ePAN', price: 99, desc: 'Physical card reprint plus instant ePAN', includes: ['Everything in ePAN Only', 'Physical card reprint', 'Delivery by post'] },
    ],
    docsNeeded: [
      { id: 'pan',   label: 'PAN number',     hint: '10-digit PAN of the lost/damaged card', required: true },
      { id: 'aadhaar', label: 'Aadhaar number', hint: 'For identity verification',              required: true },
    ],
    faqs: [
      { q: 'I lost my PAN card — can I still file taxes?', a: 'Yes, you only need your PAN number, not the physical card. But we recommend getting a reprint for KYC purposes.' },
      { q: 'How fast is ePAN delivery?', a: 'Usually within a few hours of application, directly to your registered email.' },
    ],
  },

  'aadhaar-address': {
    slug: 'aadhaar-address', name: 'Aadhaar Address Update', nameHindi: 'आधार पता अपडेट',
    category: 'identity', emoji: '🏠', sla: '2 hours',
    tagline: 'Update your Aadhaar address online using a supporting document — no centre visit needed.',
    agentPrice: '₹200–₹500', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 99, desc: 'Online address update via myAadhaar portal', includes: ['UIDAI portal guidance', 'Document upload assistance', 'Update request tracking', 'Confirmation screenshot'] },
    ],
    docsNeeded: [
      { id: 'aadhaar', label: 'Current Aadhaar',  hint: 'Existing Aadhaar number',                                  required: true },
      { id: 'proof',   label: 'New address proof', hint: 'Electricity bill, bank passbook, rent agreement, etc.',  required: true, example: 'Document must be in your name, less than 3 months old' },
      { id: 'mobile',  label: 'Registered mobile', hint: 'Mobile linked to Aadhaar for OTP verification',           required: true },
    ],
    faqs: [
      { q: 'Can I update address without a centre visit?', a: 'Yes, address can be updated fully online via the myAadhaar portal with a valid supporting document.' },
      { q: 'How long until the new card is ready?', a: 'Updates are usually processed within 2 hours; the updated e-Aadhaar can be downloaded immediately after approval.' },
    ],
  },

  'aadhaar-name': {
    slug: 'aadhaar-name', name: 'Aadhaar Name / DOB Update', nameHindi: 'आधार नाम / जन्मतिथि सुधार',
    category: 'identity', emoji: '✏️', sla: '2 hours',
    tagline: 'Correct your name or date of birth in Aadhaar — includes centre booking guidance for biometric verification.',
    agentPrice: '₹200–₹500', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 99, desc: 'Name or DOB correction with centre appointment help', includes: ['Document checklist', 'Online request initiation', 'Nearest centre booking', 'Status tracking'] },
    ],
    docsNeeded: [
      { id: 'aadhaar', label: 'Current Aadhaar',  hint: 'Existing Aadhaar card / e-Aadhaar',         required: true },
      { id: 'proof',   label: 'Proof of correct name/DOB', hint: 'PAN card, passport, birth certificate, or 10th marksheet', required: true },
      { id: 'mobile',  label: 'Registered mobile', hint: 'Mobile linked to Aadhaar for OTP',          required: true },
    ],
    faqs: [
      { q: 'Why does this need a centre visit?', a: 'UIDAI requires biometric re-verification for name and date-of-birth corrections, unlike address updates which can be fully online.' },
      { q: 'How many times can I update my name?', a: 'UIDAI allows a limited number of name updates in a lifetime — we check your eligibility before starting.' },
    ],
  },

  'aadhaar-centre': {
    slug: 'aadhaar-centre', name: 'Aadhaar Centre Booking', nameHindi: 'आधार केंद्र बुकिंग',
    category: 'identity', emoji: '📍', sla: 'Same day',
    tagline: 'Book the nearest Aadhaar enrolment or update centre appointment — skip the queue.',
    agentPrice: '₹100–₹300', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 49, desc: 'Find and book the nearest available slot', includes: ['Nearest centre search', 'Slot booking', 'Required documents checklist', 'Appointment confirmation'] },
    ],
    docsNeeded: [
      { id: 'purpose', label: 'Purpose of visit', hint: 'New enrolment, biometric update, photo update, etc.', required: true },
      { id: 'pincode', label: 'Area pincode',     hint: 'To find centres near you',                            required: true },
    ],
    faqs: [
      { q: 'Can I choose my preferred date and time?', a: 'We book the earliest available slot at your nearest centre based on your preference where possible.' },
      { q: 'What should I carry to the appointment?', a: 'We send you a checklist of documents specific to your purpose (new enrolment vs. update) ahead of the visit.' },
    ],
  },

  'epan-download': {
    slug: 'epan-download', name: 'ePAN Download', nameHindi: 'ePAN डाउनलोड',
    category: 'identity', emoji: '📥', sla: 'Same day',
    tagline: 'Instantly download your ePAN from the NSDL or UTIITSL portal.',
    agentPrice: '₹100–₹300', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 49, desc: 'ePAN fetched and delivered to your email/WhatsApp', includes: ['Portal lookup (NSDL/UTIITSL)', 'ePAN PDF download', 'Delivery via email & WhatsApp'] },
    ],
    docsNeeded: [
      { id: 'pan',   label: 'PAN number',    hint: '10-digit PAN',                          required: true },
      { id: 'dob',   label: 'Date of birth', hint: 'As registered with PAN',                 required: true },
      { id: 'mobile', label: 'Registered mobile/email', hint: 'For OTP verification on the portal', required: true },
    ],
    faqs: [
      { q: 'Is ePAN valid as an official document?', a: 'Yes, ePAN carries the same validity as a physical PAN card for all official and KYC purposes.' },
      { q: 'What if my PAN was issued before 2017?', a: 'Older PANs may need to be looked up on NSDL instead of UTIITSL — we check both automatically.' },
    ],
  },

  'digilocker': {
    slug: 'digilocker', name: 'DigiLocker Setup', nameHindi: 'DigiLocker सेटअप',
    category: 'identity', emoji: '☁️', sla: 'Same day',
    tagline: 'Set up your DigiLocker account and fetch your government-issued documents digitally.',
    agentPrice: '₹150–₹400', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 79, desc: 'Account creation and linking of key documents', includes: ['DigiLocker account setup', 'Aadhaar/PAN/DL linking', 'Document fetch guidance', 'Mobile app walkthrough'] },
    ],
    docsNeeded: [
      { id: 'aadhaar', label: 'Aadhaar number', hint: 'Required to create a DigiLocker account', required: true },
      { id: 'mobile',  label: 'Mobile number',  hint: 'Linked to Aadhaar for OTP verification',    required: true },
    ],
    faqs: [
      { q: 'What documents can I store in DigiLocker?', a: 'Aadhaar, PAN, driving licence, vehicle RC, marksheets, insurance policies, and more — pulled directly from issuing authorities.' },
      { q: 'Is DigiLocker legally valid for document submission?', a: 'Yes, documents in DigiLocker are treated as equivalent to original physical documents under the IT Act, 2000.' },
    ],
  },

  // ── GOVT CERTIFICATES (additional) ───────────────────────────
  'driving-lic': {
    slug: 'driving-lic', name: 'Driving Licence Services', nameHindi: 'ड्राइविंग लाइसेंस सेवाएं',
    category: 'govt', emoji: '🚗', sla: 'Same day',
    tagline: 'Learner\'s licence, full DL application, renewal, address change, or RC copy — all guided.',
    agentPrice: '₹400–₹1,000', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'll',      name: 'Learner\'s Licence', price: 199, desc: 'LL application with online test slot booking', includes: ['Form filling', 'Test slot booking', 'Document checklist', 'Status tracking'] },
      { id: 'renewal', name: 'DL Renewal',         price: 299, desc: 'Renew an expired or expiring driving licence', includes: ['Renewal form filing', 'Document verification', 'RTO appointment if needed', 'Status tracking'] },
    ],
    docsNeeded: [
      { id: 'identity', label: 'Identity proof',  hint: 'Aadhaar or PAN',                         required: true },
      { id: 'address',  label: 'Address proof',   hint: 'Aadhaar, utility bill, or rent agreement', required: true },
      { id: 'photo',    label: 'Passport size photo', hint: 'Recent, white background',           required: true },
      { id: 'oldlic',   label: 'Existing licence', hint: 'Only required for renewal or address change', required: false },
    ],
    faqs: [
      { q: 'How long is a learner\'s licence valid?', a: 'A Learner\'s Licence is valid for 6 months, during which you can apply for the full driving test.' },
      { q: 'Can I renew my DL if it expired years ago?', a: 'Yes, but if expired more than 5 years, you may need to retake the driving test. We check eligibility for you.' },
    ],
  },

  'voter-id': {
    slug: 'voter-id', name: 'Voter ID Services', nameHindi: 'वोटर ID सेवाएं',
    category: 'govt', emoji: '🗳️', sla: 'Same day',
    tagline: 'New voter ID enrolment, correction, deletion, or e-EPIC download — fully guided.',
    agentPrice: '₹200–₹500', caRequired: false, phase: 1,
    plans: [
      { id: 'new',      name: 'New Enrolment', price: 99, desc: 'First-time voter ID registration via Form 6', includes: ['Form 6 filing', 'Document verification', 'BLO follow-up if needed', 'Status tracking'] },
      { id: 'correction', name: 'Correction',  price: 99, desc: 'Correct name, address, or photo on existing card', includes: ['Form 8 filing', 'Document verification', 'Status tracking'] },
    ],
    docsNeeded: [
      { id: 'age',      label: 'Age proof',     hint: 'Must be 18+ — Aadhaar, birth certificate, or 10th marksheet', required: true },
      { id: 'address',  label: 'Address proof', hint: 'Aadhaar, utility bill, or rent agreement',                    required: true },
      { id: 'photo',    label: 'Passport size photo', hint: 'Recent, white background',                              required: true },
    ],
    faqs: [
      { q: 'When can I apply for a voter ID?', a: 'You can apply once you turn 18, or up to a few months in advance under the latest ECI rules.' },
      { q: 'What is e-EPIC?', a: 'A digital, downloadable version of your voter ID card that is valid for most identification purposes.' },
    ],
  },

  'ayushman': {
    slug: 'ayushman', name: 'Ayushman Bharat Card', nameHindi: 'आयुष्मान भारत कार्ड',
    category: 'govt', emoji: '🏥', sla: 'Same day',
    tagline: 'Apply for, correct, or activate your PM-JAY health card — up to ₹5 lakh free treatment cover.',
    agentPrice: '₹200–₹500', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 99, desc: 'Eligibility check and card application/activation', includes: ['PM-JAY eligibility check', 'Application/activation', 'Card download', 'Hospital network info'] },
    ],
    docsNeeded: [
      { id: 'aadhaar', label: 'Aadhaar card', hint: 'For identity and eligibility verification', required: true },
      { id: 'ration',  label: 'Ration card / family ID', hint: 'Used to verify household eligibility under SECC data', required: false },
      { id: 'mobile',  label: 'Mobile number', hint: 'For OTP and card delivery updates',         required: true },
    ],
    faqs: [
      { q: 'Who is eligible for Ayushman Bharat?', a: 'Eligibility is based on the SECC 2011 deprivation criteria. We check your eligibility using your Aadhaar/ration card before applying.' },
      { q: 'What does the card cover?', a: 'Cashless treatment up to ₹5 lakh per family per year at empanelled government and private hospitals.' },
    ],
  },

  'epf': {
    slug: 'epf', name: 'EPF / PF Services', nameHindi: 'PF सेवाएं',
    category: 'govt', emoji: '💼', sla: '48 hours',
    tagline: 'Withdraw, transfer, or activate your UAN — and check your PF passbook anytime.',
    agentPrice: '₹400–₹1,000', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'withdraw', name: 'Withdrawal', price: 199, desc: 'Full or partial PF withdrawal application', includes: ['Online withdrawal claim (Form 19/31)', 'KYC verification help', 'Claim status tracking', 'Email support'] },
      { id: 'transfer',  name: 'Transfer',   price: 199, desc: 'Transfer PF balance between employers', includes: ['Online transfer claim (Form 13)', 'UAN linking verification', 'Status tracking'] },
    ],
    docsNeeded: [
      { id: 'uan',    label: 'UAN number',        hint: 'Universal Account Number — find on payslip', required: true },
      { id: 'bank',   label: 'Bank account details', hint: 'Account linked to UAN, with cancelled cheque', required: true },
      { id: 'aadhaar', label: 'Aadhaar number',   hint: 'Must be linked and verified on UAN portal',     required: true },
    ],
    faqs: [
      { q: 'How long does PF withdrawal take?', a: 'Online claims are usually processed within 5–7 working days once KYC is fully verified on the EPFO portal.' },
      { q: 'Can I withdraw PF while still employed?', a: 'Partial withdrawal is allowed for specific reasons like medical emergencies, home purchase, or education — full withdrawal requires unemployment of 2+ months.' },
    ],
  },

  // ── LEGAL (additional) ───────────────────────────────────────
  'noc': {
    slug: 'noc', name: 'NOC Drafting', nameHindi: 'NOC प्रारूपण',
    category: 'legal', emoji: '✅', sla: '2 hours',
    tagline: 'A professionally drafted No-Objection Certificate for property, employment, or education purposes.',
    agentPrice: '₹400–₹1,000', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 199, desc: 'NOC drafted for your specific purpose', includes: ['Custom-drafted NOC', 'PDF + Word format', 'WhatsApp delivery', 'One free revision'] },
    ],
    docsNeeded: [
      { id: 'purpose', label: 'Purpose of NOC',       hint: 'Property rental, employment, vehicle transfer, education, etc.', required: true },
      { id: 'parties', label: 'Names of both parties', hint: 'Full legal names of the NOC giver and receiver',                required: true },
      { id: 'details', label: 'Relevant details',     hint: 'Property address, vehicle number, or other context as applicable', required: true },
    ],
    faqs: [
      { q: 'Is a self-drafted NOC valid?', a: 'It can be, but a professionally worded NOC reduces the chance of rejection by banks, employers, or government departments.' },
      { q: 'Do I need to notarise the NOC?', a: 'Not always — depends on the purpose. We\'ll tell you if notarisation is recommended for your specific case.' },
    ],
  },

  'affidavit': {
    slug: 'affidavit', name: 'Affidavit Drafting', nameHindi: 'हलफनामा प्रारूपण',
    category: 'legal', emoji: '📄', sla: '2 hours',
    tagline: 'A legally sound affidavit on stamp paper, drafted for any purpose — name change, address proof, and more.',
    agentPrice: '₹400–₹800', caRequired: false, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 199, desc: 'Affidavit drafted and ready for notarisation', includes: ['Custom-drafted affidavit', 'Stamp paper value guidance', 'Notary booking help', 'PDF + Word format'] },
    ],
    docsNeeded: [
      { id: 'purpose', label: 'Purpose of affidavit', hint: 'Name change, address proof, income declaration, etc.', required: true },
      { id: 'identity', label: 'Identity proof',      hint: 'Aadhaar or PAN of the person making the affidavit',     required: true },
      { id: 'details',  label: 'Supporting details',  hint: 'Any specific facts to be stated in the affidavit',      required: true },
    ],
    faqs: [
      { q: 'Where do I get the affidavit notarised?', a: 'Any local notary or court can notarise it once drafted — we can also guide you to the nearest one.' },
      { q: 'What stamp paper value should I use?', a: 'This varies by state and purpose — we tell you the correct denomination for your specific affidavit.' },
    ],
  },

  // ── INSURANCE (additional) ───────────────────────────────────
  'motor-ins': {
    slug: 'motor-ins', name: 'Motor Insurance Renewal', nameHindi: 'वाहन बीमा नवीनीकरण',
    category: 'insurance', emoji: '🚗', sla: 'Same day',
    tagline: 'Compare quotes and renew your two-wheeler or car insurance — never miss a renewal date.',
    agentPrice: 'Commission-based', caRequired: false, popular: true, phase: 1,
    plans: [
      { id: 'standard', name: 'Standard', price: 99, desc: 'Compare and renew with the best available quote', includes: ['Quote comparison across insurers', 'Renewal processing', 'Policy document delivery', 'Claim support guidance'] },
    ],
    docsNeeded: [
      { id: 'rc',     label: 'Vehicle RC',          hint: 'Registration Certificate of the vehicle',     required: true },
      { id: 'policy', label: 'Previous policy',     hint: 'Existing/expired insurance policy copy',       required: false },
      { id: 'license', label: 'Driving licence',    hint: 'Of the registered vehicle owner',              required: true },
    ],
    faqs: [
      { q: 'What if my policy has already expired?', a: 'We can still help — though a vehicle inspection may be required if the lapse is longer than 90 days.' },
      { q: 'Third-party vs comprehensive — what\'s the difference?', a: 'Third-party covers damage to others only and is legally mandatory; comprehensive also covers your own vehicle.' },
    ],
  },
}

export function getService(slug: string): Service | null {
  return SERVICES[slug] ?? null
}

export function getAllServices(): Service[] {
  return Object.values(SERVICES)
}
