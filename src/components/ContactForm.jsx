import { useState } from 'react'

export default function ContactForm({ onSubmitted }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to submit')
      setStatus('Thanks! We will reach out shortly.')
      setForm({ name: '', email: '', phone: '', message: '' })
      onSubmitted?.()
    } catch (e) {
      setStatus('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border rounded p-2" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded p-2" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded p-2" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" className="w-full border rounded p-2" required />
      <button disabled={loading} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">
        {loading ? 'Sending...' : 'Send'}
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  )
}
