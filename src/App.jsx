import { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const fetchTenders = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (category) params.append('category', category)
      const res = await fetch(`${BACKEND_URL}/api/tenders?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load tenders')
      const data = await res.json()
      setTenders(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenders()
  }, [])

  const seed = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/seed`, { method: 'POST' })
      if (res.ok) {
        fetchTenders()
      }
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded bg-emerald-600 text-white grid place-items-center font-bold">QT</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Qatar Tender Platform</h1>
              <p className="text-xs text-gray-500">Discover tenders, submit bids, win projects</p>
            </div>
          </div>
          <a href="/test" className="text-sm text-emerald-700 hover:underline">Check backend</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Search</label>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tenders, tags, issuer..." className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="w-full md:w-56">
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">All</option>
                <option>Construction</option>
                <option>IT</option>
                <option>Healthcare</option>
                <option>Services</option>
              </select>
            </div>
            <button onClick={fetchTenders} className="h-10 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">Search</button>
            <button onClick={seed} className="h-10 px-4 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Load demo data</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading tenders...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenders.map(t => (
              <TenderCard key={t.id} tender={t} />
            ))}
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-gray-500">Made for Qatar businesses</footer>
    </div>
  )
}

function TenderCard({ tender }) {
  const deadline = tender.deadline ? new Date(tender.deadline) : null
  const daysLeft = deadline ? Math.ceil((deadline - new Date()) / (1000*60*60*24)) : null
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{tender.category}</span>
        <span className="text-xs text-gray-500">{tender.location}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{tender.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{tender.description}</p>
      <div className="flex justify-between text-sm text-gray-700">
        <div>Budget: {tender.budget_qar ? `QAR ${tender.budget_qar.toLocaleString()}` : 'N/A'}</div>
        <div>{daysLeft !== null ? `${daysLeft} days left` : ''}</div>
      </div>
      <a href={`https://wa.me/?text=Interested in tender: ${encodeURIComponent(tender.title)}`} className="mt-4 inline-block w-full text-center bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700 transition">Express Interest</a>
    </div>
  )
}

export default App
