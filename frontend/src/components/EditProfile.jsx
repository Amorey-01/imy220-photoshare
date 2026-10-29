import { useState } from 'react';
import { api, fileToDataUrl } from '../api';

function EditProfile({ user, onSaved, onCancel }) {
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [error, setError] = useState('');

  async function pickPic(e) {
    const file = e.target.files[0];
    if (!file) return;
    try { setProfilePic(await fileToDataUrl(file, 300)); } catch (err) { setError(err.message); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      onSaved(await api(`/users/${user._id}`, { method: 'PUT', body: { username, name, bio, profilePic } }));
    } catch (err) { setError(err.message); }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-xl font-semibold">Edit Profile</h3>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="profilePic" className="label">Profile picture</label>
        <div className="flex items-center gap-3">
          {profilePic && <img src={profilePic} alt="Preview" className="h-14 w-14 rounded-full object-cover" />}
          <input id="profilePic" type="file" accept="image/*" onChange={pickPic}
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-sand file:px-4 file:py-2 file:text-sm file:font-semibold" />
        </div>
      </div>
      <div>
        <label htmlFor="profileUsername" className="label">Username</label>
        <input id="profileUsername" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="profileName" className="label">Name</label>
        <input id="profileName" className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="profileBio" className="label">Bio</label>
        <textarea id="profileBio" rows={3} className="input" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save Profile</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default EditProfile;
