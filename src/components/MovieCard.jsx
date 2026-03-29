import React from 'react';
import { Star, Ticket, MonitorPlay } from 'lucide-react';

const MovieCard = ({ movie }) => (
    <div className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 transition-all duration-500 hover:-translate-y-3 hover:border-red-600/50">
        <div className="relative h-[380px] overflow-hidden">
            <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
        </div>
        <div className="absolute bottom-0 p-5 w-full">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase font-black">{movie.genre}</span>
                <div className="flex items-center text-yellow-500 gap-1 text-xs font-bold">
                    <Star size={12} fill="currentColor" /> {movie.rating}
                </div>
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-1 uppercase italic">{movie.title}</h3>
            <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-white text-black py-2.5 rounded-xl font-black text-[10px] hover:bg-red-600 hover:text-white transition-all tracking-widest">BUY TICKET</button>
            </div>
        </div>
    </div>
);

export default MovieCard;