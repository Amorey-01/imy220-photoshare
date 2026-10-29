import { useState } from 'react';
import { api } from '../api';

function EditPost({ post, onSaved, onCancel }) {
  const [description, setDescription] = useState(post.description);
  const [hashtags, setHashtags] = useState(post.hashtags.map((t) => `#${t}`).join(' '));
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      onSaved(await api(`/posts/${post._id}`, { method: 'PUT', body: { description, hashtags } }));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-sand/60 p-4">
      <h3 className="text-lg font-semibold">Edit Post</h3>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="editDescription" className="label">Description</label>
        <textarea id="editDescription" rows={3} className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label htmlFor="editHashtags" className="label">Hashtags</label>
        <input id="editHashtags" className="input" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save Changes</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default EditPost;
