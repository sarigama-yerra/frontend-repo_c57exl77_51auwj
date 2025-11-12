import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import ContactForm from './components/ContactForm'
import Cart from './components/Cart'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function SectionTitle({ children }) {
  return <h2 className="text-2xl font-bold mb-4 text-gray-800">{children}</h2>
}

export default function App() {
  const [route, setRoute] = useState('home')
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const loadProducts = async (cat) => {
    setLoading(true)
    try {
      const url = new URL(`${baseUrl}/api/products`)
      if (cat && cat !== 'all') url.searchParams.set('category', cat)
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      setMessage('Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts(category === 'all' ? undefined : category)
  }, [category])

  const onAdd = (p) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x._id === p._id)
      if (idx !== -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }
        return copy
      }
      return [...prev, { _id: p._id, title: p.title, price: p.price, qty: 1 }]
    })
  }

  const removeItem = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx))
  }

  const checkout = async () => {
    if (cart.length === 0) return
    setMessage('')
    try {
      const orderRes = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ product_id: i._id, title: i.title, price: i.price, qty: i.qty })),
          customer_name: 'Guest',
          customer_email: 'guest@example.com',
        })
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.detail || 'Failed to create order')

      const piRes = await fetch(`${baseUrl}/api/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderData.order_id })
      })
      const piData = await piRes.json()
      if (!piRes.ok) throw new Error(piData.detail || 'Failed to start payment')

      setMessage(`Payment initiated. Reference: ${piData.reference}`)
      // Simulate success confirmation immediately for demo
      const confirmRes = await fetch(`${baseUrl}/api/payments/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderData.order_id, success: true, reference: piData.reference })
      })
      const confirm = await confirmRes.json()
      if (!confirmRes.ok) throw new Error(confirm.detail || 'Payment confirmation failed')
      setMessage('Payment successful! Order confirmed.')
      setCart([])
    } catch (e) {
      setMessage(e.message)
    }
  }

  const filtered = useMemo(() => {
    if (category === 'all') return products
    return products.filter((p) => p.category === category)
  }, [products, category])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar cartCount={cart.length} onNavigate={setRoute} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {route === 'home' && (
          <div className="space-y-10">
            <section className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Pranesta Jewellery</h1>
                <p className="mt-4 text-gray-600">Fine craftsmanship in Silver and Oxidised collections. Discover timeless pieces that elevate your everyday style.</p>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => { setCategory('silver'); setRoute('catalog') }} className="bg-gray-900 text-white px-4 py-2 rounded">Shop Silver</button>
                  <button onClick={() => { setCategory('oxidised'); setRoute('catalog') }} className="bg-pink-600 text-white px-4 py-2 rounded">Shop Oxidised</button>
                </div>
              </div>
              <div className="aspect-video rounded-2xl bg-[radial-gradient(ellipse_at_top_left,theme(colors.pink.200),theme(colors.rose.100))]" />
            </section>

            <section>
              <SectionTitle>Collections</SectionTitle>
              <div className="flex gap-3">
                <button onClick={() => setCategory('all')} className={`px-3 py-1.5 rounded border ${category==='all'?'bg-gray-900 text-white':'bg-white'}`}>All</button>
                <button onClick={() => setCategory('silver')} className={`px-3 py-1.5 rounded border ${category==='silver'?'bg-gray-900 text-white':'bg-white'}`}>Silver</button>
                <button onClick={() => setCategory('oxidised')} className={`px-3 py-1.5 rounded border ${category==='oxidised'?'bg-gray-900 text-white':'bg-white'}`}>Oxidised</button>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  filtered.map((p) => (
                    <ProductCard key={p._id} product={p} onAdd={onAdd} />
                  ))
                )}
              </div>
            </section>

            <section id="contact">
              <SectionTitle>Send us a query</SectionTitle>
              <div className="bg-white rounded-xl p-6 border">
                <ContactForm onSubmitted={() => setMessage('We have received your message.')} />
              </div>
            </section>
          </div>
        )}

        {route === 'catalog' && (
          <div>
            <SectionTitle>{category === 'all' ? 'All Products' : category.charAt(0).toUpperCase()+category.slice(1)}</SectionTitle>
            <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {loading ? (
                <p>Loading...</p>
              ) : (
                filtered.map((p) => (
                  <ProductCard key={p._id} product={p} onAdd={onAdd} />
                ))
              )}
            </div>
          </div>
        )}

        {route === 'contact' && (
          <div className="max-w-xl">
            <SectionTitle>Send us a query</SectionTitle>
            <div className="bg-white rounded-xl p-6 border">
              <ContactForm onSubmitted={() => setMessage('We have received your message.')} />
            </div>
          </div>
        )}

        {route === 'cart' && (
          <div className="max-w-xl">
            <Cart items={cart} onCheckout={checkout} onRemove={removeItem} />
          </div>
        )}

        {message && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow">{message}</div>
        )}
      </main>

      <footer className="border-t py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Pranesta Jewellery. All rights reserved.</footer>
    </div>
  )
}
