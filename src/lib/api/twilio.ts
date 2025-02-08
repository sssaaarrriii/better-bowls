// Twilio SMS integration (placeholder)

import twilio from 'twilio'

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  throw new Error('Missing Twilio credentials')
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function sendOrderConfirmation(phone: string, orderDetails: {
  id: string
  pickupTime: string
  location: string
}) {
  return client.messages.create({
    body: `Your Better Bowls order #${orderDetails.id} is confirmed! Pick up at ${orderDetails.location} at ${orderDetails.pickupTime}. We'll text you when it's ready!`,
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER,
  })
}

export async function sendOrderReady(phone: string, orderDetails: {
  id: string
  location: string
}) {
  return client.messages.create({
    body: `Your Better Bowls order #${orderDetails.id} is ready for pickup at ${orderDetails.location}! Enjoy!`,
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER,
  })
}