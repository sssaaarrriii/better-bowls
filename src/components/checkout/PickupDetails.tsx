import { formatDate } from '../../lib/utils'

interface PickupDetailsProps {
  location: {
    name: string
    address: string
    city: string
  }
  pickupTime: string
}

export default function PickupDetails({ location, pickupTime }: PickupDetailsProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-recoleta text-xl mb-4">Pickup details</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-recoleta text-lg">{location.name}</h4>
          <p className="text-gray-600">
            {location.address}
            <br />
            {location.city}
          </p>
        </div>
        <div>
          <h4 className="font-recoleta text-lg">Ready at</h4>
          <p className="text-gray-600">{formatDate(pickupTime)}</p>
        </div>
      </div>
    </div>
  )
} 