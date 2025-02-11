// Airtable API integration using Personal Access Token (PAT)
import Airtable from 'airtable'
import type { Order } from '../types'

// Validate required environment variables
const requiredEnvVars = {
  pat: process.env.AIRTABLE_PAT,
  baseId: process.env.AIRTABLE_BASE_ID
}

if (!requiredEnvVars.pat || !requiredEnvVars.baseId) {
  throw new Error(
    'Missing Airtable credentials. Required: AIRTABLE_PAT, AIRTABLE_BASE_ID'
  )
}

// Initialize Airtable with PAT
const airtable = new Airtable({
  apiKey: requiredEnvVars.pat,  // Using PAT for authentication
  endpointUrl: 'https://api.airtable.com',  // Explicit endpoint
})

const base = airtable.base(requiredEnvVars.baseId)
const ORDERS_TABLE = 'Orders'  // Table name constant

export async function createOrder(order: any) {
  try {
    const records = await base(ORDERS_TABLE).create([
      {
        fields: {
          id: order.id,
          customer: JSON.stringify(order.customer),
          items: JSON.stringify(order.items),
          pickupLocation: order.pickupLocation,
          pickupTime: order.pickupTime,
          total: order.total,
          status: order.status,
          createdAt: new Date().toISOString(),
        },
      },
    ])

    return records[0]  // Return the created record
  } catch (error) {
    console.error('Airtable create order error:', error)
    throw new Error('Failed to create order in Airtable')
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  try {
    // Use a more secure filterByFormula to prevent injection
    const formula = `RECORD_ID() = '${orderId.replace(/'/g, "\\'")}'`
    
    const records = await base(ORDERS_TABLE)
      .select({
        filterByFormula: formula,
        maxRecords: 1,
      })
      .firstPage()

    if (!records || records.length === 0) {
      throw new Error(`Order not found: ${orderId}`)
    }

    const updatedRecords = await base(ORDERS_TABLE).update([
      {
        id: records[0].id,
        fields: {
          status: status,
          updatedAt: new Date().toISOString(),
        },
      },
    ])

    return updatedRecords[0]
  } catch (error) {
    console.error('Airtable update order error:', error)
    throw new Error(`Failed to update order status: ${orderId}`)
  }
}