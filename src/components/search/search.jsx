const Search = ({ originalCategories, setFilteredCategories }) => {
  const handleChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = originalCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCategories(filtered);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      className="search-input"
      onChange={handleChange}
    />
  );
};

export default Search;
