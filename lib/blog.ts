// ── Blog data layer ────────────────────────────────────────────────
// Same pattern as lib/services.ts and lib/allServices.ts — static data
// for now, swap for a CMS or DB-backed query later without changing
// the page components that consume these helpers.

export interface BlogPost {
  slug:        string
  title:       string
  excerpt:     string
  category:    'Income Tax' | 'GST' | 'Identity' | 'Guides'
  emoji:       string
  author:      string
  authorRole:  string
  date:        string         // display string, e.g. '12 Jun 2026'
  readTime:    string         // e.g. '5 min read'
  coverColor:  string         // tailwind gradient classes for the cover block
  content:     string[]       // paragraphs / simple markdown-ish blocks (## for h2, - for bullet)
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'itr-1-vs-itr-2-which-form',
    title: 'ITR-1 vs ITR-2: Which Form Should You Actually File?',
    excerpt: 'Filing the wrong ITR form is one of the most common (and costly) mistakes salaried taxpayers make. Here\'s how to tell which one applies to you in under 2 minutes.',
    category: 'Income Tax',
    emoji: '📄',
    author: 'CA Priya Mehta',
    authorRole: 'Income Tax Specialist',
    date: '10 Jun 2026',
    readTime: '5 min read',
    coverColor: 'from-blue-500 to-blue-700',
    content: [
      'Every year, lakhs of salaried Indians sit down to file their Income Tax Return and hit the same wall: ITR-1 or ITR-2? Picking wrong doesn\'t just cost you time — a defective return notice under Section 139(9) can delay your refund by weeks.',
      '## The short answer',
      'If you are a salaried employee with income only from salary, one house property, and interest income — and your total income is under ₹50 lakh — ITR-1 (Sahaj) is almost certainly your form. The moment capital gains, multiple properties, or foreign income enter the picture, you need ITR-2.',
      '## When ITR-1 is NOT enough',
      'Watch out for these situations — they all require ITR-2, even if you think of yourself as "just a salaried employee":',
      '- You sold any shares, mutual funds, or property during the year (even a small profit counts)',
      '- You own more than one house property',
      '- You have foreign income or foreign bank accounts',
      '- You are a director in a company, or hold unlisted equity shares',
      '- Your agricultural income exceeds ₹5,000',
      '## A real example',
      'Take Rakesh, a software engineer in Pune. He has a salary of ₹14 lakh, one self-occupied flat, and — this is the part people miss — he redeemed ₹40,000 worth of mutual funds in March to pay for a family trip. That ₹40,000 redemption, even if it\'s a tiny capital gain, pushes him into ITR-2 territory. Filing ITR-1 here would technically be incorrect, even though his "main" income looks simple.',
      '## What happens if you file the wrong form?',
      'The Income Tax Department\'s system can flag the return as defective, sending a notice under Section 139(9) asking you to refile within 15 days. Miss that window, and your original return may be treated as invalid — meaning any TDS refund gets stuck until you resolve it.',
      '## Our advice',
      'When in doubt, look specifically for any capital market transaction (shares, mutual funds, property) in the financial year, however small. If there\'s even one, go with ITR-2. Our ITR-2 filing includes a quick capital gains computation from your broker P&L statement, so you\'re not doing this math by hand.',
    ],
  },
  {
    slug: 'gst-registration-documents-checklist',
    title: 'GST Registration: The Complete Document Checklist for 2026',
    excerpt: 'Most GST applications get delayed not because of the process, but because of one missing document. Here\'s the exact checklist that gets you a GSTIN without back-and-forth.',
    category: 'GST',
    emoji: '🏢',
    author: 'CA Suresh Patel',
    authorRole: 'GST & Business Compliance',
    date: '5 Jun 2026',
    readTime: '4 min read',
    coverColor: 'from-indigo-500 to-indigo-700',
    content: [
      'GST registration should take a few hours. In practice, most delays come down to one of five missing or mismatched documents. Here is the checklist we use internally before submitting any application.',
      '## The five non-negotiables',
      '- PAN card of the proprietor, partner, or director (must match the name exactly as on Aadhaar)',
      '- Aadhaar card of the same person, for e-KYC verification',
      '- A recent passport-size photo with a plain white background',
      '- Business address proof — an electricity bill, property tax receipt, or rent agreement, dated within the last 3 months',
      '- A cancelled cheque or bank statement showing the business bank account (the account name should reasonably match the business or proprietor name)',
      '## The one most people get wrong: address proof',
      'If you\'re running the business from a rented space, the electricity bill is often still in the landlord\'s name — which is fine, but you\'ll then also need a No-Objection Certificate (NOC) from the property owner, along with a copy of their ID. Skipping this is the single biggest cause of application rejection we see.',
      '## What about businesses with no fixed address?',
      'If you operate from home or don\'t have a dedicated commercial space yet, you can still register using your residential address as the principal place of business — just make sure the utility bill or rent agreement matches that address exactly.',
      '## Timeline to expect',
      'Once your application and all documents are correctly submitted, GSTN typically issues an ARN (Application Reference Number) immediately, and the GSTIN itself within 3–7 working days, assuming there\'s no query raised by the officer. If a query is raised, you usually have 7 days to respond, so check your registered email and the GST portal regularly during this window.',
      '## Our recommendation',
      'Have all five documents scanned and ready before you start the application — not partway through. Most "delays" we see aren\'t government delays at all; they\'re the 2–3 days it takes a customer to track down a missing NOC or get a fresh electricity bill copy.',
    ],
  },
  {
    slug: 'pan-aadhaar-link-deadline-penalty',
    title: 'PAN-Aadhaar Linking: What Happens If You Miss the Deadline',
    excerpt: 'An unlinked PAN becomes "inoperative" — and the consequences go well beyond a missed refund. Here\'s exactly what changes, and how fast you can fix it.',
    category: 'Identity',
    emoji: '🔗',
    author: 'CA Priya Mehta',
    authorRole: 'Income Tax Specialist',
    date: '1 Jun 2026',
    readTime: '3 min read',
    coverColor: 'from-purple-500 to-purple-700',
    content: [
      'If your PAN and Aadhaar aren\'t linked, your PAN doesn\'t get cancelled — but it becomes "inoperative", and the practical impact on your finances is significant.',
      '## What "inoperative" actually means',
      'An inoperative PAN cannot be used to file your income tax return, and any pending refund is held back until the linking is complete. Banks and other institutions that are required to deduct TDS will deduct it at a higher rate — typically 20% instead of your normal slab rate — for any income credited to you while your PAN remains inoperative.',
      '## Real-world impact',
      'Consider Anjali, a freelance designer in Indore. Her clients deduct TDS at 10% under Section 194J. With an inoperative PAN, that jumps to 20% — meaning on a ₹50,000 invoice, she loses an extra ₹5,000 to TDS until she links her PAN and gets it reactivated, after which the excess deducted can be claimed back only when she files her return for that year.',
      '## How to check if you\'re affected',
      'You can check your PAN-Aadhaar linking status for free on the Income Tax e-filing portal under "Link Aadhaar Status". If it shows "Not linked" or "Inoperative", action is needed immediately.',
      '## How long does it take to fix?',
      'Once you submit the linking request — along with the late fee payment of ₹1,000 if applicable — the actual linking is usually processed within a few days to a few weeks, depending on portal load. Your PAN returns to "operative" status automatically once linking is confirmed; no separate reactivation request is needed.',
      '## What if your name or date of birth doesn\'t match?',
      'This is the most common reason linking fails even after submission. If your name has a spelling variation, middle name difference, or your DOB format mismatches between PAN and Aadhaar records, the system will reject the link. In this case, you\'ll need to correct whichever record has the error — usually it\'s faster to correct the PAN record via the NSDL/UTIITSL correction process — before reattempting the link.',
      '## Bottom line',
      'Don\'t wait for a TDS deduction or refund delay to discover your PAN is inoperative. It takes under 5 minutes to check and link if your records already match — we walk you through it step by step, including the mismatch resolution if needed.',
    ],
  },
]

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getPostsByCategory(category: BlogPost['category'] | 'All'): BlogPost[] {
  if (category === 'All') return BLOG_POSTS
  return BLOG_POSTS.filter(p => p.category === category)
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const current = getPostBySlug(slug)
  if (!current) return []
  return BLOG_POSTS
    .filter(p => p.slug !== slug && p.category === current.category)
    .slice(0, limit)
}
