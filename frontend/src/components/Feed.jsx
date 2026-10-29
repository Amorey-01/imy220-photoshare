import PostPreview from './PostPreview';

function Feed({ posts, empty = 'Nothing here yet.' }) {
  if (!posts.length) return <p className="card text-center text-muted">{empty}</p>;
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => <PostPreview key={post._id} post={post} />)}
    </section>
  );
}

export default Feed;
