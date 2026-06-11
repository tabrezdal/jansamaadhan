import { notFound } from 'next/navigation'
import { getService } from '@/lib/services'
import OrderFlow from '@/components/order/OrderFlow'

interface Props {
  params: { service: string }
}

export async function generateMetadata({ params }: Props) {
  const service = getService(params.service)
  if (!service) return {}
  return {
    title: `${service.name} — JanSamaadhan`,
    description: service.tagline,
  }
}

export default function OrderPage({ params }: Props) {
  const service = getService(params.service)
  if (!service) notFound()

  return <OrderFlow service={service} />
}
