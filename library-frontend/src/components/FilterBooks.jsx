const FilterBooks = ({ uniqueGenres, handleGenreClick, handleNoFilterClick }) => {
    return (
        <div>
            {uniqueGenres.map((genre, i) => (
                <button key={i} onClick={() => handleGenreClick(genre)}>
                    {genre}
                </button>
            ))}
            <button onClick={handleNoFilterClick}>all genres</button>
        </div>
    );
};

export default FilterBooks;
