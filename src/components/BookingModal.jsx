import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Armchair } from 'lucide-react';

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
        const { data, error } = await supabase
            .from('bookings')
            .select('seat_number')
            .eq('movie_id', movie.id);

        if (data) {
            setBookedSeats(data.map(b => b.seat_number));
        }
        setLoading(false);
    };

    const toggleSeat = (seatId) => {
        if (bookedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBook = async () => {
        if (selectedSeats.length === 0) return alert("Pilih kursi dulu!");

        // Format data untuk disimpan ke Supabase
        const insertData = selectedSeats.map(seat => ({
            movie_id: movie.id,
            seat_number: seat
        }));

        const { error } = await supabase.from('bookings').insert(insertData);

        if (error) {
            alert("Gagal booking: " + error.message);
        } else {
            alert(`Berhasil memesan kursi: ${selectedSeats.join(', ')}`);
            onClose(); // Tutup modal setelah sukses
        }
    };

    if (loading) return <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center text-white font-black tracking-widest uppercase">Memuat Denah Kursi...</div>;

    return (
        <div className="fixed inset-0 z-[60] bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-[3rem] p-10 animate-in zoom-in duration-300 shadow-2xl">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">{movie.title}</h2>
                        <p className="text-red-500 font-black tracking-[0.3em] text-[10px] mt-2">PILIH KURSI ANDA</p>
                    </div>
                    <button onClick={onClose} className="bg-white/5 p-3 rounded-full hover:bg-red-600 hover:text-white transition-all text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* LAYAR BIOSKOP */}
                <div className="w-full h-12 bg-gradient-to-t from-white/10 to-transparent border-t-4 border-white/20 rounded-t-[50%] mb-12 relative shadow-[0_-10px_30px_rgba(255,255,255,0.05)]">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.5em] text-slate-500">LAYAR UTAMA</span>
                </div>

                {/* BARISAN KURSI */}
                <div className="space-y-4 mb-10">
                    {SEAT_ROWS.map(row => (
                        <div key={row} className="flex justify-center gap-3 sm:gap-6">
                            <div className="w-6 flex items-center justify-center font-black text-slate-600">{row}</div>
                            {[...Array(SEATS_PER_ROW)].map((_, i) => {
                                const seatId = `${row}${i + 1}`;
                                const isBooked = bookedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                return (
                                    <button
                                        key={seatId}
                                        disabled={isBooked}
                                        onClick={() => toggleSeat(seatId)}
                                        className={`p-3 rounded-t-2xl rounded-b-lg transition-all ${isBooked ? 'bg-[#020617] text-slate-800 border border-white/5 cursor-not-allowed opacity-50' :
                                                isSelected ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] -translate-y-2' :
                                                    'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:-translate-y-1'
                                            }`}
                                    >
                                        <Armchair size={24} />
                                        <span className="text-[9px] font-black block mt-2 tracking-widest">{seatId}</span>
                                    </button>
                                );
                            })}
                            <div className="w-6 flex items-center justify-center font-black text-slate-600">{row}</div>
                        </div>
                    ))}
                </div>

                {/* KETERANGAN & TOMBOL BAYAR */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
                    <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <div className="flex items-center gap-2"><div className="w-5 h-5 bg-slate-800 rounded-md"></div> KOSONG</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 bg-red-600 rounded-md"></div> DIPILIH</div>
                        <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#020617] border border-white/5 rounded-md"></div> TERISI</div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">TOTAL TIKET</p>
                            <p className="text-2xl font-black text-white">{selectedSeats.length} <span className="text-sm text-red-500">SEAT</span></p>
                        </div>
                        <button
                            onClick={handleBook}
                            disabled={selectedSeats.length === 0}
                            className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest disabled:opacity-20 hover:bg-red-600 hover:text-white transition-all shadow-xl"
                        >
                            BAYAR SEKARANG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;