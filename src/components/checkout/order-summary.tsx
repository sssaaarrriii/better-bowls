import React from 'react'

interface OrderSummaryProps {
  orderDetails: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      size: string;
      toppings?: Record<string, number>;
      nutrition?: {
        calories: number;
        protein: number;
      };
    }>;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    promoCode?: string;
  }
}

/**
 * Order Summary Component
 * 
 * Pure display component that shows the current order details.
 * Does not handle any calculations or state management.
 * Receives all data via props and simply renders it.
 * 
 * Displays:
 * - Order items and their details
 * - Subtotal
 * - Applied discount (if any)
 * - Tax
 * - Final total
 * 
 * Note: All calculations and promo code logic live in PromoCode.tsx
 */
export default function OrderSummary({ orderDetails }: OrderSummaryProps) {
  const getCustomizationText = (toppings: Record<string, number> = {}) => {
    const changes: string[] = []
    for (const [name, amount] of Object.entries(toppings)) {
      if (amount === 0) {
        changes.push(`- No ${name.toLowerCase()}`)
      } else if (amount > 1) {
        const extraAmount = amount - 1
        changes.push(`- Extra ${extraAmount} serving${extraAmount > 1 ? 's' : ''} of ${name.toLowerCase()}`)
      }
    }
    return changes
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-recoleta text-xl mb-4">Order Summary</h3>
      
      {orderDetails.items.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <span className="font-medium">{item.name} ({item.size})</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
          {item.nutrition && (
            <p className="text-sm text-gray-600 mb-2">
              {item.nutrition.protein}g Protein, {item.nutrition.calories} Calories
            </p>
          )}
          <div className="text-sm text-gray-600 mb-4 space-y-1">
            {getCustomizationText(item.toppings).map((change, i) => (
              <p key={i}>{change}</p>
            ))}
          </div>
        </div>
      ))}
      
      <div className="border-t mt-4 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${orderDetails.subtotal.toFixed(2)}</span>
        </div>
        {orderDetails.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${orderDetails.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${orderDetails.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${orderDetails.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
} 