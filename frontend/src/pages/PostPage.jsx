import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import PageLayout from '../components/PageLayout';
import Post from '../components/Post';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setPost(null);
    api(`/posts/${id}`).then(setPost).catch((e) => setError(e.message));
  }, [id]);

  return (
    <PageLayout>
      {error && <p className="error">{error}</p>}
      {!post && !error && <p className="text-muted">Loading…</p>}
      {post && <Post post={post} onChange={setPost} />}
    </PageLayout>
  );
}

export default PostPage;
