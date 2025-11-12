import { ShoppingCart, Gem, Phone } from 'lucide-react'

export default function Navbar({ cartCount, onNavigate }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <Gem className="text-pink-600" />
          <span className="font-bold text-xl">Pranesta Jewellery</span>
        </button>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <button onClick={() => onNavigate('silver')} className="hover:text-pink-600">Silver</button>
          <button onClick={() => onNavigate('oxidised')} className="hover:text-pink-600">Oxidised</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-pink-600 flex items-center gap-1"><Phone size={16}/>Contact</button>
        </nav>
        <button onClick={() => onNavigate('cart')} className="relative">
          <ShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 grid place-items-center">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}
