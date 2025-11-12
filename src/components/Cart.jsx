export default function Cart({ items, onCheckout, onRemove }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">₹{item.price * item.qty}</span>
                <button onClick={() => onRemove(idx)} className="text-red-600 text-sm">Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="font-semibold">Total</span>
            <span className="font-bold">₹{total.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">Checkout</button>
        </div>
      )}
    </div>
  )
}
