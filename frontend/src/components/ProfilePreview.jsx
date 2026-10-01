function ProfilePreview({ user }) {
  return (
    <div>
      <img src={user.profilePic} alt={user.username} />
      <p>{user.username}</p>
    </div>
  );
}

export default ProfilePreview;