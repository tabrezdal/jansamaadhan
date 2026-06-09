'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, User, MapPin, Briefcase } from 'lucide-react'

const PROFESSIONS = [
  { id: 'salaried',    label: 'Salaried Employee',    emoji: '👨‍💼', desc: 'Working in company / govt job' },
  { id: 'business',   label: 'Business Owner',        emoji: '🏪', desc: 'Shop, MSME, trading, etc.' },
  { id: 'freelancer', label: 'Freelancer / Professional', emoji: '💻', desc: 'Consultants, doctors, architects' },
  { id: 'farmer',     label: 'Farmer / Agri',         emoji: '👨‍🌾', desc: 'Agricultural income' },
  { id: 'gig',        label: 'Gig Worker',            emoji: '🚗', desc: 'Ola, Swiggy, Zomato, etc.' },
  { id: 'other',      label: 'Other / Student',       emoji: '🎓', desc: 'NRI, housewife, retired, etc.' },
]

const STATES = [
  'Gujarat','Maharashtra','Rajasthan','Uttar Pradesh','Madhya Pradesh',
  'Karnataka','Tamil Nadu','Delhi','West Bengal','Bihar',
  'Andhra Pradesh','Telangana','Kerala','Punjab','Haryana',
  'Odisha','Chhattisgarh','Jharkhand','Assam','Other',
]

const STEPS = [
  { id: 1, label: 'Profession', icon: Briefcase },
  { id: 2, label: 'Location',   icon: MapPin },
  { id: 3, label: 'Done!',      icon: CheckCircle },
]

export default function OnboardingPage() {
  const router      = useRouter()
  const [step,      setStep]      = useState(1)
  const [profession,setProfession]= useState('')
  const [state,     setState]     = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleFinish() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setStep(3)
    await new Promise(r => setTimeout(r, 1500))
    router.push('/dashboard')
  }

  return (
    <div>
      {/* Progress steps */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((s, i) => {
          const Icon    = s.icon
          const done    = step > s.id
          const current = step === s.id
          const last    = i === STEPS.length - 1
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                  ${done    ? 'bg-brand-green text-white shadow-sm'
                  : current ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/25'
                  :           'bg-gray-100 text-gray-400'}`}
                >
                  {done ? <CheckCircle size={17} /> : <Icon size={16} />}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block transition-colors ${current ? 'text-brand-teal' : done ? 'text-brand-green' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {!last && (
                <div className={`flex-1 h-px mx-2 mt-[-18px] sm:mt-[-22px] transition-colors ${done ? 'bg-brand-green' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step 1: Profession ── */}
      {step === 1 && (
        <div>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-brand-ink mb-1">
              What best describes you?
            </h1>
            <p className="text-gray-500 text-sm">
              We'll personalise your service recommendations. Takes 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            {PROFESSIONS.map(p => (
              <button
                key={p.id}
                onClick={() => setProfession(p.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-150
                  ${profession === p.id
                    ? 'border-brand-teal bg-brand-surface shadow-sm'
                    : 'border-gray-200 bg-white hover:border-brand-teal/30 hover:bg-gray-50'
                  }`}
              >
                <span className="text-2xl flex-shrink-0">{p.emoji}</span>
                <div>
                  <div className={`text-sm font-semibold ${profession === p.id ? 'text-brand-teal' : 'text-brand-ink'}`}>
                    {p.label}
                  </div>
                  <div className="text-xs text-gray-400">{p.desc}</div>
                </div>
                {profession === p.id && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-brand-teal flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!profession}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all
              ${!profession
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-md shadow-brand-teal/20 hover:-translate-y-0.5'
              }`}
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* ── Step 2: State ── */}
      {step === 2 && (
        <div>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-brand-ink mb-1">
              Which state are you in?
            </h1>
            <p className="text-gray-500 text-sm">
              Helps us show state-specific services and correct CA experts.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your state</label>
            <div className="relative">
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className={`w-full appearance-none px-4 py-3.5 rounded-2xl border-2 bg-white outline-none text-sm transition-all
                  ${state
                    ? 'border-brand-teal text-brand-ink'
                    : 'border-gray-200 text-gray-400 focus:border-brand-teal'
                  }`}
              >
                <option value="">Select your state…</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick-pick popular states */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-2">Quick pick</p>
            <div className="flex flex-wrap gap-2">
              {['Gujarat','Maharashtra','Rajasthan','Delhi','Karnataka','UP'].map(s => (
                <button
                  key={s}
                  onClick={() => setState(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                    ${state === s
                      ? 'border-brand-teal bg-brand-surface text-brand-teal'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-brand-teal/40'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              disabled={!state || loading}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all
                ${!state
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-md shadow-brand-teal/20 hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Setting up…
                </>
              ) : (
                <>
                  Go to my dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            You can update this anytime in your profile.
          </p>
        </div>
      )}

      {/* ── Step 3: Success ── */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={44} className="text-brand-green" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-2">
            Account ready! 🎉
          </h2>
          <p className="text-gray-500 text-sm mb-1">Welcome to JanSamaadhan.</p>
          <p className="text-gray-400 text-sm">Taking you to your dashboard…</p>
          <div className="mt-6 flex justify-center">
            <div className="flex gap-1.5">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
