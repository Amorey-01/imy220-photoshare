import { useState } from 'react';
import { api } from '../api';

// Used for both creating (no `album`) and editing an album.
function AlbumForm({ album, onSaved, onCancel }) {
  const [name, setName] = useState(album?.name || '');
  const [description, setDescription] = useState(album?.description || '');
  const [hashtags, setHashtags] = useState((album?.hashtags || []).map((t) => `#${t}`).join(' '));
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const body = { name, description, hashtags };
      const saved = album
        ? await api(`/albums/${album._id}`, { method: 'PUT', body })
        : await api('/albums', { method: 'POST', body });
      onSaved(saved);
    } catch (err) { setError(err.message); }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-xl font-semibold">{album ? 'Edit Album' : 'Create Album'}</h3>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="albumName" className="label">Name</label>
        <input id="albumName" className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="albumDescription" className="label">Description</label>
        <textarea id="albumDescription" rows={2} className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label htmlFor="albumHashtags" className="label">Hashtags</label>
        <input id="albumHashtags" className="input" placeholder="#sketch #art" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">{album ? 'Save Album' : 'Create Album'}</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default AlbumForm;
