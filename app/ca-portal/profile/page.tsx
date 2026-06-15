'use client'

import { useState } from 'react'
import {
  User, Phone, Mail, MapPin, ShieldCheck, Star,
  Edit2, Save, X, CheckCircle, LogOut, Wallet,
  Briefcase, Award, Power
} from 'lucide-react'
import { CA_PROFILE } from '@/lib/caData'

const ALL_SPECIALIZATIONS = [
  'Income Tax', 'GST', 'TDS', 'Capital Gains', 'Legal Documents',
  'Business Registration', 'Audit', 'Payroll', 'NRI Taxation',
]

export default function CAProfilePage() {
  const [editBasic, setEditBasic] = useState(false)
  const [editBank,  setEditBank]  = useState(false)
  const [saved,     setSaved]     = useState(false)

  const [form, setForm] = useState({
    name:    CA_PROFILE.name,
    email:   CA_PROFILE.email,
    phone:   CA_PROFILE.phone,
    city:    CA_PROFILE.city,
    bankAccount: CA_PROFILE.bankAccount,
    bankIfsc:    CA_PROFILE.bankIfsc,
    upiId:       CA_PROFILE.upiId,
  })

  const [available, setAvailable] = useState(CA_PROFILE.available)
  const [specializations, setSpecializations] = useState<string[]>(CA_PROFILE.specializations)

  function toggleSpecialization(s: string) {
    setSpecializations(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function handleSave(which: 'basic' | 'bank') {
    if (which === 'basic') setEditBasic(false)
    if (which === 'bank')  setEditBank(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-5 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your CA profile, availability, and payout details.</p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          <CheckCircle size={16} />
          Profile updated successfully.
        </div>
      )}

      {/* Avatar + summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 flex-wrap">
        <div className="w-16 h-16 rounded-2xl bg-brand-teal flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0">
          {form.name.replace('CA ', '').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-gray-900 text-lg">{form.name}</h2>
            {CA_PROFILE.verified && <ShieldCheck size={15} className="text-brand-green flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-400">{CA_PROFILE.icaiNumber}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg font-medium">
              <Star size={11} className="fill-amber-500 text-amber-500" /> {CA_PROFILE.rating} ({CA_PROFILE.totalReviews})
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">
              {CA_PROFILE.completedCases} cases completed
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-lg">
            <ShieldCheck size={11} />
            ICAI Verified
          </span>
          <span className="text-[11px] text-gray-400">Member since {CA_PROFILE.memberSince}</span>
        </div>
      </div>

      {/* Availability toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${available ? 'bg-green-50' : 'bg-gray-100'}`}>
            <Power size={18} className={available ? 'text-green-600' : 'text-gray-400'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {available ? 'Accepting new cases' : 'Not accepting new cases'}
            </p>
            <p className="text-xs text-gray-400">
              {available ? 'New cases may be assigned to you automatically.' : 'You won\'t receive new case assignments.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setAvailable(a => !a)}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${available ? 'bg-brand-teal' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${available ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <User size={16} className="text-brand-teal" />
            Basic Information
          </h3>
          {editBasic ? (
            <div className="flex gap-2">
              <button onClick={() => setEditBasic(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X size={15} /></button>
              <button onClick={() => handleSave('basic')} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal text-white text-xs font-semibold rounded-lg hover:bg-brand-teal2 transition-colors">
                <Save size={13} />Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditBasic(true)} className="flex items-center gap-1.5 text-xs font-medium text-brand-teal hover:text-brand-teal2 transition-colors">
              <Edit2 size={13} />Edit
            </button>
          )}
        </div>

        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full name', key: 'name',  type: 'text',  icon: User },
            { label: 'Email',     key: 'email', type: 'email', icon: Mail },
            { label: 'Phone',     key: 'phone', type: 'tel',   icon: Phone },
            { label: 'City',      key: 'city',  type: 'text',  icon: MapPin },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
              {editBasic ? (
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-brand-teal outline-none text-sm text-gray-800 transition-all"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">{form[field.key as keyof typeof form]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ICAI verification */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Award size={16} className="text-brand-teal" />
            ICAI Verification
          </h3>
          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
            <CheckCircle size={12} />
            Verified
          </span>
        </div>

        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Membership number</label>
            <p className="text-sm font-medium text-gray-800 font-mono">{CA_PROFILE.icaiNumber}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Verification status</label>
            <p className="text-sm font-medium text-green-600 flex items-center gap-1.5"><ShieldCheck size={14} /> Verified with ICAI database</p>
          </div>
        </div>

        <div className="px-5 pb-4">
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SPECIALIZATIONS.map(s => {
              const active = specializations.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => toggleSpecialization(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                    ${active
                      ? 'border-brand-teal bg-brand-surface text-brand-teal'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-brand-teal/40'
                    }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Cases matching your specializations are prioritised in your queue.</p>
        </div>
      </div>

      {/* Payout details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Wallet size={16} className="text-brand-teal" />
            Payout Details
          </h3>
          {editBank ? (
            <div className="flex gap-2">
              <button onClick={() => setEditBank(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X size={15} /></button>
              <button onClick={() => handleSave('bank')} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal text-white text-xs font-semibold rounded-lg hover:bg-brand-teal2 transition-colors">
                <Save size={13} />Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditBank(true)} className="flex items-center gap-1.5 text-xs font-medium text-brand-teal hover:text-brand-teal2 transition-colors">
              <Edit2 size={13} />Edit
            </button>
          )}
        </div>

        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Bank account number', key: 'bankAccount' },
            { label: 'IFSC code',            key: 'bankIfsc' },
            { label: 'UPI ID',                key: 'upiId' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
              {editBank ? (
                <input
                  type="text"
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-brand-teal outline-none text-sm text-gray-800 font-mono transition-all"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 font-mono">{form[field.key as keyof typeof form]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="px-5 pb-4">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-green-500" />
            Payout details are encrypted and used only for monthly settlements.
          </p>
        </div>
      </div>

      {/* Account actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Briefcase size={16} className="text-brand-teal" />
            Account Actions
          </h3>
        </div>
        <div className="px-5 py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login' }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}