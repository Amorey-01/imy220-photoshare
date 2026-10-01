import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users, posts, hashtags..."
      />
    </div>
  );
}

export default SearchInput;