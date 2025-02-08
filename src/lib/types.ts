export interface Customer {
  name: string
  phone: string
  email?: string
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
  customizations?: string[]
}

export interface Order {
  id: string
  customer: Customer
  items: OrderItem[]
  classTime?: string
  pickupLocation: {
    name: string
    address: string
    city: string
  }
  pickupTime: string
  total: number
  promoCode?: string
  discount?: number
  status: 'pending' | 'confirmed' | 'ready' | 'completed'
  createdAt: string
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
}

export interface ClassSchedule {
  id: string
  locationId: string
  date: string
  time: string
  instructor: string
  name: string
  capacity: number
  bookedCount: number
} 