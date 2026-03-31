import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Armchair, ShoppingBag } from 'lucide-react';

const SEAT_ROWS = ['A', 'B', 'C', 'D'];
const SEATS_PER_ROW = 8;

const BookingModal = ({ movie, onClose }) => {
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookedSeats();
    }, [movie.id]);

    const fetchBookedSeats = async () => {
        const { data } = await supabase.from('bookings').select('seat_number').eq('movie_id', movie.id);
        if (data) setBookedSeats(data.map(b => b.seat_number));
        setLoading(false);
    };

    const toggleSeat = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]);
    };

    const handleBook = async () => {
        if (selectedSeats.length === 0) return;
        const { error } = await supabase.from('bookings').insert(selectedSeats.map(s => ({ movie_id: movie.id, seat_number: s })));
        if (error) alert(error.message);
        else {
            alert(`Sukses Booking: ${selectedSeats.join(', ')}`);
            onClose();
        }
    };

    if (loading) return <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center font-black">LOADING...</div>;

    return (
        <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-slate-900 w-full max-w-2xl sm:rounded-[3rem] rounded-t-[2.5rem] p-6 sm:p-10 border-t sm:border border-white/10 animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">

                {/* Header Responsive */}
                <div className="flex justify-between items-start mb-8">
                    <div className="pr-8">
                        <h2 className="text-2xl sm:text-3xl font-black italic uppercase leading-none">{movie.title}</h2>
                        <p className="text-red-500 font-black text-[9px] tracking-widest mt-2 uppercase">Select Your Seat</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-red-600 transition-colors"><X size={20} /></button>
                </div>

                {/* Screen Area */}
                <div className="w-full h-8 bg-gradient-to-b from-white/20 to-transparent rounded-t-full mb-12 shadow-[0_-10px_20px_rgba(255,255,255,0.1)] flex justify-center items-end">
                    <span className="text-[8px] font-black tracking-[1em] text-slate-500 mb-2">CINEMA SCREEN</span>
                </div>

                {/* Seats Grid - Responsive Scroll */}
                <div className="overflow-x-auto pb-6 scrollbar-hide">
                    <div className="min-w-[450px] space-y-3">
                        {SEAT_ROWS.map(row => (
                            <div key={row} className="flex justify-center gap-3">
                                <div className="w-5 text-center font-black text-slate-700 text-[10px] self-center">{row}</div>
                                {[...Array(SEATS_PER_ROW)].map((_, i) => {
                                    const seatId = `${row}${i + 1}`;
                                    const isBooked = bookedSeats.includes(seatId);
                                    const isSelected = selectedSeats.includes(seatId);
                                    return (
                                        <button key={seatId} disabled={isBooked} onClick={() => toggleSeat(seatId)}
                                            className={`w-10 h-10 rounded-t-xl rounded-b-md flex flex-col items-center justify-center transition-all ${isBooked ? 'bg-slate-950 text-slate-800' : isSelected ? 'bg-red-600 text-white -translate-y-1' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                                }`}>
                                            <Armchair size={16} />
                                            <span className="text-[7px] font-bold mt-1">{seatId}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checkout Info */}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex gap-4 text-[8px] font-black text-slate-500">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> AVAILABLE</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm"></div> SELECTED</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-950 rounded-sm"></div> BOOKED</div>
                    </div>

                    <button onClick={handleBook} disabled={selectedSeats.length === 0}
                        className="w-full sm:w-auto ml-auto bg-red-600 px-8 py-4 rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-30">
                        <ShoppingBag size={18} /> BOOK ({selectedSeats.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;