import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import MovieCard from './components/MovieCard';
import AdminPanel from './pages/AdminPanel';
// 1. IMPORT BOOKING MODAL DI SINI
import BookingModal from './components/BookingModal';
import { Film, User, Loader2, LayoutGrid, Flame, Search, Filter } from 'lucide-react';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // 2. STATE UNTUK MUNCULIN POP-UP BOOKING DITARUH DI SINI
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState(null);

  const genres = ['All', 'Action', 'Sci-Fi', 'Horror', 'Animation', 'Drama'];

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

  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
    if (error) console.log("Error:", error.message);
    else setMovies(data);
    setLoading(false);
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-red-600">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActivePage('home')}>
            <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Film className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter italic uppercase">MOVIETIX</h1>
          </div>

          <div className="hidden md:flex items-center gap-10 font-black uppercase tracking-[0.3em]">
            <button onClick={() => setActivePage('home')} className={activePage === 'home' ? 'text-red-500' : 'text-slate-500 hover:text-white'}>Home</button>
            <button onClick={() => setActivePage('movies')} className={activePage === 'movies' ? 'text-red-500' : 'text-slate-500 hover:text-white'}>Explore</button>
          </div>

          <button onClick={() => setActivePage('admin')} className={`flex items-center gap-3 px-6 py-2.5 rounded-full font-black transition-all ${session ? 'bg-red-600' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
            <User size={14} /> {session ? 'DASHBOARD' : 'ADMIN'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-32 pb-20 text-xs relative">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={40} />
            <p className="font-black tracking-widest text-slate-500 uppercase">Synchronizing Database...</p>
          </div>
        ) : (
          <>
            {activePage === 'home' && (
              <div className="space-y-20 animate-in fade-in duration-1000">
                <section className="relative h-[400px] rounded-[3rem] overflow-hidden flex items-center p-12 bg-gradient-to-r from-red-900/20 to-transparent border border-white/5">
                  <div className="max-w-lg space-y-6 z-10">
                    <span className="bg-red-600 px-3 py-1 rounded-full font-black tracking-widest text-[8px]">PREMIUM STREAMING</span>
                    <h2 className="text-6xl font-black tracking-tighter italic leading-none">THE BEST CINEMA EXPERIENCE</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">Watch the latest trending movies from around the world directly from your dashboard.</p>
                    <button onClick={() => setActivePage('movies')} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Explore Movies</button>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-4 mb-10">
                    <Flame className="text-red-600" fill="currentColor" /> TRENDING NOW
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* 3. UBAH MOVIECARD TRENDING DI SINI */}
                    {movies.filter(m => m.is_trending).slice(0, 4).map(m => (
                      <MovieCard key={m.id} movie={m} onBook={(selectedMovie) => setSelectedMovieForBooking(selectedMovie)} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activePage === 'movies' && (
              <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h2 className="text-5xl font-black italic tracking-tighter flex items-center gap-5">
                      <LayoutGrid className="text-red-600" size={40} /> ALL MOVIES
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input type="text" placeholder="Search title..." className="bg-slate-900 border border-white/10 py-4 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 ring-red-600/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="relative group">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <select className="bg-slate-900 border border-white/10 py-4 pl-12 pr-10 rounded-2xl outline-none" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {filteredMovies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* 3. UBAH MOVIECARD EXPLORE DI SINI */}
                    {filteredMovies.map(m => (
                      <MovieCard key={m.id} movie={m} onBook={(selectedMovie) => setSelectedMovieForBooking(selectedMovie)} />
                    ))}
                  </div>
                ) : (
                  <div className="h-[40vh] border-2 border-dashed border-white/5 flex items-center justify-center">No Movies Found</div>
                )}
              </div>
            )}

            {activePage === 'admin' && (
              <AdminPanel movies={movies} onRefresh={fetchMovies} session={session} />
            )}
          </>
        )}

        {/* 4. KOMPONEN BOOKING MODAL DITARUH PALING BAWAH DI DALAM MAIN */}
        {selectedMovieForBooking && (
          <BookingModal
            movie={selectedMovieForBooking}
            onClose={() => setSelectedMovieForBooking(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;