// Airtable API integration
import Airtable from 'airtable'
import type { Order } from '../types'

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Missing Airtable credentials')
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!)

export async function createOrder(order: any) {
  return await base('Orders').create([
    {
      fields: {
        id: order.id,
        customer: JSON.stringify(order.customer),
        items: JSON.stringify(order.items),
        pickupLocation: order.pickupLocation,
        pickupTime: order.pickupTime,
        total: order.total,
        status: order.status,
      },
    },
  ])
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const records = await base('Orders')
    .select({
      filterByFormula: `{Order ID} = '${orderId}'`,
    })
    .firstPage()

  if (records.length === 0) {
    throw new Error('Order not found')
  }

  return base('Orders').update([
    {
      id: records[0].id,
      fields: {
        'Status': status,
      },
    },
  ])
}