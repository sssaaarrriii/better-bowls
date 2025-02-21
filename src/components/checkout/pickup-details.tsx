import { formatDate } from '@/lib/utils'

interface PickupDetailsProps {
  location: {
    name: string
    address: string
    city: string
    zip: string
  }
  pickupTime: string
}

/**
 * Pickup Details Component
 * 
 * Display component for showing pickup location and time information.
 * Purely presentational - does not handle any business logic.
 * 
 * Displays:
 * - Pickup location name and address
 * - Pickup time (calculated from class time)
 * - Any additional pickup instructions
 * 
 * Note: This component only displays data passed to it via props
 */
export default function PickupDetails({ location, pickupTime }: PickupDetailsProps) {
  const selectedEvent = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('selectedEvent') || '{}')
    : {}
  const customerInfo = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('customerInfo') || '{}')
    : {}

  const getPickupTime = () => {
    if (!customerInfo.classTime) return pickupTime
    
    // Parse 24hr time format (e.g., "0800")
    const classHour = parseInt(customerInfo.classTime.substring(0, 2))
    
    // Add 50 minutes to class start time
    let pickupHour = classHour
    const pickupMinute = 50  // Class duration is 50 minutes
    
    // Handle hour rollover if needed
    if (pickupMinute >= 60) {
      pickupHour = (pickupHour + 1) % 24
    }
    
    const isPM = pickupHour >= 12
    const displayHour = pickupHour > 12 ? pickupHour - 12 : pickupHour === 0 ? 12 : pickupHour
    
    return `${displayHour}:${pickupMinute} ${isPM ? 'PM' : 'AM'}`
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-recoleta text-xl mb-4">Pickup details</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-recoleta text-lg">
            {selectedEvent.location || location.name || 'Location to be determined'}
          </h4>
          <p className="text-gray-600">
            {selectedEvent.address || location.address || 'Address pending'}
            <br />
            {selectedEvent.city || location.city}, {selectedEvent.zip || location.zip}
          </p>
        </div>
        <div>
          <h4 className="font-recoleta text-lg">Ready at</h4>
          <p className="text-gray-600">{getPickupTime() || 'Time to be determined'}</p>
        </div>
      </div>
    </div>
  )
} 