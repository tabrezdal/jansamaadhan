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

  'aadhaar-update': {
    slug: 'aadhaar-update', name: 'Aadhaar Update', nameHindi: 'आधार अपडेट',
    category: 'identity', emoji: '🪪', sla: '2 hours',
    tagline: 'Update your name, address, or date of birth in Aadhaar with guided expert help.',
    agentPrice: '₹200–₹500', caRequired: false, phase: 1,
    plans: [
      { id: 'address', name: 'Address Update', price: 99, desc: 'Change address using supporting documents', includes: ['UIDAI portal guidance', 'Document checklist', 'Update tracking', 'Support chat'] },
      { id: 'name-dob', name: 'Name / DOB Update', price: 99, desc: 'Correct name or date of birth mismatch', includes: ['UIDAI portal guidance', 'Document checklist', 'Centre booking help', 'Support chat'] },
    ],
    docsNeeded: [
      { id: 'aadhaar',  label: 'Current Aadhaar',      hint: 'Your existing Aadhaar card / e-Aadhaar',  required: true },
      { id: 'proof',    label: 'Address proof',         hint: 'Electricity bill, bank passbook, or ration card', required: true, example: 'Any govt-accepted address document' },
      { id: 'mobile',   label: 'Registered mobile no.', hint: 'Mobile linked to your Aadhaar for OTP',  required: true },
    ],
    faqs: [
      { q: 'Can address be updated online?', a: 'Yes, address update can be done online via the UIDAI myAadhaar portal. We guide you step by step.' },
      { q: 'Does name/DOB update need a centre visit?', a: 'Yes — name and DOB updates require biometric verification at an Aadhaar centre. We help you book the nearest slot.' },
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
}

export function getService(slug: string): Service | null {
  return SERVICES[slug] ?? null
}

export function getAllServices(): Service[] {
  return Object.values(SERVICES)
}
