import { Link } from 'react-router-dom';
import Image from './Image';
import Avatar from './Avatar';

function PostPreview({ post }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-sandDark/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/post/${post._id}`} className="block aspect-square overflow-hidden bg-sand">
        <Image src={post.image} alt={post.description} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      </Link>
      <div className="space-y-2 p-4">
        <Link to={`/profile/${post.author._id}`} className="flex items-center gap-2">
          <Avatar user={post.author} size="sm" />
          <span className="text-sm font-semibold">{post.author.username}</span>
        </Link>
        <p className="line-clamp-2 text-sm text-ink/90">{post.description}</p>
        <div className="flex flex-wrap gap-1">
          {post.hashtags.map((t) => <span key={t} className="tag">#{t}</span>)}
        </div>
        <p className="text-xs text-muted">♥ {post.likes.length} · 💬 {post.comments.length}</p>
      </div>
    </article>
  );
}

export default PostPreview;
