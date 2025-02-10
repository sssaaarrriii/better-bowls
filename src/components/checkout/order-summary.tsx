interface OrderSummaryProps {
  orderDetails: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  }
}

export default function OrderSummary({ orderDetails }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-recoleta text-xl mb-4">Order Summary</h3>
      
      {orderDetails.items.map((item, index) => (
        <div key={index} className="flex justify-between mb-2">
          <span>{item.name}</span>
          <span>${item.price.toFixed(2)}</span>
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