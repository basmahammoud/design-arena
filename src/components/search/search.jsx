import './search.css'

const Search = ({ originalCategories, setFilteredCategories, containerClassName }) => {
  const handleChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = originalCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCategories(filtered);
  };

  return (
    <div className={containerClassName}>
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
