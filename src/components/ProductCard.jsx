export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      {product.image ? (
        <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100 grid place-items-center text-gray-400">No Image</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold">₹{product.price}</span>
          <button
            onClick={() => onAdd(product)}
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-3 py-1.5 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
