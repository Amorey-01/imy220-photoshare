import Friend from './Friend';
import PostPreview from './PostPreview';

function Profile({ user, posts, friends }) {
  return (
    <section>
      <img src={user.profilePic} alt={user.username} />
      <h2>{user.name} (@{user.username})</h2>
      <p>{user.bio}</p>

      <h3>Friends</h3>
      <div>
        {friends.map((friend) => (
          <Friend key={friend.id} friend={friend} />
        ))}
      </div>

      <h3>Posts</h3>
      <div>
        {posts.map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default Profile;