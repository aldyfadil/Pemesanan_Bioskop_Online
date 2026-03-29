import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Lock, LogOut, Star, Edit3, X } from 'lucide-react';

const AdminPanel = ({ movies, onRefresh, session }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State untuk Form (Bisa untuk Tambah atau Edit)
    const [formData, setFormData] = useState({
        title: '', genre: 'Action', rating: 0, poster_url: '', is_trending: false
    });

    // State untuk menandai apakah sedang mode EDIT
    const [editId, setEditId] = useState(null);

    // 1. FUNGSI LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert("Gagal Login: " + error.message);
    };

    // 2. FUNGSI SIMPAN (TAMBAH atau UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editId) {
            // MODE UPDATE
            const { error } = await supabase.from('movies').update(formData).eq('id', editId);
            if (error) alert(error.message);
            else {
                alert("Film Berhasil Diperbarui!");
                resetForm();
            }
        } else {
            // MODE TAMBAH
            const { error } = await supabase.from('movies').insert([formData]);
            if (error) alert(error.message);
            else {
                alert("Film Berhasil Ditambah!");
                resetForm();
            }
        }
        onRefresh();
    };

    // 3. FUNGSI SET KE MODE EDIT
    const handleEditClick = (movie) => {
        setEditId(movie.id);
        setFormData({
            title: movie.title,
            genre: movie.genre,
            rating: movie.rating,
            poster_url: movie.poster_url,
            is_trending: movie.is_trending
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke form atas
    };

    // 4. FUNGSI HAPUS
    const deleteMovie = async (id) => {
        if (window.confirm("Yakin mau hapus film ini?")) {
            const { error } = await supabase.from('movies').delete().eq('id', id);
            if (error) alert(error.message);
            else onRefresh();
        }
    };

    const resetForm = () => {
        setFormData({ title: '', genre: 'Action', rating: 0, poster_url: '', is_trending: false });
        setEditId(null);
    };

    if (!session) {
        return (
            <div className="max-w-md mx-auto mt-10 bg-slate-900 p-10 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex justify-center mb-6"><Lock className="text-red-600" size={40} /></div>
                <h2 className="text-2xl font-black text-center mb-8 italic uppercase tracking-widest">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full bg-slate-800 p-4 rounded-xl outline-none border border-transparent focus:border-red-600 transition-all" onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full bg-slate-800 p-4 rounded-xl outline-none border border-transparent focus:border-red-600 transition-all" onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" className="w-full bg-red-600 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Masuk Sekarang</button>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 space-y-10 pb-20">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter">ADMIN CONSOLE</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Manage your movie database</p>
                </div>
                <button onClick={() => supabase.auth.signOut()} className="bg-red-600/10 text-red-500 px-6 py-2 rounded-full text-[10px] font-black hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                    <LogOut size={14} /> LOGOUT
                </button>
            </div>

            {/* FORM INPUT/EDIT */}
            <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${editId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-900/50 border-white/5'}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black italic flex items-center gap-3">
                        {editId ? <Edit3 className="text-blue-500" /> : <Plus className="text-red-600" />}
                        {editId ? 'UPDATE MOVIE DETAILS' : 'ADD NEW CINEMA'}
                    </h2>
                    {editId && (
                        <button onClick={resetForm} className="text-[10px] font-bold bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-red-600 transition-all">
                            <X size={12} /> CANCEL EDIT
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 ml-2">MOVIE TITLE</label>
                        <input type="text" className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 ring-red-600/20" placeholder="e.g. Spider-Man: No Way Home" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 ml-2">POSTER URL</label>
                        <input type="text" className="w-full bg-slate-800 p-4 rounded-2xl outline-none focus:ring-2 ring-red-600/20" placeholder="https://..." required value={formData.poster_url} onChange={e => setFormData({ ...formData, poster_url: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 ml-2">GENRE</label>
                        <select className="w-full bg-slate-800 p-4 rounded-2xl outline-none appearance-none" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })}>
                            <option value="Action">Action</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Horror">Horror</option>
                            <option value="Animation">Animation</option>
                            <option value="Drama">Drama</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 ml-2">RATING</label>
                        <input type="number" step="0.1" className="w-full bg-slate-800 p-4 rounded-2xl outline-none" placeholder="0.0" required value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <input type="checkbox" className="w-6 h-6 accent-red-600 cursor-pointer" id="trending" checked={formData.is_trending} onChange={e => setFormData({ ...formData, is_trending: e.target.checked })} />
                        <label htmlFor="trending" className="text-xs font-black uppercase tracking-widest cursor-pointer select-none">Show in Trending Section</label>
                    </div>

                    <button type="submit" className={`md:col-span-2 py-5 rounded-2xl font-black uppercase tracking-[0.4em] transition-all shadow-lg ${editId ? 'bg-blue-600 hover:bg-white hover:text-blue-600' : 'bg-red-600 hover:bg-white hover:text-red-600'}`}>
                        {editId ? 'Apply Changes' : 'Publish Movie'}
                    </button>
                </form>
            </div>

            {/* LIST TABLE */}
            <div className="bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/5">
                    <h2 className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase">Live Database Entries</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/50">
                                <th className="p-6">Movie Info</th>
                                <th className="p-6">Genre</th>
                                <th className="p-6">Rating</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {movies.map(movie => (
                                <tr key={movie.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={movie.poster_url} className="w-12 h-16 object-cover rounded-lg shadow-lg border border-white/10" alt="" />
                                            <div>
                                                <p className="font-bold text-white uppercase italic text-sm">{movie.title}</p>
                                                {movie.is_trending && <span className="text-[8px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded-full font-black">TRENDING</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-400 text-xs font-bold uppercase">{movie.genre}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-1 text-yellow-500 font-black text-sm">
                                            <Star size={14} fill="currentColor" /> {movie.rating}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(movie)} className="bg-blue-600/20 text-blue-500 p-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => deleteMovie(movie.id)} className="bg-red-600/20 text-red-500 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;