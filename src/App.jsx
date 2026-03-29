import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import MovieCard from './components/MovieCard';
import AdminPanel from './pages/AdminPanel';
import { Film, User, Loader2, LayoutGrid, Flame } from 'lucide-react';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // 1. CEK SESSION & AMBIL DATA
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchMovies();
    return () => subscription.unsubscribe();
  }, []);

  // 2. FUNGSI AMBIL DATA DARI SUPABASE
  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
    if (error) console.log("Error:", error.message);
    else setMovies(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-red-600">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActivePage('home')}>
            <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform"><Film className="text-white" size={24} /></div>
            <h1 className="text-2xl font-black tracking-tighter italic">MOVIETIX</h1>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
            <button onClick={() => setActivePage('home')} className={activePage === 'home' ? 'text-red-500' : 'text-slate-500 hover:text-white'}>Home</button>
            <button onClick={() => setActivePage('movies')} className={activePage === 'movies' ? 'text-red-500' : 'text-slate-500 hover:text-white'}>Movies</button>
          </div>
          <button onClick={() => setActivePage('admin')} className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black transition-all ${session ? 'bg-red-600' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
            <User size={14} /> {session ? 'DASHBOARD' : 'ADMIN LOGIN'}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-8 pt-36 pb-20">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={50} />
            <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Menghubungkan ke Database...</p>
          </div>
        ) : (
          <>
            {activePage === 'home' && (
              <div className="space-y-20 animate-in fade-in duration-1000">
                <section>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4 mb-10">
                    <Flame className="text-red-600" fill="currentColor" /> TRENDING NOW
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {movies.filter(m => m.is_trending).slice(0, 4).map(m => <MovieCard key={m.id} movie={m} />)}
                  </div>
                </section>
              </div>
            )}

            {activePage === 'movies' && (
              <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-700">
                <h2 className="text-5xl font-black italic tracking-tighter flex items-center gap-5">
                  <LayoutGrid className="text-red-600" size={40} /> EXPLORE MOVIES
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {movies.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
              </div>
            )}

            {activePage === 'admin' && (
              <AdminPanel movies={movies} onRefresh={fetchMovies} session={session} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;