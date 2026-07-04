'use client'

import { useState, useEffect } from 'react'
import { User, Phone, Mail, CreditCard, Building2, Save, CheckCircle, Star } from 'lucide-react'

const SPECIALIZATIONS = [
  'Income Tax', 'GST', 'TDS', 'Audit', 'Company Law',
  'FEMA / NRI', 'Startup Advisory', 'Accounting', 'Payroll', 'Legal',
]

interface CAProfile {
  name:            string
  phone:           string
  email:           string
  icaiNumber:      string
  icaiVerified:    boolean
  available:       boolean
  rating:          string
  totalReviews:    number
  specializations: string[]
  upiId:           string
  bankIfsc:        string
}

export default function CAProfilePage() {
  const [profile,  setProfile]  = useState<CAProfile | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    fetch('/api/ca/profile')
      .then(r => r.json())
      .then(d => { setProfile(d.profile); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function toggleSpec(s: string) {
    if (!profile) return
    const specs = profile.specializations.includes(s)
      ? profile.specializations.filter(x => x !== s)
      : [...profile.specializations, s]
    setProfile(p => p ? { ...p, specializations: specs } : p)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true); setError('')
    const res = await fetch('/api/ca/profile', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:            profile.name,
        email:           profile.email,
        available:       profile.available,
        specializations: profile.specializations,
        upiId:           profile.upiId,
        bankIfsc:        profile.bankIfsc,
      }),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Failed to save.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-xl">
      <div className="h-8 bg-gray-100 rounded w-40" />
      {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
    </div>
  )

  if (!profile) return <div className="text-gray-500 text-sm">Failed to load profile.</div>

  return (
    <div className="space-y-6 max-w-xl">

      <div>
        <h2 className="font-display font-bold text-xl text-brand-ink">CA Profile</h2>
        <p className="text-sm text-gray-500 mt-0.5">Your profile is shown to customers when you're assigned their case.</p>
      </div>

      {/* Avatar + rating */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-teal flex items-center justify-center text-white font-display font-bold text-2xl">
          {(profile.name || 'CA')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{profile.name || 'Your Name'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Star size={11} className="text-brand-amber fill-brand-amber" />
              {profile.rating} · {profile.totalReviews} reviews
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${profile.icaiVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {profile.icaiVerified ? 'ICAI Verified ✓' : 'Verification Pending'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name</label>
          <div className="relative">
            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="CA Ramesh Kumar" value={profile.name}
              onChange={e => setProfile(p => p ? { ...p, name: e.target.value } : p)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors" />
          </div>
        </div>

        {/* Phone — readonly */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Mobile number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={`+91 ${profile.phone}`} readOnly
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        {/* ICAI — readonly */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">ICAI Membership Number</label>
          <div className="relative">
            <Building2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={profile.icaiNumber} readOnly
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">ICAI number cannot be changed. Contact support if incorrect.</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" placeholder="ca@email.com" value={profile.email}
              onChange={e => setProfile(p => p ? { ...p, email: e.target.value } : p)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors" />
          </div>
        </div>

        {/* Availability toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
          <div>
            <p className="text-sm font-medium text-gray-700">Accepting new cases</p>
            <p className="text-xs text-gray-400">Toggle off when you're at capacity</p>
          </div>
          <button type="button" onClick={() => setProfile(p => p ? { ...p, available: !p.available } : p)}
            className={`relative w-12 h-6 rounded-full transition-colors ${profile.available ? 'bg-brand-teal' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${profile.available ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map(s => (
              <button key={s} type="button" onClick={() => toggleSpec(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                  ${profile.specializations.includes(s)
                    ? 'border-brand-teal bg-brand-surface text-brand-teal'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-teal/40'
                  }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Payment details */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-700">Payment details (for monthly payouts)</p>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">UPI ID</label>
            <div className="relative">
              <CreditCard size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="yourname@upi" value={profile.upiId}
                onChange={e => setProfile(p => p ? { ...p, upiId: e.target.value } : p)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Bank IFSC</label>
            <input type="text" placeholder="SBIN0001234" value={profile.bankIfsc}
              onChange={e => setProfile(p => p ? { ...p, bankIfsc: e.target.value.toUpperCase() } : p)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

        <button type="submit" disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all
            ${saved ? 'bg-green-500 text-white' : saving ? 'bg-brand-teal/60 text-white cursor-not-allowed' : 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-sm'}`}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : saving ? 'Saving…' : <><Save size={15} /> Save Profile</>}
        </button>
      </form>
    </div>
  )
}
