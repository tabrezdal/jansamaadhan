'use client'

import { useState } from 'react'
import {
  User, Phone, MapPin, Briefcase, Shield,
  CheckCircle, Edit2, Save, X, Bell, LogOut
} from 'lucide-react'

const PROFESSIONS = [
  { id: 'salaried',    label: 'Salaried Employee',   emoji: '👨‍💼' },
  { id: 'business',   label: 'Business Owner',       emoji: '🏪' },
  { id: 'freelancer', label: 'Freelancer',            emoji: '💻' },
  { id: 'farmer',     label: 'Farmer / Agri',        emoji: '👨‍🌾' },
  { id: 'gig',        label: 'Gig Worker',            emoji: '🚗' },
  { id: 'other',      label: 'Other',                emoji: '🎓' },
]

const STATES = [
  'Gujarat','Maharashtra','Rajasthan','Uttar Pradesh','Delhi',
  'Karnataka','Tamil Nadu','West Bengal','Bihar','Madhya Pradesh',
]

export default function ProfilePage() {
  const [editBasic, setEditBasic] = useState(false)
  const [editKyc,   setEditKyc]   = useState(false)
  const [saved,     setSaved]     = useState(false)

  const [form, setForm] = useState({
    name:       'Ramesh Kumar',
    phone:      '+91 98765 43210',
    email:      'ramesh.kumar@gmail.com',
    profession: 'salaried',
    state:      'Gujarat',
    city:       'Ahmedabad',
    pan:        'ABCPK1234D',
    aadhaar:    '****-****-4321',
  })

  const [notifs, setNotifs] = useState({
    orderUpdates: true,
    deadlines:    true,
    offers:       false,
    whatsapp:     true,
  })

  function handleSave() {
    setEditBasic(false)
    setEditKyc(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const profession = PROFESSIONS.find(p => p.id === form.profession)

  return (
    <div className="space-y-5 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account details and preferences.</p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          <CheckCircle size={16} />
          Profile updated successfully.
        </div>
      )}

      {/* Avatar + summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-teal flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0">
          {form.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 text-lg">{form.name}</h2>
          <p className="text-sm text-gray-400">{form.phone}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs bg-brand-surface text-brand-teal px-2 py-0.5 rounded-lg font-medium">
              {profession?.emoji} {profession?.label}
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">
              {form.state}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-lg">
            <Shield size={11} />
            Verified
          </span>
          <span className="text-[11px] text-gray-400">Member since Jan 2025</span>
        </div>
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
              <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal text-white text-xs font-semibold rounded-lg hover:bg-brand-teal2 transition-colors">
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
            { label: 'Full name',   key: 'name',   type: 'text',  icon: User },
            { label: 'Email',       key: 'email',  type: 'email', icon: User },
            { label: 'City',        key: 'city',   type: 'text',  icon: MapPin },
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

          {/* Profession selector */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Profession</label>
            {editBasic ? (
              <select
                value={form.profession}
                onChange={e => setForm(f => ({ ...f, profession: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-brand-teal outline-none text-sm text-gray-800 transition-all"
              >
                {PROFESSIONS.map(p => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium text-gray-800">{profession?.emoji} {profession?.label}</p>
            )}
          </div>

          {/* State selector */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">State</label>
            {editBasic ? (
              <select
                value={form.state}
                onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-brand-teal outline-none text-sm text-gray-800 transition-all"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <p className="text-sm font-medium text-gray-800">{form.state}</p>
            )}
          </div>
        </div>
      </div>

      {/* KYC / identity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Shield size={16} className="text-brand-teal" />
            Identity (KYC)
          </h3>
          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
            <CheckCircle size={12} />
            Verified
          </span>
        </div>

        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Mobile number</label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-800">{form.phone}</p>
              <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-semibold">OTP Verified</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">PAN number</label>
            <p className="text-sm font-medium text-gray-800 font-mono">{form.pan}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Aadhaar (masked)</label>
            <p className="text-sm font-medium text-gray-800 font-mono">{form.aadhaar}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">DigiLocker</label>
            <button className="flex items-center gap-1.5 text-xs text-brand-teal font-semibold hover:text-brand-teal2 transition-colors">
              + Link DigiLocker account
            </button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Shield size={11} className="text-green-500" />
            Your identity documents are encrypted and never shared with third parties.
          </p>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Bell size={16} className="text-brand-teal" />
            Notification Preferences
          </h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          {[
            { key: 'orderUpdates', label: 'Order status updates',     sub: 'SMS when your order progresses or completes' },
            { key: 'deadlines',    label: 'Tax & filing deadlines',    sub: 'ITR, GST, and compliance deadline reminders' },
            { key: 'offers',       label: 'Offers & new services',     sub: 'Promotional messages and new service alerts' },
            { key: 'whatsapp',     label: 'WhatsApp notifications',    sub: 'Get updates on WhatsApp as well as SMS' },
          ].map(n => (
            <div key={n.key} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{n.label}</p>
                <p className="text-xs text-gray-400">{n.sub}</p>
              </div>
              <button
                onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifs] }))}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0
                  ${notifs[n.key as keyof typeof notifs] ? 'bg-brand-teal' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                  ${notifs[n.key as keyof typeof notifs] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800">Account Actions</h3>
        </div>
        <div className="px-5 py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login' }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={15} />
            Sign out of all devices
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-400 text-sm font-medium hover:border-red-300 hover:text-red-500 transition-all">
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
