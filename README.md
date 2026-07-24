# JanSamaadhan — जन समाधान
## India's Most Affordable Citizen Services Platform

### Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# → Open http://localhost:3000

# Build for production
npm run build
npm start
```

---

### Project Structure

```
jansamaadhan/
├── app/
│   ├── layout.tsx          ← Root layout (fonts, metadata, global CSS)
│   ├── globals.css         ← Brand tokens, animations, utilities
│   └── page.tsx            ← Homepage (assembles all sections)
│
├── components/
│   ├── Navbar.tsx          ← Sticky glassmorphic nav with mobile drawer
│   ├── Footer.tsx          ← Full footer with links, language switcher
│   └── sections/
│       ├── HeroSection.tsx       ← Full-screen hero, bilingual, animated
│       ├── TickerStrip.tsx       ← Live social proof marquee
│       ├── ServicesSection.tsx   ← Top 12 services with category filter
│       ├── HowItWorksSection.tsx ← 5-step visual flow
│       ├── TrustSection.tsx      ← Stats, testimonials, trust logos
│       ├── ComparisonSection.tsx ← vs Agent / ClearTax / JioFinance
│       ├── FAQSection.tsx        ← Accordion FAQ in Hinglish
│       └── CTASection.tsx        ← Final conversion section
│
├── tailwind.config.js      ← Brand colors, fonts, animations
├── tsconfig.json
└── package.json
```

---

### Brand Tokens (tailwind.config.js)

| Token              | Value     | Usage                          |
|--------------------|-----------|-------------------------------|
| `brand-teal`       | `#1A5F7A` | Primary brand, buttons, nav   |
| `brand-teal2`      | `#14495E` | Hover states                  |
| `brand-amber`      | `#F4A300` | CTAs, highlights, badges      |
| `brand-surface`    | `#E8F4F8` | Page backgrounds, hovers      |
| `brand-green`      | `#2D7A3A` | Success states, savings       |
| `brand-ink`        | `#1A1A2E` | Body text                     |

---

### Auth module (this release)

| File | Purpose |
|------|---------|
| `app/(auth)/layout.tsx` | Split-panel layout — brand left, form right |
| `app/(auth)/register/page.tsx` | Mobile number entry → sends OTP |
| `app/(auth)/register/verify/page.tsx` | 6-box OTP entry, auto-advance, resend timer |
| `app/(auth)/login/page.tsx` | Login via OTP (same verify flow) |
| `app/onboarding/page.tsx` | 3-step post-registration: profession → state → done |
| `components/auth/OTPInput.tsx` | Reusable 6-digit OTP box component |
| `components/auth/PhoneInput.tsx` | Indian phone field with +91 prefix, validation |
| `components/auth/ResendTimer.tsx` | Countdown timer + resend + WhatsApp fallback |
| `hooks/useAuth.ts` | Shared auth hook (send OTP, verify OTP, state) |
| `middleware.ts` | Route protection — redirects unauthenticated users |
| `app/api/auth/send-otp/route.ts` | Server: rate-limited OTP dispatch (Msg91 / Twilio) |
| `app/api/auth/verify-otp/route.ts` | Server: verify OTP → set httpOnly session cookie |
| `app/api/auth/logout/route.ts` | Server: clear session cookie |

### OTP providers — plug in one

```bash
# Msg91 (recommended for India, cheapest)
MSG91_AUTH_KEY=...
MSG91_OTP_TEMPLATE_ID=...

# Twilio Verify (global, reliable)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SID=...
```

Uncomment the relevant block in `app/api/auth/send-otp/route.ts` and `verify-otp/route.ts`.

**Dev mode OTP:** any 6-digit code except `000000` is accepted. Console prints `[DEV] OTP for XXXXXXXXXX: 123456`.

---

### Next Pages to Build

| Page                | Route              | Priority |
|---------------------|--------------------|----------|
| User dashboard      | `/dashboard`       | P1 next  |
| Services listing    | `/services`        | P1       |
| Order flow          | `/order/[service]` | P1       |
| CA portal           | `/ca-portal`       | P2       |

---

### Environment Variables (create `.env.local`)

```env
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxx
NEXT_PUBLIC_WA_NUMBER=919664850011
NEXT_PUBLIC_TOLL_FREE=9664850011
NEXT_PUBLIC_SITE_URL=https://jansamaadhan.in
```

---

### Deployment

**Vercel (recommended)**
```bash
vercel deploy
```

**Self-hosted**
```bash
npm run build
npm start   # runs on port 3000
```

Use NGINX reverse proxy on port 80/443 with SSL.

---

*Built for 1.4 billion Indians — आपकी सेवा, आपका हक*
