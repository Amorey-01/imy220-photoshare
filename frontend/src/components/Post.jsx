import Image from './Image';
import Comments from './Comments';

function Post({ post }) {
  return (
    <article>
      <Image src={post.imageUrl} alt={post.description} />
      <p>{post.description}</p>
      <p>{post.hashtags.join(' ')}</p>
      <p>Posted by {post.author}</p>
      <p>In albums: {post.albums.join(', ')}</p>
      <Comments comments={post.comments} />
    </article>
  );
}

export default Post;