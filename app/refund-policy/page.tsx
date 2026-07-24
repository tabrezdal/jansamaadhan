import type { Metadata } from 'next'
import LegalPageLayout, { type LegalSection } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Refund Policy — JanSamaadhan',
  description: 'JanSamaadhan\'s no-questions-asked refund guarantee when service-level commitments are missed, plus our process for cancellations and disputes.',
}

const SECTIONS: LegalSection[] = [
  { id: 'guarantee',     title: '1. Our SLA Refund Guarantee' },
  { id: 'sla-table',     title: '2. Standard SLAs' },
  { id: 'how-to-claim',  title: '3. How to Claim a Refund' },
  { id: 'timelines',     title: '4. Refund Timelines' },
  { id: 'not-covered',   title: '5. What Is Not Covered' },
  { id: 'cancellations', title: '6. Voluntary Cancellations' },
  { id: 'rejections',    title: '7. Government Rejections' },
  { id: 'partial',       title: '8. Partial Refunds' },
  { id: 'disputes',      title: '9. Disputes' },
  { id: 'contact-refund',title: '10. Contact Us' },
]

const SLA_ROWS = [
  { service: 'ITR-1 Filing',              sla: '24 hours' },
  { service: 'ITR-2 Filing',              sla: '48 hours' },
  { service: 'PAN / Aadhaar services',    sla: 'Same day' },
  { service: 'GST Registration',          sla: '6 hours' },
  { service: 'GSTR Monthly Filing',       sla: 'Same day' },
  { service: 'Tax Notice Reply',          sla: '5 business days' },
  { service: 'Rent Agreement',            sla: '2 hours' },
  { service: 'MSME / Udyam Registration', sla: '2 hours' },
  { service: 'Passport Assistance',       sla: '24 hours' },
]

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund Policy" effective="1 January 2026" sections={SECTIONS}>

      <section id="guarantee">
        <h2>1. Our SLA Refund Guarantee</h2>
        <p>
          JanSamaadhan commits to delivering every service within the stated SLA (service-level timeline) shown on the
          service page at the time of your order. <strong>If we miss that SLA for reasons within our reasonable
          control, you are entitled to a full refund — no questions asked.</strong> This is the core promise behind
          our pricing: you only pay for outcomes delivered on time.
        </p>
      </section>

      <section id="sla-table">
        <h2>2. Standard SLAs</h2>
        <p>The table below shows our committed delivery timelines for the most common services. The exact SLA for your order is also shown on the order confirmation screen and in your dashboard.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-100 my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Service</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Committed SLA</th>
              </tr>
            </thead>
            <tbody>
              {SLA_ROWS.map((row, i) => (
                <tr key={row.service} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-2.5 text-gray-700">{row.service}</td>
                  <td className="px-4 py-2.5 text-brand-teal font-medium">{row.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">SLAs for all 95+ services are listed individually on each service's order page.</p>
      </section>

      <section id="how-to-claim">
        <h2>3. How to Claim a Refund</h2>
        <p>If your SLA is missed, you do not need to file a formal complaint. Simply:</p>
        <ul>
          <li>Open the order in <strong>My Orders</strong> from your dashboard and tap <strong>"Request Refund"</strong>, or</li>
          <li>Message us on WhatsApp with your Order ID, or</li>
          <li>Email dalworld.inc@gmail.com with your Order ID.</li>
        </ul>
        <p>Our support team verifies the SLA breach against your order timestamp and processes eligible refunds automatically — typically without requiring further documentation from you.</p>
      </section>

      <section id="timelines">
        <h2>4. Refund Timelines</h2>
        <p>
          Once approved, refunds are credited to your original payment method (UPI, card, or net banking) via Razorpay
          within <strong>5–7 business days</strong>, depending on your bank's processing time. You will receive an SMS
          and email confirmation once the refund is initiated.
        </p>
      </section>

      <section id="not-covered">
        <h2>5. What Is Not Covered</h2>
        <p>The SLA refund guarantee does not apply when the delay is caused by factors outside JanSamaadhan's reasonable control, including:</p>
        <ul>
          <li>Government portal downtime, maintenance windows, or processing backlogs (Income Tax e-filing, GSTN, UIDAI, EPFO, Passport Seva, etc.)</li>
          <li>Incomplete, unclear, or incorrect documents submitted by you, until the correct documents are received</li>
          <li>Delays caused by you not responding to a document request from your assigned CA</li>
          <li>Force majeure events such as natural disasters, internet/telecom outages, or regulatory shutdowns</li>
          <li>Services already successfully delivered, even if you are later dissatisfied with a government department's independent decision (e.g. a refund delay or notice issued after correct filing)</li>
        </ul>
        <p>In these cases, we will still proactively communicate the cause of delay and a revised estimated timeline.</p>
      </section>

      <section id="cancellations">
        <h2>6. Voluntary Cancellations</h2>
        <p>
          If you wish to cancel an order before work has begun (i.e. before documents have been submitted to any
          government portal by your assigned CA), you are eligible for a <strong>100% refund</strong>. If your CA has
          already begun substantive work — for example, a return has been prepared and is pending only your final
          confirmation — a partial refund may apply, reflecting the work already completed. The applicable refund
          amount will be communicated to you before cancellation is finalised.
        </p>
      </section>

      <section id="rejections">
        <h2>7. Government Rejections</h2>
        <p>
          If a government department rejects an application due to a discrepancy in the information or documents you
          provided (for example, a name mismatch between PAN and Aadhaar that you did not disclose), the service fee
          covers the resubmission once corrected information is provided, at no extra charge. This is not treated as
          an SLA breach, since the cause originated from the information you submitted.
        </p>
      </section>

      <section id="partial">
        <h2>8. Partial Refunds</h2>
        <p>
          For multi-step services (such as company incorporation or annual ROC filing) where part of the work has been
          completed and part remains pending due to an SLA miss on the remaining steps, we issue a partial refund
          proportional to the undelivered portion, calculated transparently and shared with you before processing.
        </p>
      </section>

      <section id="disputes">
        <h2>9. Disputes</h2>
        <p>
          If you disagree with a refund decision, you may escalate by replying to the resolution email or messaging our
          support WhatsApp with "Escalate" — your case will be reviewed by a senior support lead within 48 hours.
        </p>
      </section>

      <section id="contact-refund">
        <h2>10. Contact Us</h2>
        <p>
          <strong>Email:</strong> dalworld.inc@gmail.com<br />
          <strong>WhatsApp / Phone:</strong> +91-9664850011 (toll-free, Mon–Sat, 9 AM–7 PM)
        </p>
      </section>

    </LegalPageLayout>
  )
}
