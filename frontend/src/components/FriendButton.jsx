import { useState } from 'react';
import { api } from '../api';

// Shows the right friend action for the current relationship (none / sent / received / friends).
function FriendButton({ userId, status, onChange }) {
  const [error, setError] = useState('');

  async function act(path, method = 'POST') {
    try {
      const res = await api(`/friends/${path}`, { method });
      setError('');
      onChange(res.friendStatus);
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === 'none' && <button className="btn-primary" onClick={() => act(`request/${userId}`)}>Add friend</button>}
      {status === 'sent' && <button className="btn-ghost" onClick={() => act(userId, 'DELETE')}>Request sent · Cancel</button>}
      {status === 'received' && (
        <>
          <button className="btn-sage" onClick={() => act(`accept/${userId}`)}>Accept request</button>
          <button className="btn-ghost" onClick={() => act(`decline/${userId}`)}>Decline</button>
        </>
      )}
      {status === 'friends' && <button className="btn-danger" onClick={() => act(userId, 'DELETE')}>Unfriend</button>}
      {error && <span className="text-sm text-clayDark">{error}</span>}
    </div>
  );
}

export default FriendButton;
