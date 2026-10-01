import { useState } from 'react';

function CreatePost() {
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log('New post:', { description, hashtags });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Post</h3>
      <label htmlFor="postImage">Image</label>
      <input id="postImage" type="file" />

      <label htmlFor="postDescription">Description</label>
      <textarea
        id="postDescription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="postHashtags">Hashtags</label>
      <input
        id="postHashtags"
        type="text"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />

      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePost;