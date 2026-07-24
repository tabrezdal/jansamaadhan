import type { Metadata } from 'next'
import LegalPageLayout, { type LegalSection } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy — JanSamaadhan',
  description: 'How JanSamaadhan collects, uses, stores, and protects your personal data, in compliance with the Digital Personal Data Protection Act (DPDPA), 2023.',
}

const SECTIONS: LegalSection[] = [
  { id: 'overview',       title: '1. Overview' },
  { id: 'data-we-collect', title: '2. Data We Collect' },
  { id: 'how-we-use',     title: '3. How We Use Your Data' },
  { id: 'aadhaar',        title: '4. Special Note on Aadhaar' },
  { id: 'document-vault', title: '5. Document Vault & Encryption' },
  { id: 'sharing',        title: '6. Sharing With CAs & Third Parties' },
  { id: 'retention',      title: '7. Data Retention' },
  { id: 'your-rights',    title: '8. Your Rights Under DPDPA' },
  { id: 'cookies',        title: '9. Cookies & Sessions' },
  { id: 'security',       title: '10. Security Practices' },
  { id: 'children',       title: '11. Children\'s Data' },
  { id: 'changes',        title: '12. Changes to This Policy' },
  { id: 'contact',        title: '13. Contact Us' },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" effective="1 January 2026" sections={SECTIONS}>

      <section id="overview">
        <h2>1. Overview</h2>
        <p>
          JanSamaadhan ("we", "us", "our", "the Platform") is operated to help individuals and small businesses across India
          access income tax filing, PAN, Aadhaar, GST, government certificate, and legal documentation services through
          verified Chartered Accountants ("CAs") and guided self-service tools. This Privacy Policy explains what personal
          data we collect when you use jansamaadhan.in or our mobile experience, why we collect it, how it is stored and
          protected, and what rights you have over it.
        </p>
        <p>
          This Policy is framed in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and
          its 2025 implementation rules. By registering on JanSamaadhan or using any of our services, you agree to the
          practices described here. If you do not agree, please do not use the Platform.
        </p>
      </section>

      <section id="data-we-collect">
        <h2>2. Data We Collect</h2>
        <p>We collect only the data necessary to deliver the service you have requested. This includes:</p>
        <ul>
          <li><strong>Identity data:</strong> your name, mobile number, email address (optional), and date of birth where required for a specific filing.</li>
          <li><strong>Service-specific documents:</strong> Form 16, bank statements, broker P&amp;L statements, property documents, business registration proofs, and similar files you upload as part of an order.</li>
          <li><strong>PAN details:</strong> your PAN number, where required to complete a filing or application.</li>
          <li><strong>Communication data:</strong> messages, notes, or queries you exchange with your assigned CA or our support team.</li>
          <li><strong>Usage data:</strong> pages visited, device type, and approximate location (city-level, from IP) — used only for service reliability and fraud prevention, never sold to advertisers.</li>
        </ul>
      </section>

      <section id="how-we-use">
        <h2>3. How We Use Your Data</h2>
        <p>Your data is used strictly to:</p>
        <ul>
          <li>Verify your identity via one-time password (OTP) during registration and login.</li>
          <li>Match you with a qualified, ICAI-verified CA for your specific service.</li>
          <li>Prepare, file, or submit your application on the relevant government portal (Income Tax e-filing, GSTN, UIDAI, NSDL/UTIITSL, DigiLocker, EPFO, and similar).</li>
          <li>Send you SMS, WhatsApp, or email updates about your order status, deadlines, and deliverables.</li>
          <li>Store your filed documents and acknowledgements in your personal Document Vault for future reference.</li>
          <li>Improve our services through aggregated, anonymised usage analysis — never by reading your individual filed documents for marketing purposes.</li>
        </ul>
        <p>We do not use your financial or identity documents for advertising, profiling, or resale to any third party.</p>
      </section>

      <section id="aadhaar">
        <h2>4. Special Note on Aadhaar</h2>
        <p>
          Where a service requires your Aadhaar number (for example, PAN–Aadhaar linking or address updates), we collect it
          only for the duration needed to complete that specific request on the UIDAI portal. <strong>We do not store your
          raw Aadhaar number in our database.</strong> Aadhaar numbers entered during an order are encrypted in transit,
          used once for the relevant UIDAI/NSDL transaction, and then either masked (showing only the last 4 digits, as
          displayed in your profile) or purged from active systems, consistent with UIDAI's data minimisation requirements
          under the Aadhaar Act, 2016 and DPDPA, 2023.
        </p>
      </section>

      <section id="document-vault">
        <h2>5. Document Vault &amp; Encryption</h2>
        <p>
          Documents you upload (Form 16, bank statements, certificates, agreements, and acknowledgements such as ITR-V or
          Udyam certificates) are stored in your personal Document Vault using <strong>AES-256 encryption</strong> at rest,
          and TLS 1.2+ encryption in transit. Only you, your assigned CA for the relevant order, and authorised compliance
          staff (for fraud investigation or legal requirements) can access these files. Documents are retained for the
          lifetime of your account unless you request deletion, subject to the retention exceptions described in Section 7.
        </p>
      </section>

      <section id="sharing">
        <h2>6. Sharing With CAs &amp; Third Parties</h2>
        <p>
          When you place an order, the relevant documents and details are shared only with the specific CA assigned to
          that case — never with our full network of CAs. CAs are bound by confidentiality obligations under the
          Chartered Accountants Act, 1949, ICAI's Code of Ethics, and a separate data-handling agreement with JanSamaadhan.
        </p>
        <p>We may also share limited data with:</p>
        <ul>
          <li><strong>Government portals</strong> (Income Tax Department, GSTN, UIDAI, EPFO, DigiLocker, etc.) — strictly to complete the filing or application you requested.</li>
          <li><strong>Payment processors</strong> (currently Razorpay) — to process your payment securely. We do not store your card or UPI credentials.</li>
          <li><strong>SMS/WhatsApp providers</strong> (for OTP delivery and order notifications) — limited to your mobile number and the message content.</li>
          <li><strong>Law enforcement or regulators</strong> — only when legally compelled by a valid court order, summons, or statutory request.</li>
        </ul>
        <p>We never sell, rent, or trade your personal data to advertisers, data brokers, or unrelated third parties.</p>
      </section>

      <section id="retention">
        <h2>7. Data Retention</h2>
        <p>
          We retain your account information and filed documents for as long as your account remains active, so that you
          can access past filings, certificates, and acknowledgements at any time from your Document Vault. If you request
          account deletion, we will erase your personal data within 30 days, except where retention is required by law —
          for example, the Income Tax Act, 1961 requires certain filing records to be retrievable for up to 6 years for
          audit and compliance purposes, even after account deletion.
        </p>
      </section>

      <section id="your-rights">
        <h2>8. Your Rights Under DPDPA</h2>
        <p>As a Data Principal under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> a summary of the personal data we hold about you.</li>
          <li><strong>Correct or update</strong> inaccurate or incomplete data (available directly from your Profile page).</li>
          <li><strong>Withdraw consent</strong> for any specific use of your data at any time, without affecting services already delivered.</li>
          <li><strong>Erasure</strong> — request deletion of your account and associated data, subject to statutory retention exceptions noted in Section 7.</li>
          <li><strong>Grievance redressal</strong> — raise a complaint with our Grievance Officer (Section 13) or subsequently with the Data Protection Board of India.</li>
        </ul>
        <p>To exercise any of these rights, write to us at the contact details in Section 13. We respond to verified requests within 15 business days.</p>
      </section>

      <section id="cookies">
        <h2>9. Cookies &amp; Sessions</h2>
        <p>
          We use a single, essential, <strong>httpOnly session cookie</strong> to keep you logged in after OTP verification.
          This cookie does not track you across other websites and is not used for advertising. We do not currently use
          third-party advertising or tracking cookies. If this changes, we will update this Policy and request your consent
          where required.
        </p>
      </section>

      <section id="security">
        <h2>10. Security Practices</h2>
        <p>We apply industry-standard safeguards, including:</p>
        <ul>
          <li>AES-256 encryption for stored documents and TLS encryption for all data in transit.</li>
          <li>OTP-based authentication — we never ask for or store traditional passwords.</li>
          <li>Role-based access control, so customer data is visible only to the specific CA assigned to that order.</li>
          <li>Regular security reviews of our infrastructure and access logs.</li>
        </ul>
        <p>
          No system can guarantee absolute security. If you discover a vulnerability or suspect unauthorised access to your
          account, please contact us immediately at the details in Section 13.
        </p>
      </section>

      <section id="children">
        <h2>11. Children's Data</h2>
        <p>
          JanSamaadhan's services are intended for individuals aged 18 and above, or for minors whose data is provided by a
          parent or legal guardian acting on their behalf (for example, applying for a minor's first PAN card). We do not
          knowingly collect personal data directly from children without verifiable parental consent, as required under
          DPDPA, 2023.
        </p>
      </section>

      <section id="changes">
        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, services, or applicable
          law. Material changes will be communicated via email, SMS, or an in-app notice before they take effect. The
          "Last updated" date at the top of this page always reflects the most current version.
        </p>
      </section>

      <section id="contact">
        <h2>13. Contact Us</h2>
        <p>
          For any privacy-related questions, data access requests, or grievances, you may contact our Grievance Officer:
        </p>
        <p>
          <strong>Email:</strong> privacy@jansamaadhan.in<br />
          <strong>WhatsApp / Phone:</strong> +91-9664850011 (toll-free, Mon–Sat, 9 AM–7 PM)<br />
          <strong>Registered office:</strong> JanSamaadhan Technologies Pvt. Ltd., Ahmedabad, Gujarat, India.
        </p>
      </section>

    </LegalPageLayout>
  )
}
