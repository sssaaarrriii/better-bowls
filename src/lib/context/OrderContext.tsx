'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Customer, OrderItem, Location } from '../types'

interface OrderState {
  customer?: Customer
  item?: OrderItem
  location?: Location
  classTime?: string
  pickupTime?: string
  promoCode?: string
  discount?: number
}

type OrderAction =
  | { type: 'SET_CUSTOMER'; payload: Customer }
  | { type: 'SET_ITEM'; payload: OrderItem }
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'SET_CLASS_TIME'; payload: string }
  | { type: 'SET_PICKUP_TIME'; payload: string }
  | { type: 'APPLY_PROMO'; payload: { code: string; discount: number } }
  | { type: 'RESET_ORDER' }

const OrderContext = createContext<{
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
} | undefined>(undefined)

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload }
    case 'SET_ITEM':
      return { ...state, item: action.payload }
    case 'SET_LOCATION':
      return { ...state, location: action.payload }
    case 'SET_CLASS_TIME':
      return { ...state, classTime: action.payload }
    case 'SET_PICKUP_TIME':
      return { ...state, pickupTime: action.payload }
    case 'APPLY_PROMO':
      return {
        ...state,
        promoCode: action.payload.code,
        discount: action.payload.discount,
      }
    case 'RESET_ORDER':
      return {}
    default:
      return state
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, {})

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
} 