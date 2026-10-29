import { Link } from 'react-router-dom';
import Avatar from './Avatar';

function Friend({ friend }) {
  return (
    <Link to={`/profile/${friend._id}`} className="flex items-center gap-2 rounded-full bg-sand py-1 pl-1 pr-4 hover:bg-sandDark/60">
      <Avatar user={friend} size="sm" />
      <span className="text-sm font-medium">{friend.username}</span>
    </Link>
  );
}

export default Friend;
