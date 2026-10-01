import { useState } from 'react';

function EditPost({ post }) {
  const [description, setDescription] = useState(post.description);
  const [hashtags, setHashtags] = useState(post.hashtags.join(' '));

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Updated post:', { description, hashtags });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Post</h3>
      <label htmlFor="editDescription">Description</label>
      <textarea
        id="editDescription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="editHashtags">Hashtags</label>
      <input
        id="editHashtags"
        type="text"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />

      <button type="submit">Save Changes</button>
    </form>
  );

}

export default EditPost;