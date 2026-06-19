import type { Metadata } from 'next'
import LegalPageLayout, { type LegalSection } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Disclaimer — JanSamaadhan',
  description: 'Important clarifications on the nature of JanSamaadhan\'s platform, the role of independent CAs, and the limits of guidance provided.',
}

const SECTIONS: LegalSection[] = [
  { id: 'not-a-firm',     title: '1. Not a CA Firm' },
  { id: 'no-guarantee',   title: '2. No Guarantee of Outcome' },
  { id: 'not-advice',     title: '3. Not Personalised Financial/Legal Advice' },
  { id: 'govt-portals',   title: '4. Dependence on Government Portals' },
  { id: 'pricing-accuracy', title: '5. Pricing & Comparison Accuracy' },
  { id: 'third-party',    title: '6. Third-Party Links & Services' },
  { id: 'accuracy',       title: '7. Accuracy of Information' },
  { id: 'no-warranty',    title: '8. No Warranty' },
  { id: 'contact-disclaimer', title: '9. Contact Us' },
]

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Disclaimer" effective="1 January 2026" sections={SECTIONS}>

      <section id="not-a-firm">
        <h2>1. Not a CA Firm</h2>
        <p>
          JanSamaadhan Technologies Pvt. Ltd. is a technology platform that facilitates access to independent
          Chartered Accountants ("CAs") and self-service compliance tools. <strong>JanSamaadhan is not itself a
          Chartered Accountancy firm</strong> and does not practice as one. Professional services — tax filing
          decisions, audit opinions, notice responses, and similar — are rendered by individual CAs in their
          independent professional capacity, regulated by the Institute of Chartered Accountants of India (ICAI)
          and the Chartered Accountants Act, 1949.
        </p>
      </section>

      <section id="no-guarantee">
        <h2>2. No Guarantee of Outcome</h2>
        <p>
          While we commit to defined service-level timelines (see our <a href="/refund-policy">Refund Policy</a>) and
          work with verified professionals, JanSamaadhan does not and cannot guarantee specific outcomes such as:
        </p>
        <ul>
          <li>The amount or timing of any income tax refund — this is determined solely by the Income Tax Department.</li>
          <li>Approval of any government application (PAN, Aadhaar update, GST registration, passport, driving licence, etc.) — final approval rests with the respective government authority.</li>
          <li>The outcome of any notice response, appeal, or dispute with a tax or regulatory authority.</li>
          <li>Loan, subsidy, or scheme approval where we provide only documentation assistance.</li>
        </ul>
      </section>

      <section id="not-advice">
        <h2>3. Not Personalised Financial/Legal Advice</h2>
        <p>
          General content on the Platform — FAQs, service descriptions, blog articles, and comparison tables — is
          provided for informational purposes only and should not be treated as personalised tax, legal, financial,
          or investment advice. Your specific situation may involve facts that change the applicable treatment. Where
          a service includes CA review (as indicated on the relevant service page), that CA's specific guidance to you
          for your order constitutes the professional advice for that engagement — not the general content elsewhere
          on the Platform.
        </p>
      </section>

      <section id="govt-portals">
        <h2>4. Dependence on Government Portals</h2>
        <p>
          Most services on JanSamaadhan involve submission to government systems we do not own or control, including
          the Income Tax e-filing portal, GSTN, UIDAI, NSDL, UTIITSL, DigiLocker, EPFO, Passport Seva, state e-district
          portals, and others. Downtime, policy changes, processing delays, or errors on these third-party systems are
          outside our control, and we are not responsible for their availability or accuracy, though we will keep you
          informed and assist with resubmission where reasonably possible.
        </p>
      </section>

      <section id="pricing-accuracy">
        <h2>5. Pricing &amp; Comparison Accuracy</h2>
        <p>
          Comparisons shown on the Platform against local agents or other service providers (such as our pricing
          comparison table) are based on publicly available information and typical market rates at the time of
          publishing, and are intended as general illustrations. Actual agent or competitor pricing may vary by
          location, complexity, and time. We update these comparisons periodically but do not guarantee they reflect
          real-time competitor pricing at every moment.
        </p>
      </section>

      <section id="third-party">
        <h2>6. Third-Party Links &amp; Services</h2>
        <p>
          The Platform may link to or integrate with third-party services (payment gateways, government portals,
          WhatsApp, SMS providers). We are not responsible for the content, privacy practices, or terms of these
          third-party services, which are governed by their own respective policies.
        </p>
      </section>

      <section id="accuracy">
        <h2>7. Accuracy of Information</h2>
        <p>
          We make reasonable efforts to keep service descriptions, pricing, SLAs, and document checklists accurate and
          up to date, including for changes in tax law, government fee structures, or filing procedures. However, tax
          and regulatory rules in India change frequently. In case of any discrepancy between content on the Platform
          and the current law or government notification, the official government source and your assigned CA's
          specific guidance for your case will prevail.
        </p>
      </section>

      <section id="no-warranty">
        <h2>8. No Warranty</h2>
        <p>
          The Platform and its content are provided on an "as is" and "as available" basis. To the maximum extent
          permitted by law, we disclaim all warranties, express or implied, regarding the Platform's operation,
          uninterrupted availability, or fitness for a particular purpose, without prejudice to any statutory rights
          you may have as a consumer under Indian law, including the Consumer Protection Act, 2019.
        </p>
      </section>

      <section id="contact-disclaimer">
        <h2>9. Contact Us</h2>
        <p>
          If you believe any content on the Platform is inaccurate or misleading, please write to us at
          <strong> legal@jansamaadhan.in</strong> so we can review and correct it promptly.
        </p>
      </section>

    </LegalPageLayout>
  )
}
