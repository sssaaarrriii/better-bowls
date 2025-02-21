import OrderPage from '@/components/order/OrderPage'

/**
 * Order Entry Page
 * 
 * Starting point of the ordering process.
 * Renders the OrderPage component which begins the order flow:
 * 1. Customer information collection
 * 2. Class selection
 * 3. Routes to product customization
 * 
 * This is a simple wrapper that provides the server/client boundary
 * for the order flow components.
 */

export default function Page() {
  return <OrderPage />
}
