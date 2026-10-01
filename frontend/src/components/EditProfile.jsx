import { useState } from 'react';

function EditProfile({ user }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Updated profile:', { name, bio });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Profile</h3>
      <label htmlFor="profileName">Name</label>
      <input
        id="profileName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="profileBio">Bio</label>
      <textarea
        id="profileBio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button type="submit">Save Profile</button>
    </form>
  );
}

export default EditProfile;