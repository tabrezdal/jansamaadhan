'use client'

import { useState, useEffect } from 'react'
import { User, Phone, Mail, MapPin, Briefcase, Save, CheckCircle } from 'lucide-react'

interface Profile {
  name:       string
  phone:      string
  email:      string
  city:       string
  state:      string
  profession: string
}

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
]

const PROFESSIONS = ['Salaried','Business Owner','Freelancer / Consultant','Professional (CA/Doctor/Lawyer)','Student','Homemaker','Retired','Other']

export default function ProfilePage() {
  const [profile,  setProfile]  = useState<Profile>({ name: '', phone: '', email: '', city: '', state: '', profession: '' })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { setProfile(data.profile ?? {}); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">

      <div>
        <h2 className="font-display font-bold text-xl text-brand-ink">My Profile</h2>
        <p className="text-sm text-gray-500 mt-0.5">Keep your details up to date for accurate service delivery.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-teal flex items-center justify-center text-white font-display font-bold text-2xl">
          {(profile.name || profile.phone || 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{profile.name || 'Your Name'}</p>
          <p className="text-sm text-gray-400">+91 {profile.phone}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name</label>
          <div className="relative">
            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Ramesh Kumar"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors"
            />
          </div>
        </div>

        {/* Phone — readonly */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Mobile number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={`+91 ${profile.phone}`} readOnly
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Mobile number cannot be changed. Contact support if needed.</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Email (optional)</label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email" placeholder="ramesh@email.com"
              value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors"
            />
          </div>
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">City</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" placeholder="Ahmedabad"
                value={profile.city}
                onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">State</label>
            <select
              value={profile.state}
              onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors"
            >
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Profession */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Profession</label>
          <div className="relative">
            <Briefcase size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={profile.profession}
              onChange={e => setProfile(p => ({ ...p, profession: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-teal outline-none text-sm bg-white transition-colors"
            >
              <option value="">Select profession</option>
              {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all
            ${saved
              ? 'bg-green-500 text-white'
              : saving
                ? 'bg-brand-teal/60 text-white cursor-not-allowed'
                : 'bg-brand-teal text-white hover:bg-brand-teal2 shadow-sm'
            }`}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : saving ? 'Saving…' : <><Save size={15} /> Save Changes</>}
        </button>
      </form>
    </div>
  )
}
