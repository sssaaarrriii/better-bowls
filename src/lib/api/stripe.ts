// Stripe API integration

import Stripe from 'stripe'

// Server-side only validation
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

// Initialize Stripe with correct API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
  typescript: true,
})

// Type for consistent payment error handling
export interface PaymentError {
  type: 'validation' | 'payment' | 'server'
  message: string
}

// Type for order details used across components
export interface OrderDetails {
  items: Array<{
    name: string
    quantity: number
    price: number
    size: string
    toppings?: Record<string, number>
    nutrition?: {
      calories: number
      protein: number
    }
    notes?: string
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  customerInfo: {
    name: string
    phone: string
    email?: string
  }
  promoCode?: string
  pickupLocation?: string
  pickupTime?: string
}

// Helper function to validate order amounts
export const validateOrderAmounts = (orderDetails: OrderDetails): boolean => {
  const { subtotal, discount, tax, total } = orderDetails
  
  // Ensure all amounts are non-negative
  if (subtotal < 0 || discount < 0 || tax < 0 || total < 0) {
    return false
  }
  
  // Validate total calculation
  const calculatedTotal = subtotal - discount + tax
  return Math.abs(calculatedTotal - total) < 0.01 // Account for floating point math
}

// Helper to format amount for Stripe (converts dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}

// Constants for Stripe configuration
export const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#5E7153',
  },
}

// Define the type locally
export interface ExpressCheckoutElementClickResolveDetails {
  phoneNumberRequired: boolean
  emailRequired: boolean
  shippingAddressRequired: boolean
  billingAddressRequired: boolean
  lineItems: Array<{
    name: string
    amount: number
  }>
  amount: number
  label: string
}

export async function createCheckoutSession(order: any) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?id=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/order/cancel`,
    line_items: order.items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    metadata: {
      orderId: order.id,
    },
  })
}

export const createPaymentIntent = async (amount: number, metadata: Record<string, string>) => {
  return stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

export const retrievePaymentIntent = async (id: string) => {
  return stripe.paymentIntents.retrieve(id)
}

export const updatePaymentIntent = async (id: string, data: Partial<Stripe.PaymentIntentUpdateParams>) => {
  return stripe.paymentIntents.update(id, data)
}