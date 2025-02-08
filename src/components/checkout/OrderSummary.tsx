'use client'

import React from 'react'
import Image from 'next/image'
import { formatCurrency } from '../../lib/utils'

interface OrderDetails {
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  discount?: number
  total: number
}

interface OrderSummaryProps {
  orderDetails: OrderDetails
}

export default function OrderSummary({ orderDetails }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {orderDetails.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(orderDetails.subtotal)}</span>
          </div>
          {orderDetails.discount && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(orderDetails.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold mt-2">
            <span>Total</span>
            <span>{formatCurrency(orderDetails.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}