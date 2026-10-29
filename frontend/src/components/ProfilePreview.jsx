import { Link } from 'react-router-dom';
import Avatar from './Avatar';

function ProfilePreview({ user, children }) {
  return (
    <div className="card flex items-center gap-3 !p-3">
      <Link to={`/profile/${user._id}`} className="flex flex-1 items-center gap-3">
        <Avatar user={user} />
        <div>
          <p className="font-semibold">{user.username}</p>
          {user.name && <p className="text-xs text-muted">{user.name}</p>}
        </div>
      </Link>
      {children}
    </div>
  );
}

export default ProfilePreview;
