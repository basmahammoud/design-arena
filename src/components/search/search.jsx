// components/search/search.js
import './search.css';

const Search = ({ onSearch, containerClassName }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
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
