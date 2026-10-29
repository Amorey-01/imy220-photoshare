function SearchInput({ value, onChange }) {
  return (
    <div className="w-full sm:max-w-xs">
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        id="search"
        type="search"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search posts, hashtags, people…"
      />
    </div>
  );
}

export default SearchInput;
