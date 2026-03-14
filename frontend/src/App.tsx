import { AuthProvider, useAuth } from './lib/AuthContext'
import { AuthModal } from './components/AuthModal'
import './App.css'
import { BackgroundBeams } from './components/BackgroundBeams'

function AppContent() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <BackgroundBeams className="opacity-40" />
        <div className="z-10 text-white/50 text-base font-mono tracking-widest animate-pulse">
          INITIALIZING_SYSTEM...
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthModal />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden font-sans">
      <BackgroundBeams className="opacity-20" />
      
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md bg-black/20">
        <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-sm font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              CareerCheatCode
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-zinc-500 font-medium">AUTHENTICATED AS</span>
              <span className="text-sm text-zinc-200">{user.full_name || user.email}</span>
            </div>
            <button 
              onClick={logout}
              className="px-5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-all text-xs font-semibold tracking-wide"
            >
              SIGN OUT
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Command Center</h2>
          <p className="text-zinc-500">Accelerate your career with AI-driven resume engineering.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Resume Engine",
              desc: "Engineered templates with 99% ATS pass rates.",
              btn: "Open Lab",
              color: "from-purple-600 to-indigo-700"
            },
            {
              title: "Core Profile",
              desc: "Manage your professional data points and skills.",
              btn: "Edit Profile",
              color: "from-blue-600 to-cyan-700"
            },
            {
              title: "Raw Extract",
              desc: "Convert PDFs into high-fidelity JSON structures.",
              btn: "Upload PDF",
              color: "from-emerald-600 to-teal-700"
            }
          ].map((card, i) => (
            <div key={i} className="group relative p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] hover:border-white/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
              <div className="relative z-10 text-left">
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{card.desc}</p>
                <button className={`w-full py-3.5 bg-gradient-to-r ${card.color} rounded-2xl font-bold shadow-xl shadow-black/40 hover:scale-[1.02] active:scale-[0.98] transition-all`}>
                  {card.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
