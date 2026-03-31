{/* Ganti bagian grid film di App.jsx jadi begini */ }
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
  {filteredMovies.map(m => (
    <MovieCard key={m.id} movie={m} onBook={(sm) => setSelectedMovieForBooking(sm)} />
  ))}
</div>