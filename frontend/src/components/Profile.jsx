import Avatar from './Avatar';
import Friend from './Friend';

function Profile({ profile, actions }) {
  return (
    <section className="card flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
      <Avatar user={profile} size="xl" />
      <div className="flex-1 space-y-3">
        <div>
          <h2 className="text-3xl font-bold">{profile.name || profile.username}</h2>
          <p className="text-muted">@{profile.username}{profile.isAdmin && ' · admin'}</p>
        </div>
        {profile.bio && <p>{profile.bio}</p>}
        {actions}
        <div>
          <h3 className="label">Friends ({profile.friends.length})</h3>
          <div className="flex flex-wrap gap-2">
            {profile.friends.length === 0 && <p className="text-sm text-muted">No friends yet.</p>}
            {profile.friends.map((f) => <Friend key={f._id} friend={f} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
