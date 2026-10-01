import Image from './Image';

function PostPreview({ post }) {
  return (
    <article>
      <Image src={post.imageUrl} alt={post.description} />
      <p>{post.description}</p>
      <p>{post.hashtags.join(' ')}</p>
      <p>by {post.author}</p>
    </article>
  );
}

export default PostPreview;