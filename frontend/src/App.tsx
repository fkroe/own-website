// @ts-ignore
import { useState, useEffect } from 'react'
import { User, Code, Heart, Github, ExternalLink } from 'lucide-react'

interface AboutData {
  name: string
  role: string
  interests: string[]
}

function App() {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch data:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              J
            </div>
            <span className="font-bold tracking-tight">Jack.dev</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Projects</a>
            <a href="#" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full transition-all shadow-[0_0_10px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="mb-24 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />
          <h1 className="text-7xl font-black mb-6 tracking-tighter leading-none bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            Crafting Digital <br />
            Experiences with Go.
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8">
            Building high-performance backend systems and modern, interactive frontends. 
            Currently exploring the intersection of distributed systems and UI design.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all">
              <Github size={20} />
              GitHub
            </button>
            <button className="flex items-center gap-2 border border-zinc-800 px-6 py-3 rounded-full font-bold hover:bg-zinc-900 transition-all">
              View Projects
              <ExternalLink size={18} />
            </button>
          </div>
        </section>

        {/* Data Fetching Demo Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl">
                <User size={24} />
              </div>
              <h3 className="text-2xl font-bold">Profile Details</h3>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-1/2" />
                <div className="h-4 bg-zinc-800 rounded w-5/6" />
              </div>
            ) : data ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-lg font-medium">{data.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Role</p>
                  <p className="text-lg font-medium text-indigo-400">{data.role}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Expertise</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.interests.map(interest => (
                      <span key={interest} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-medium hover:border-indigo-500 transition-colors cursor-default">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-400">Error loading data from API</p>
            )}
          </div>

          <div className="space-y-6">
             <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-600/10 text-pink-400 rounded-xl">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">The Journey</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Moving from crappy HTML to React + TypeScript is a huge step. 
                  This setup demonstrates how Go can serve a high-performance API 
                  while React handles the complex UI logic.
                </p>
             </div>
             <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-600/10 text-emerald-400 rounded-xl">
                    <Code size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Tech Stack</h3>
                </div>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-center gap-2 italic">Backend: Go 1.26 + Standard Library</li>
                  <li className="flex items-center gap-2 italic">Frontend: React 19 + TypeScript</li>
                  <li className="flex items-center gap-2 italic">Styling: Tailwind CSS (V4)</li>
                  <li className="flex items-center gap-2 italic">Build Tool: Vite 6</li>
                </ul>
             </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-900 text-center text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} • Handcrafted with passion and Go.
      </footer>
    </div>
  )
}

export default App
