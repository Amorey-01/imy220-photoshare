function Friend({ friend }) {
  return (
    <div>
      <img src={friend.profilePic} alt={friend.username} />
      <p>{friend.username}</p>
    </div>
  );
}

export default Friend;