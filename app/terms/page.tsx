import type { Metadata } from 'next'
import LegalPageLayout, { type LegalSection } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Terms of Service — JanSamaadhan',
  description: 'The terms governing your use of JanSamaadhan\'s tax filing, identity, GST, and government service platform.',
}

const SECTIONS: LegalSection[] = [
  { id: 'acceptance',    title: '1. Acceptance of Terms' },
  { id: 'eligibility',   title: '2. Eligibility' },
  { id: 'nature',        title: '3. Nature of Service' },
  { id: 'account',       title: '4. Your Account' },
  { id: 'orders',        title: '5. Orders, Pricing & Payment' },
  { id: 'sla',           title: '6. Service Levels & Delivery' },
  { id: 'ca-conduct',    title: '7. Role of Chartered Accountants' },
  { id: 'responsibilities', title: '8. Your Responsibilities' },
  { id: 'cancellation',  title: '9. Cancellation' },
  { id: 'liability',     title: '10. Limitation of Liability' },
  { id: 'ip',            title: '11. Intellectual Property' },
  { id: 'suspension',    title: '12. Suspension & Termination' },
  { id: 'governing-law', title: '13. Governing Law & Disputes' },
  { id: 'changes-terms', title: '14. Changes to These Terms' },
  { id: 'contact-terms', title: '15. Contact Us' },
]

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" effective="1 January 2026" sections={SECTIONS}>

      <section id="acceptance">
        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of jansamaadhan.in and any associated mobile
          experience (collectively, the "Platform"), operated by JanSamaadhan Technologies Pvt. Ltd. ("JanSamaadhan", "we",
          "us"). By registering an account, placing an order, or otherwise using the Platform, you agree to be bound by
          these Terms, our <a href="/privacy">Privacy Policy</a>, and our <a href="/refund-policy">Refund Policy</a>.
        </p>
      </section>

      <section id="eligibility">
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old and capable of entering into a legally binding contract under the Indian
          Contract Act, 1872 to register on the Platform. Services for minors (such as a first PAN application) may be
          ordered by a parent or legal guardian on the minor's behalf, with the guardian accepting these Terms.
        </p>
      </section>

      <section id="nature">
        <h2>3. Nature of Service</h2>
        <p>
          JanSamaadhan operates as a <strong>technology and facilitation platform</strong> that connects you with
          independent, ICAI-verified Chartered Accountants and provides guided self-service tools for tax, identity,
          GST, government certificate, and legal documentation needs. Where a service requires professional judgment
          (such as ITR-2 filing involving capital gains, or a tax notice reply), it is performed by the assigned CA in
          their independent professional capacity, governed by the ICAI Code of Ethics — JanSamaadhan facilitates the
          engagement and provides the technology layer, document storage, and payment processing.
        </p>
        <p>
          For purely procedural services (e.g. PAN–Aadhaar linking, e-way bill generation), JanSamaadhan's own
          operations team or automated guidance may complete the task without a CA being mandatorily involved, as
          indicated on each service's listing.
        </p>
      </section>

      <section id="account">
        <h2>4. Your Account</h2>
        <p>
          You register using your mobile number, verified via a one-time password (OTP). You are responsible for
          keeping your registered mobile number secure and for all activity that occurs under your account. Notify us
          immediately if you suspect unauthorised access. JanSamaadhan is not liable for losses arising from your
          failure to secure your mobile device or OTP.
        </p>
      </section>

      <section id="orders">
        <h2>5. Orders, Pricing &amp; Payment</h2>
        <p>
          Prices displayed on the Platform are inclusive of applicable taxes unless stated otherwise, and are subject to
          change without prior notice for future orders (existing orders are honoured at the price paid). Registration
          on JanSamaadhan is always free; you pay only for the specific service you order, and only after your
          documents are reviewed and, where applicable, a quote is confirmed.
        </p>
        <p>
          Payments are processed through Razorpay, a PCI-DSS compliant payment gateway. JanSamaadhan does not store
          your card, UPI, or net banking credentials. All payments are in Indian Rupees (₹).
        </p>
      </section>

      <section id="sla">
        <h2>6. Service Levels &amp; Delivery</h2>
        <p>
          Each service listing displays an estimated delivery timeline (e.g. "24 hours", "48 hours", "Same day"). These
          timelines begin once all required documents have been uploaded and verified as complete, and represent our
          good-faith service-level commitment, not a guarantee against delays caused by:
        </p>
        <ul>
          <li>Government portal downtime or processing delays (Income Tax e-filing, GSTN, UIDAI, EPFO, Passport Seva, etc.)</li>
          <li>Incomplete, incorrect, or fraudulent documents submitted by you</li>
          <li>Force majeure events including but not limited to natural disasters, internet outages, or regulatory shutdowns</li>
        </ul>
        <p>
          If we miss a committed SLA due to a cause within our reasonable control, you are entitled to a full refund
          under our <a href="/refund-policy">Refund Policy</a>.
        </p>
      </section>

      <section id="ca-conduct">
        <h2>7. Role of Chartered Accountants</h2>
        <p>
          All CAs on the Platform are independently verified against the ICAI (Institute of Chartered Accountants of
          India) membership database before being permitted to accept cases. CAs are independent professionals and not
          employees of JanSamaadhan. Professional advice, tax positions, and filing decisions made by your assigned CA
          are made in their independent professional judgment, consistent with applicable law and the ICAI Code of
          Ethics. JanSamaadhan facilitates the engagement but does not direct or override a CA's professional
          judgment on any specific filing.
        </p>
      </section>

      <section id="responsibilities">
        <h2>8. Your Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate, complete, and truthful information and documents for every order.</li>
          <li>Not use the Platform for any fraudulent, unlawful, or misleading purpose, including misrepresenting income, identity, or business details.</li>
          <li>Review drafted documents (returns, agreements, certificates) before final submission or signature, and flag any discrepancy promptly.</li>
          <li>Make timely payment for services ordered.</li>
        </ul>
        <p>
          You remain personally and legally responsible for the accuracy of information you provide. JanSamaadhan and
          its CA partners rely on the information you submit and are not liable for consequences arising from inaccurate
          or fraudulent information provided by you.
        </p>
      </section>

      <section id="cancellation">
        <h2>9. Cancellation</h2>
        <p>
          You may request cancellation of an order before your assigned CA has begun substantive work (i.e. before
          documents are submitted to a government portal). Cancellation requests after filing has commenced are handled
          case-by-case and may not be eligible for a full refund — see our <a href="/refund-policy">Refund Policy</a>
          for details.
        </p>
      </section>

      <section id="liability">
        <h2>10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by Indian law, JanSamaadhan's aggregate liability for any claim arising from
          your use of the Platform is limited to the amount you paid for the specific service giving rise to the claim.
          JanSamaadhan is not liable for indirect, incidental, or consequential losses, including loss of profit,
          business opportunity, or data, except where such limitation is not permitted by law (for example, in cases
          of gross negligence or wilful misconduct).
        </p>
        <p>
          Nothing in these Terms limits any statutory liability of an individual Chartered Accountant under the
          Chartered Accountants Act, 1949 or applicable professional indemnity norms for services rendered in their
          independent professional capacity.
        </p>
      </section>

      <section id="ip">
        <h2>11. Intellectual Property</h2>
        <p>
          All trademarks, logos, design, software, and content on the Platform (excluding documents you upload or that
          are generated specifically for your order) are the property of JanSamaadhan Technologies Pvt. Ltd. and may not
          be copied, reproduced, or used without prior written permission.
        </p>
      </section>

      <section id="suspension">
        <h2>12. Suspension &amp; Termination</h2>
        <p>
          We may suspend or terminate your account if we reasonably believe you have violated these Terms, engaged in
          fraudulent activity, or misused the Platform. You may close your account at any time by contacting support;
          see Section 7 of our <a href="/privacy">Privacy Policy</a> for what happens to your data upon account closure.
        </p>
      </section>

      <section id="governing-law">
        <h2>13. Governing Law &amp; Disputes</h2>
        <p>
          These Terms are governed by the laws of India. Any dispute arising from these Terms or your use of the
          Platform shall first be addressed through good-faith negotiation via our support channels, and failing
          resolution, shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.
        </p>
      </section>

      <section id="changes-terms">
        <h2>14. Changes to These Terms</h2>
        <p>
          We may revise these Terms from time to time. Continued use of the Platform after changes take effect
          constitutes acceptance of the revised Terms. Material changes will be notified via email, SMS, or an in-app
          notice.
        </p>
      </section>

      <section id="contact-terms">
        <h2>15. Contact Us</h2>
        <p>
          For questions about these Terms, contact us at <strong>legal@jansamaadhan.in</strong> or
          1800-XXX-XXXX (toll-free, Mon–Sat, 9 AM–7 PM).
        </p>
      </section>

    </LegalPageLayout>
  )
}
