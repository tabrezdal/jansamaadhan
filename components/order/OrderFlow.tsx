'use client'

import { useState } from 'react'
import type { Service, ServicePlan } from '@/lib/services'
import StepBar   from './StepBar'
import Step1Plan from './Step1Plan'
import Step2Docs from './Step2Docs'
import Step3Review from './Step3Review'
import Step4Pay  from './Step4Pay'

export interface OrderState {
  selectedPlan:    ServicePlan | null
  uploadedDocs:    Record<string, File>    // docId → File (for UI preview)
  uploadedDocKeys: Record<string, string>  // docId → Supabase objectKey (for API)
  name:            string
  email:           string
  notes:           string
}

const STEPS = [
  { num: 1, label: 'Choose Plan' },
  { num: 2, label: 'Documents' },
  { num: 3, label: 'Review' },
  { num: 4, label: 'Payment' },
]

export default function OrderFlow({ service }: { service: Service }) {
  const [step,  setStep]  = useState(1)
  const [order, setOrder] = useState<OrderState>({
    selectedPlan:    service.plans.length === 1 ? service.plans[0] : null,
    uploadedDocs:    {},
    uploadedDocKeys: {},
    name:            '',
    email:           '',
    notes:           '',
  })

  function updateOrder(patch: Partial<OrderState>) {
    setOrder(prev => ({ ...prev, ...patch }))
  }

  function next() { setStep(s => Math.min(s + 1, 4)) }
  function back() { setStep(s => Math.max(s - 1, 1)) }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <StepBar steps={STEPS} current={step} />
      <div className="mt-8">
        {step === 1 && <Step1Plan service={service} order={order} onUpdate={updateOrder} onNext={next} />}
        {step === 2 && <Step2Docs service={service} order={order} onUpdate={updateOrder} onNext={next} onBack={back} />}
        {step === 3 && <Step3Review service={service} order={order} onNext={next} onBack={back} onEdit={s => setStep(s)} />}
        {step === 4 && <Step4Pay service={service} order={order} onBack={back} />}
      </div>
    </div>
  )
}
