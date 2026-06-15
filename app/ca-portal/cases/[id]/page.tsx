import { notFound } from 'next/navigation'
import { getCaseById } from '@/lib/caData'
import CaseDetailView from '@/components/ca-portal/CaseDetailView'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const c = getCaseById(params.id)
  if (!c) return {}
  return {
    title: `${c.service} — ${c.orderId} — CA Portal`,
  }
}

export default function CaseDetailPage({ params }: Props) {
  const c = getCaseById(params.id)
  if (!c) notFound()

  return <CaseDetailView initialCase={c} />
}