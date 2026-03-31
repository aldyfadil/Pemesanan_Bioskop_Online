import React from 'react';
import { Star, Ticket } from 'lucide-react';

const MovieCard = ({ movie, onBook }) => {
    return (
        <div className="group relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 hover:border-red-600/50 transition-all duration-500">
            <img src={movie.poster_url} alt={movie.title} className="w-full h-[350px] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90"></div>

            <div className="absolute bottom-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500 bg-red-600/10 px-3 py-1 rounded-full mb-3 inline-block">{movie.genre}</span>
                <h3 className="text-xl font-black italic uppercase leading-tight mb-2 text-white">{movie.title}</h3>
                <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs mb-4">
                    <Star size={14} fill="currentColor" /> {movie.rating}
                </div>

                {/* TOMBOL PESAN MUNCUL SAAT DI-HOVER */}
                {onBook && (
                    <button
                        onClick={() => onBook(movie)}
                        className="w-full bg-red-600/90 backdrop-blur-md py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 shadow-lg text-white"
                    >
                        <Ticket size={16} /> Pesan Tiket
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieCard;